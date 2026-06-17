import JSZip from "jszip";
import type { CinematicExperience } from "@/lib/cinematic/types";

const fetchBuffer = async (url: string): Promise<Buffer | null> => {
  try {
    if (url.startsWith("data:")) {
      const match = url.match(/^data:[^;]+;base64,(.+)$/);
      if (!match?.[1]) return null;
      return Buffer.from(match[1], "base64");
    }
    if (url.startsWith("http://") || url.startsWith("https://")) {
      const response = await fetch(url);
      if (!response.ok) return null;
      return Buffer.from(await response.arrayBuffer());
    }
    return null;
  } catch {
    return null;
  }
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const buildIndexHtml = (experience: CinematicExperience, framePaths: string[]) => {
  const scenesJson = JSON.stringify(experience.scenes);
  const frameListJson = JSON.stringify(framePaths);
  const title = escapeHtml(experience.seo.title || experience.projectName);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <meta name="description" content="${escapeHtml(experience.seo.description)}" />
  <link rel="stylesheet" href="styles/cinematic.css" />
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/lenis@1.3.3/dist/lenis.min.js"></script>
</head>
<body>
  <div id="root" class="cinematic-root">
    <div id="pin" class="cinematic-pin">
      <canvas id="canvas" class="cinematic-canvas"></canvas>
      <div class="cinematic-vignette"></div>
      <div id="overlay" class="cinematic-overlay">
        <p class="cinematic-eyebrow">${escapeHtml(experience.projectName)}</p>
        <h1 id="scene-title" class="cinematic-title"></h1>
        <p id="scene-subtitle" class="cinematic-subtitle"></p>
        <p id="scene-body" class="cinematic-body"></p>
      </div>
    </div>
    <section class="cinematic-cta">
      <h2>${escapeHtml(experience.scenes[experience.scenes.length - 1]?.ctaLabel ?? "Begin your journey")}</h2>
      <p>${escapeHtml(experience.story)}</p>
    </section>
  </div>
  <script>
    const scenes = ${scenesJson};
    const framePaths = ${frameListJson};
    const scrollHeightVh = ${experience.scrollHeightVh};
    gsap.registerPlugin(ScrollTrigger);
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const images = [];
    let loaded = 0;
    const draw = (index) => {
      const img = images[Math.min(images.length - 1, Math.max(0, index))];
      if (!img || !ctx) return;
      canvas.width = img.naturalWidth || 1920;
      canvas.height = img.naturalHeight || 1080;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    const activeScene = (progress) => {
      let active = scenes[0];
      for (const scene of scenes) if (progress >= scene.scrollStart) active = scene;
      return active;
    };
    const updateScene = (progress) => {
      const scene = activeScene(progress);
      document.getElementById("scene-title").textContent = scene?.title ?? "";
      document.getElementById("scene-subtitle").textContent = scene?.subtitle ?? "";
      document.getElementById("scene-body").textContent = scene?.body ?? "";
    };
    const boot = () => {
      const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
      gsap.timeline({
        scrollTrigger: {
          trigger: "#root",
          start: "top top",
          end: "+=" + scrollHeightVh + "%",
          scrub: true,
          pin: "#pin",
          onUpdate: (self) => {
            const progress = self.progress;
            updateScene(progress);
            if (images.length) draw(Math.round(progress * (images.length - 1)));
          },
        },
      });
      draw(0);
      updateScene(0);
    };
    if (!framePaths.length) {
      boot();
    } else {
      framePaths.forEach((src, index) => {
        const img = new Image();
        img.onload = () => {
          loaded += 1;
          if (loaded === framePaths.length) boot();
        };
        img.onerror = () => {
          loaded += 1;
          if (loaded === framePaths.length) boot();
        };
        img.src = src;
        images[index] = img;
      });
    }
  </script>
</body>
</html>`;
};

const cinematicCss = `
.cinematic-root{background:#050505;color:#f5f3ef;min-height:100vh;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif}
.cinematic-pin{position:relative;width:100%;height:100vh;overflow:hidden}
.cinematic-canvas{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.cinematic-vignette{position:absolute;inset:0;background:radial-gradient(circle at center,transparent 40%,rgba(0,0,0,.65) 100%)}
.cinematic-overlay{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:clamp(24px,6vw,80px);z-index:2;background:linear-gradient(to top,rgba(0,0,0,.75),transparent 55%)}
.cinematic-eyebrow{font-size:11px;letter-spacing:.35em;text-transform:uppercase;color:#c9a84c;margin-bottom:16px}
.cinematic-title{font-size:clamp(2.5rem,7vw,5.5rem);font-weight:100;line-height:1.05;margin:0 0 12px;max-width:12ch}
.cinematic-subtitle{font-size:clamp(.85rem,1.5vw,1rem);letter-spacing:.12em;text-transform:uppercase;color:#9ca3af;margin:0 0 12px}
.cinematic-body{font-size:clamp(.95rem,1.4vw,1.1rem);line-height:1.7;color:#d1d5db;max-width:520px;margin:0}
.cinematic-cta{min-height:60vh;display:grid;place-content:center;text-align:center;padding:80px 24px 120px;background:#050505}
.cinematic-cta h2{font-size:clamp(2rem,5vw,3.5rem);font-weight:100;margin:0 0 16px}
.cinematic-cta p{max-width:640px;margin:0 auto;color:#9ca3af;line-height:1.7}
`;

export async function buildCinematicWebsiteZip(
  projectName: string,
  experience: CinematicExperience,
): Promise<Buffer> {
  const zip = new JSZip();
  const safeName = projectName.replace(/[^\w\-]+/g, "-").replace(/^-+|-+$/g, "") || "stoneai-site";
  const root = zip.folder(safeName)!;

  const framePaths: string[] = [];
  const frames = experience.frames.slice(0, 120);

  for (let index = 0; index < frames.length; index += 1) {
    const buffer = await fetchBuffer(frames[index]!);
    if (!buffer) continue;
    const path = `assets/frames/frame-${String(index + 1).padStart(4, "0")}.jpg`;
    root.file(path, buffer);
    framePaths.push(path);
  }

  if (experience.motionVideoUrl) {
    const videoBuffer = await fetchBuffer(experience.motionVideoUrl);
    if (videoBuffer) root.file("assets/motion.mp4", videoBuffer);
  }

  if (experience.heroImageUrl) {
    const heroBuffer = await fetchBuffer(experience.heroImageUrl);
    if (heroBuffer) root.file("assets/hero.jpg", heroBuffer);
  }

  root.file("experience.json", JSON.stringify(experience, null, 2));
  root.file("styles/cinematic.css", cinematicCss);
  root.file("index.html", buildIndexHtml(experience, framePaths));
  root.file(
    "README.txt",
    `StoneAI Cinematic Export\n\nOpen index.html in a browser (or serve this folder locally).\nGenerated: ${new Date().toISOString()}\n`,
  );

  return zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
}
