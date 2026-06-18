import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { CinematicExperience } from "@/lib/cinematic/types";

const BUCKET = "cinematic-media";

export const normalizeExperienceFrames = (
  experience: CinematicExperience,
): CinematicExperience => {
  const frames = experience.frames.filter(Boolean);
  if (frames.length > 0) {
    return { ...experience, frames, frameCount: frames.length };
  }

  const expectsVideoFrames =
    experience.frameSource === "video" ||
    Boolean(experience.motionVideoUrl) ||
    experience.frameCount > 2;

  if (expectsVideoFrames) {
    return experience;
  }

  const fallback = [experience.heroImageUrl, experience.lastFrameImageUrl].filter(
    (url): url is string => Boolean(url?.trim()),
  );

  if (fallback.length > 0) {
    return { ...experience, frames: fallback, frameCount: fallback.length };
  }

  return experience;
};

export async function listStoredFrameUrls(
  supabase: SupabaseClient,
  userId: string,
  projectId: string,
): Promise<string[]> {
  const prefix = `${userId}/${projectId}/frames`;
  const listFrom = async (client: SupabaseClient) => {
    const { data, error } = await client.storage.from(BUCKET).list(prefix, {
      limit: 200,
      sortBy: { column: "name", order: "asc" },
    });
    if (error || !data?.length) return [] as string[];
    const { data: publicData } = client.storage.from(BUCKET).getPublicUrl(prefix);
    const base = publicData.publicUrl.endsWith("/")
      ? publicData.publicUrl
      : `${publicData.publicUrl}/`;
    return data
      .filter((item) => item.name && !item.name.startsWith("."))
      .map((item) => `${base}${item.name}`);
  };

  const primary = await listFrom(supabase);
  if (primary.length > 0) return primary;

  try {
    return await listFrom(createSupabaseAdminClient());
  } catch {
    return [];
  }
}

export async function rehydrateCinematicExperience(
  supabase: SupabaseClient,
  userId: string,
  projectId: string,
  experience: CinematicExperience,
): Promise<CinematicExperience> {
  let normalized = normalizeExperienceFrames(experience);

  if (normalized.frames.length === 0) {
    const storedFrames = await listStoredFrameUrls(supabase, userId, projectId);
    if (storedFrames.length > 0) {
      normalized = {
        ...normalized,
        frames: storedFrames,
        frameCount: storedFrames.length,
        frameSource: normalized.frameSource ?? "video",
      };
    }
  }

  if (
    normalized.frames.length <= 2 &&
    (normalized.frameSource === "video" || Boolean(normalized.motionVideoUrl))
  ) {
    throw new Error(
      "Scroll frames are missing for this project. Regenerate with your motion video to restore the cinematic experience.",
    );
  }

  return normalized;
}
