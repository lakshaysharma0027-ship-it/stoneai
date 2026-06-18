import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const BUCKET = "cinematic-media";
const MAX_BYTES = 50 * 1024 * 1024;

const decodeDataUrl = (url: string) => {
  const match = url.match(/^data:([^;]+);base64,(.+)$/);
  if (!match?.[2]) throw new Error("Expected a base64 data URL.");
  return { mimeType: match[1], buffer: Buffer.from(match[2], "base64") };
};

const extensionForMime = (mimeType: string) => {
  if (mimeType.includes("jpeg") || mimeType.includes("jpg")) return "jpg";
  if (mimeType.includes("png")) return "png";
  if (mimeType.includes("webp")) return "webp";
  if (mimeType.includes("webm")) return "webm";
  if (mimeType.includes("mp4")) return "mp4";
  return "bin";
};

let bucketReady = false;

export async function ensureCinematicMediaBucket() {
  if (bucketReady) return createSupabaseAdminClient();

  const admin = createSupabaseAdminClient();
  const { data: buckets, error: listError } = await admin.storage.listBuckets();
  if (listError) throw listError;

  if (!buckets?.some((bucket) => bucket.id === BUCKET)) {
    const { error: createError } = await admin.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: MAX_BYTES,
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm"],
    });
    if (createError && !createError.message.toLowerCase().includes("already exists")) {
      throw createError;
    }
  }

  bucketReady = true;
  return admin;
}

export async function uploadDataUrl(
  userId: string,
  projectId: string,
  dataUrl: string,
  filename: string,
): Promise<string> {
  const admin = await ensureCinematicMediaBucket();
  const { buffer, mimeType } = decodeDataUrl(dataUrl);
  const path = `${userId}/${projectId}/${filename}`;

  const { error } = await admin.storage.from(BUCKET).upload(path, buffer, {
    contentType: mimeType,
    upsert: true,
  });

  if (error) throw error;

  const { data } = admin.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadDataUrlIfNeeded(
  _supabase: SupabaseClient,
  userId: string,
  projectId: string,
  value: string | null | undefined,
  filename: string,
): Promise<string | null> {
  if (!value?.trim()) return null;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (!value.startsWith("data:")) return value;
  return uploadDataUrl(userId, projectId, value, filename);
}

export async function uploadFrameSequence(
  _supabase: SupabaseClient,
  userId: string,
  projectId: string,
  frames: string[],
): Promise<string[]> {
  const uploaded: string[] = [];
  const batchSize = 6;

  for (let offset = 0; offset < frames.length; offset += batchSize) {
    const batch = frames.slice(offset, offset + batchSize);
    const results = await Promise.all(
      batch.map(async (frame, index) => {
        const frameIndex = offset + index;
        if (frame.startsWith("http://") || frame.startsWith("https://")) return frame;
        if (!frame.startsWith("data:")) return frame;
        const ext = extensionForMime(decodeDataUrl(frame).mimeType ?? "image/jpeg");
        return uploadDataUrl(
          userId,
          projectId,
          frame,
          `frames/frame-${String(frameIndex + 1).padStart(4, "0")}.${ext}`,
        );
      }),
    );
    uploaded.push(...results);
  }

  return uploaded.filter(Boolean);
}
