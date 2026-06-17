import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "cinematic-media";

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

export async function uploadDataUrl(
  supabase: SupabaseClient,
  userId: string,
  projectId: string,
  dataUrl: string,
  filename: string,
): Promise<string> {
  const { buffer, mimeType } = decodeDataUrl(dataUrl);
  const path = `${userId}/${projectId}/${filename}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: mimeType,
    upsert: true,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadDataUrlIfNeeded(
  supabase: SupabaseClient,
  userId: string,
  projectId: string,
  value: string | null | undefined,
  filename: string,
): Promise<string | null> {
  if (!value?.trim()) return null;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (!value.startsWith("data:")) return value;
  try {
    return await uploadDataUrl(supabase, userId, projectId, value, filename);
  } catch (error) {
    console.warn(`[StoneAI] Storage upload failed for ${filename}:`, error);
    return value;
  }
}

export async function uploadFrameSequence(
  supabase: SupabaseClient,
  userId: string,
  projectId: string,
  frames: string[],
): Promise<string[]> {
  const uploaded: string[] = [];
  const batchSize = 8;

  for (let offset = 0; offset < frames.length; offset += batchSize) {
    const batch = frames.slice(offset, offset + batchSize);
    const results = await Promise.all(
      batch.map(async (frame, index) => {
        const frameIndex = offset + index;
        if (frame.startsWith("http://") || frame.startsWith("https://")) return frame;
        if (!frame.startsWith("data:")) return frame;
        const ext = extensionForMime(decodeDataUrl(frame).mimeType ?? "image/jpeg");
        return uploadDataUrlIfNeeded(
          supabase,
          userId,
          projectId,
          frame,
          `frames/frame-${String(frameIndex + 1).padStart(4, "0")}.${ext}`,
        );
      }),
    );
    uploaded.push(...results.map((item) => item ?? ""));
  }

  return uploaded.filter(Boolean);
}
