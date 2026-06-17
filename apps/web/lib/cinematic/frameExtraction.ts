import { execFile } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import sharp from "sharp";

const execFileAsync = promisify(execFile);

const decodeDataUrl = (url: string) => {
  const match = url.match(/^data:([^;]+);base64,(.+)$/);
  if (!match?.[2]) throw new Error("Expected a base64 data URL.");
  return { mimeType: match[1], buffer: Buffer.from(match[2], "base64") };
};

const getFfmpegPath = async (): Promise<string | null> => {
  try {
    const mod = await import("ffmpeg-static");
    const ffmpegPath = typeof mod.default === "string" ? mod.default : null;
    return ffmpegPath;
  } catch {
    return null;
  }
};

export async function extractVideoFrames(
  videoDataUrl: string,
  targetFrames = 80,
): Promise<string[]> {
  const ffmpegPath = await getFfmpegPath();
  if (!ffmpegPath) {
    throw new Error("ffmpeg-static is not available.");
  }

  const { buffer } = decodeDataUrl(videoDataUrl);
  const dir = join(tmpdir(), `stoneai-frames-${randomUUID()}`);
  await mkdir(dir, { recursive: true });
  const inputPath = join(dir, "input.mp4");
  const outputPattern = join(dir, "frame-%04d.jpg");

  try {
    await writeFile(inputPath, buffer);
    await execFileAsync(ffmpegPath, [
      "-y",
      "-i",
      inputPath,
      "-vf",
      `fps=${Math.max(1, Math.min(24, Math.ceil(targetFrames / 8)))}`,
      "-frames:v",
      String(targetFrames),
      "-q:v",
      "2",
      outputPattern,
    ]);

    const files = (await readdir(dir))
      .filter((name) => name.startsWith("frame-") && name.endsWith(".jpg"))
      .sort();

    const frames: string[] = [];
    for (const file of files) {
      const imageBuffer = await readFile(join(dir, file));
      frames.push(`data:image/jpeg;base64,${imageBuffer.toString("base64")}`);
    }

    if (frames.length === 0) {
      throw new Error("ffmpeg produced no frames.");
    }

    return frames;
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

/** Blend first→last when video extraction is unavailable (still scroll-driven). */
export async function interpolateImageFrames(
  firstDataUrl: string,
  lastDataUrl: string,
  count: number,
): Promise<string[]> {
  const first = decodeDataUrl(firstDataUrl).buffer;
  const last = decodeDataUrl(lastDataUrl).buffer;
  const base = sharp(first);
  const meta = await base.metadata();
  const width = meta.width ?? 1920;
  const height = meta.height ?? 1080;

  const firstRaw = await sharp(first).resize(width, height).ensureAlpha().raw().toBuffer();
  const lastRaw = await sharp(last).resize(width, height).ensureAlpha().raw().toBuffer();
  const channels = 4;
  const frames: string[] = [];

  for (let index = 0; index < count; index += 1) {
    const t = count === 1 ? 0 : index / (count - 1);
    const blended = Buffer.alloc(firstRaw.length);
    for (let pixel = 0; pixel < firstRaw.length; pixel += 1) {
      const a = firstRaw[pixel] ?? 0;
      const b = lastRaw[pixel] ?? 0;
      blended[pixel] = Math.round(a * (1 - t) + b * t);
    }
    const jpeg = await sharp(blended, { raw: { width, height, channels } })
      .jpeg({ quality: 82 })
      .toBuffer();
    frames.push(`data:image/jpeg;base64,${jpeg.toString("base64")}`);
  }

  return frames;
}

export async function buildScrollFrames(options: {
  motionVideoUrl?: string;
  heroImageUrl?: string;
  lastFrameImageUrl?: string;
  frameCount?: number;
}): Promise<{ frames: string[]; source: "video" | "interpolated" | "hero_only" }> {
  const frameCount = options.frameCount ?? 80;

  if (options.motionVideoUrl?.startsWith("data:")) {
    try {
      const frames = await extractVideoFrames(options.motionVideoUrl, frameCount);
      return { frames, source: "video" };
    } catch (error) {
      console.warn("[StoneAI] Video frame extraction failed, falling back:", error);
    }
  }

  if (options.heroImageUrl?.startsWith("data:") && options.lastFrameImageUrl?.startsWith("data:")) {
    const frames = await interpolateImageFrames(
      options.heroImageUrl,
      options.lastFrameImageUrl,
      frameCount,
    );
    return { frames, source: "interpolated" };
  }

  if (options.heroImageUrl) {
    return { frames: [options.heroImageUrl], source: "hero_only" };
  }

  return { frames: [], source: "hero_only" };
}
