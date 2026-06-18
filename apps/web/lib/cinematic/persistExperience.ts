import type { SupabaseClient } from "@supabase/supabase-js";
import type { CinematicExperience } from "@/lib/cinematic/types";
import {
  uploadDataUrlIfNeeded,
  uploadFrameSequence,
} from "@/lib/cinematic/cinematicStorage";
import { assertNoInlineMedia } from "@/lib/cinematic/slimStorage";

/** Upload inline media to Supabase Storage; return experience with HTTPS URLs only. */
export async function persistCinematicExperience(
  supabase: SupabaseClient,
  userId: string,
  projectId: string,
  experience: CinematicExperience,
): Promise<CinematicExperience> {
  const [heroImageUrl, lastFrameImageUrl, motionVideoUrl, frames] = await Promise.all([
    uploadDataUrlIfNeeded(
      supabase,
      userId,
      projectId,
      experience.heroImageUrl,
      "hero.jpg",
    ),
    uploadDataUrlIfNeeded(
      supabase,
      userId,
      projectId,
      experience.lastFrameImageUrl,
      "last-frame.jpg",
    ),
    uploadDataUrlIfNeeded(
      supabase,
      userId,
      projectId,
      experience.motionVideoUrl,
      "motion.mp4",
    ),
    uploadFrameSequence(supabase, userId, projectId, experience.frames),
  ]);

  const persisted: CinematicExperience = {
    ...experience,
    heroImageUrl,
    lastFrameImageUrl,
    motionVideoUrl,
    frames: frames.length > 0 ? frames : experience.frames,
    frameCount: frames.length > 0 ? frames.length : experience.frameCount,
  };

  assertNoInlineMedia(persisted);

  if (persisted.frameSource === "video" && persisted.frames.length < 12) {
    throw new Error(
      `Only ${persisted.frames.length} scroll frames were extracted from video. Use a longer MP4/WebM motion clip.`,
    );
  }

  if (persisted.frames.length === 0 && !persisted.heroImageUrl) {
    throw new Error("No scroll frames were produced. Upload a hero image or motion video.");
  }

  return persisted;
}

/** Slim metadata for projects row — scenes only, no frame payloads. */
export const slimCinematicMetadata = (experience: CinematicExperience) => ({
  mode: experience.mode,
  projectName: experience.projectName,
  story: experience.story,
  scenes: experience.scenes,
  frameCount: experience.frameCount,
  frameSource: experience.frameSource,
  scrollHeightVh: experience.scrollHeightVh,
  seo: experience.seo,
  heroImageUrl: experience.heroImageUrl,
  lastFrameImageUrl: experience.lastFrameImageUrl,
  motionVideoUrl: experience.motionVideoUrl,
});
