import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appDir = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["sharp", "ffmpeg-static"],
  turbopack: {
    root: join(appDir, "../.."),
  },
};

export default nextConfig;
