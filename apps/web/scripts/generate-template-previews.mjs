/**
 * Generates desktop + mobile preview screenshots for template HTML demos.
 * Usage: node scripts/generate-template-previews.mjs
 * Requires: npx playwright (installed on first run)
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const webRoot = join(__dirname, "..");
const publicDir = join(webRoot, "public");
const previewsDir = join(publicDir, "templates", "previews");

const templates = [
  { id: "velox-showroom", html: "velox-showroom.html", waitMs: 4500 },
  { id: "nexus", html: "nexus.html", waitMs: 4000 },
  { id: "stone-archive", html: "stone-archive.html", waitMs: 3500 },
  { id: "chen-lei", html: "chen-lei.html", waitMs: 3500 },
  { id: "noir-restaurant", html: "noir-restaurant.html", waitMs: 4000 },
  { id: "chronos-infinitum", html: "chronos-infinitum.html", waitMs: 3500 },
  { id: "sketchbook-3d", html: "sketchbook-3d.html", waitMs: 3000 },
  { id: "the-last-library", html: "the-last-library.html", waitMs: 3000 },
];

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
};

function startStaticServer() {
  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      const urlPath = decodeURIComponent(req.url?.split("?")[0] ?? "/");
      const filePath = join(publicDir, urlPath === "/" ? "index.html" : urlPath);

      if (!filePath.startsWith(publicDir) || !existsSync(filePath)) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }

      const ext = filePath.slice(filePath.lastIndexOf("."));
      const body = await readFile(filePath);
      res.writeHead(200, { "Content-Type": contentTypes[ext] ?? "application/octet-stream" });
      res.end(body);
    });

    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${port}` });
    });
  });
}

async function main() {
  const { chromium } = await import("playwright");
  const { server, baseUrl } = await startStaticServer();

  const browser = await chromium.launch({ headless: true });

  try {
    for (const template of templates) {
      const page = await browser.newPage();
      const url = `${baseUrl}/template-demos/${template.html}`;

      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(template.waitMs);

      const desktopPath = join(previewsDir, `${template.id}.jpg`);
      await page.screenshot({
        path: desktopPath,
        type: "jpeg",
        quality: 88,
        fullPage: false,
      });
      console.log(`✓ Desktop: ${template.id}`);

      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(800);

      const mobilePath = join(previewsDir, `${template.id}-mobile.jpg`);
      await page.screenshot({
        path: mobilePath,
        type: "jpeg",
        quality: 88,
        fullPage: false,
      });
      console.log(`✓ Mobile: ${template.id}`);

      await page.close();
    }
  } finally {
    await browser.close();
    server.close();
  }

  console.log("\nAll template previews generated.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
