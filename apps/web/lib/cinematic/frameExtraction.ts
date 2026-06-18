import { execFile } from "node:child_process";
import { constants } from "node:fs";
import { randomUUID } from "node:crypto";
import { access, chmod, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import sharp from "sharp";
import { DEFAULT_FRAME_COUNT } from "@/lib/cinematic/types";

const execFileAsync = promisify(execFile);

export type FrameSource = "video" | "interpolated" | "hero_only";

const MIN_VIDEO_FRAMES = 12;

const decodeDataUrl = (url: string) => {
  const match = url.match(/^data:([^;]+);base64,(.+)$/);
  if (!match?.[2]) throw new Error("Expected a base64 data URL.");
  return { mimeType: match[1], buffer: Buffer.from(match[2], "base64") };
};

const extensionFromBuffer = (buffer: Buffer, url: string) => {
  if (buffer.length >= 12 && buffer[4] === 0x66 && buffer[5] === 0x74 && buffer[6] === 0x79 && buffer[7] === 0x70) {
    return "mp4";
  }
  if (buffer.length >= 4 && buffer[0] === 0x1a && buffer[1] === 0x45 && buffer[2] === 0xdf && buffer[3] === 0xa3) {
    return "webm";
  }
  const fromUrl = url.match(/\.([a-z0-9]+)(?:\?|$)/i)?.[1]?.toLowerCase();
  if (fromUrl && ["mp4", "webm", "mov", "mkv", "m4v"].includes(fromUrl)) return fromUrl;
  return "mp4";
};

const resolveMediaBuffer = async (url: string): Promise<Buffer> => {
  if (url.startsWith("data:")) {
    return decodeDataUrl(url).buffer;
  }
  if (url.startsWith("http://") || url.startsWith("https://")) {
    const response = await fetch(url, {
      headers: { Accept: "*/*" },
      signal: AbortSignal.timeout(120_000),
    });
    if (!response.ok) {
      throw new Error(`Could not fetch media (${response.status}).`);
    }
    return Buffer.from(await response.arrayBuffer());
  }
  throw new Error("Unsupported media URL.");
};

let ffmpegCachePath: string | null = null;

const resolveFfmpegBinary = async (): Promise<string> => {
  if (ffmpegCachePath) {
    try {
      await access(ffmpegCachePath, constants.X_OK);
      return ffmpegCachePath;
    } catch {
      ffmpegCachePath = null;
    }
  }

  const mod = await import("ffmpeg-static");
  const bundled = typeof mod.default === "string" ? mod.default : null;
  if (!bundled) {
    throw new Error("ffmpeg-static is not available on this server.");
  }

  const cached = join(tmpdir(), "stoneai-ffmpeg");
  try {
    await access(cached, constants.X_OK);
    ffmpegCachePath = cached;
    return cached;
  } catch {
    const binary = await readFile(bundled);
    await writeFile(cached, binary);
    await chmod(cached, 0o755);
    ffmpegCachePath = cached;
    return cached;
  }
};

export async function extractVideoFrames(
  videoSource: string,
  targetFrames = DEFAULT_FRAME_COUNT,
): Promise<string[]> {
  const ffmpegPath = await resolveFfmpegBinary();
  const buffer = await resolveMediaBuffer(videoSource);
  if (buffer.length === 0) {
    throw new Error("Motion video file is empty.");
  }

  const dir = join(tmpdir(), `stoneai-frames-${randomUUID()}`);
  await mkdir(dir, { recursive: true });
  const extension = extensionFromBuffer(buffer, videoSource);
  const inputPath = join(dir, `input.${extension}`);
  const outputPattern = join(dir, "frame-%04d.jpg");

  try {
    await writeFile(inputPath, buffer);

    const fps = Math.max(2, Math.min(24, Math.ceil(targetFrames / 6)));
    await execFileAsync(
      ffmpegPath,
      [
        "-y",
        "-hide_banner",
        "-loglevel",
        "error",
        "-i",
        inputPath,
        "-an",
        "-vf",
        `fps=${fps},scale='min(1920,iw)':-2`,
        "-frames:v",
        String(targetFrames),
        "-q:v",
        "2",
        "-pix_fmt",
        "yuvj420p",
        outputPattern,
      ],
      { maxBuffer: 16 * 1024 * 1024, timeout: 240_000 },
    );

    const files = (await readdir(dir))
      .filter((name) => name.startsWith("frame-") && name.endsWith(".jpg"))
      .sort();

    const frames: string[] = [];
    for (const file of files) {
      const imageBuffer = await readFile(join(dir, file));
      frames.push(`data:image/jpeg;base64,${imageBuffer.toString("base64")}`);
    }

    if (frames.length < MIN_VIDEO_FRAMES) {
      throw new Error(
        `ffmpeg produced only ${frames.length} frames (need at least ${MIN_VIDEO_FRAMES}). Check video format (MP4/WebM) and length.`,
      );
    }

    return frames;
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown ffmpeg error";
    throw new Error(`Video frame extraction failed: ${detail}`);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

/** Blend first→last when no motion video is available. */
export async function interpolateImageFrames(
  firstSource: string,
  lastSource: string,
  count: number,
): Promise<string[]> {
  const first = await resolveMediaBuffer(firstSource);
  const last = await resolveMediaBuffer(lastSource);
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

const isRemoteOrData = (value?: string) =>
  Boolean(value?.startsWith("data:") || value?.startsWith("http://") || value?.startsWith("https://"));

export async function buildScrollFrames(options: {
  motionVideoUrl?: string;
  heroImageUrl?: string;
  lastFrameImageUrl?: string;
  frameCount?: number;
}): Promise<{ frames: string[]; source: FrameSource }> {
  const frameCount = options.frameCount ?? DEFAULT_FRAME_COUNT;
  const videoUrl = options.motionVideoUrl?.trim();
  const heroUrl = options.heroImageUrl?.trim();
  const lastUrl = options.lastFrameImageUrl?.trim();

  if (isRemoteOrData(videoUrl)) {
    const frames = await extractVideoFrames(videoUrl!, frameCount);
    return { frames, source: "video" };
  }

  if (isRemoteOrData(heroUrl) && isRemoteOrData(lastUrl)) {
    const frames = await interpolateImageFrames(heroUrl!, lastUrl!, frameCount);
    return { frames, source: "interpolated" };
  }

  if (heroUrl) {
    return { frames: [heroUrl], source: "hero_only" };
  }

  throw new Error("Add a motion video or hero image to build the cinematic scroll experience.");
}
