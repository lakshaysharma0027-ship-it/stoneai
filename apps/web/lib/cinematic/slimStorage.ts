import type { CinematicExperience } from "@/lib/cinematic/types";
import type { Website } from "@/lib/editor/schema";

/** Never persist scroll frames in Postgres JSON — they live in Supabase Storage. */
export const slimCinematicExperienceForStorage = (
  experience: CinematicExperience,
): CinematicExperience => ({
  ...experience,
  frames: [],
  frameCount: experience.frameCount || experience.frames.length,
});

export const slimWebsiteForStorage = (website: Website): Website => {
  const experience = website.meta.cinematicExperience;
  if (!experience) return website;

  return {
    ...website,
    meta: {
      ...website.meta,
      renderMode: "cinematic_scroll",
      cinematicExperience: slimCinematicExperienceForStorage(experience),
    },
  };
};

export const assertNoInlineMedia = (experience: CinematicExperience) => {
  const check = (value: string | null | undefined, label: string) => {
    if (value?.startsWith("data:")) {
      throw new Error(`${label} was not uploaded to storage. Media upload failed — try again.`);
    }
  };

  check(experience.heroImageUrl, "Hero image");
  check(experience.lastFrameImageUrl, "Last frame image");
  check(experience.motionVideoUrl, "Motion video");

  const inlineFrames = experience.frames.filter((frame) => frame.startsWith("data:")).length;
  if (inlineFrames > 0) {
    throw new Error(
      `${inlineFrames} scroll frames were not uploaded to storage. Try again in a moment.`,
    );
  }
};
