/** Capabilities recorded per pipeline step (48h reuse library). */
export const PIPELINE_FIRST_FRAME_CAPABILITIES = [
  "pipeline_first_frame",
  "hero_image",
] as const;

export const PIPELINE_LAST_FRAME_CAPABILITIES = ["pipeline_last_frame"] as const;

export const PIPELINE_VIDEO_CAPABILITIES = [
  "pipeline_motion_video",
  "hero_video",
  "image_to_video",
  "text_to_video",
  "marketing_video",
  "product_showcase",
] as const;

export type PipelineMediaSlot = "first" | "last" | "video";

export const capabilitiesForSlot = (slot: PipelineMediaSlot): readonly string[] => {
  if (slot === "first") return PIPELINE_FIRST_FRAME_CAPABILITIES;
  if (slot === "last") return PIPELINE_LAST_FRAME_CAPABILITIES;
  return PIPELINE_VIDEO_CAPABILITIES;
};

export const RECENT_MEDIA_TTL_HOURS = 48;
