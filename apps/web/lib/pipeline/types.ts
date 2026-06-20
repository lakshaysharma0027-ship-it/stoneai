import type { TemplateSchema } from "@/lib/templateSchemas";

export type PipelineStageId =
  | "prompt_input"
  | "image_generation"
  | "motion_generation"
  | "frame_extraction"
  | "website_build"
  | "website_ready";

export const PIPELINE_STAGES: Array<{ id: PipelineStageId; label: string }> = [
  { id: "prompt_input", label: "Prompt Input" },
  { id: "image_generation", label: "Image Generation" },
  { id: "motion_generation", label: "Motion Generation" },
  { id: "frame_extraction", label: "Frame Extraction" },
  { id: "website_build", label: "Scene Build" },
  { id: "website_ready", label: "Experience Ready" },
];

export type PromptAttachmentRef = {
  url: string;
  name: string;
  type: "image" | "pdf";
};

export type PipelineMetadata = {
  templateId?: string | null;
  websitePrompt: string;
  businessName: string;
  promptAttachments?: PromptAttachmentRef[];
  firstImagePrompt?: string | null;
  lastImagePrompt?: string | null;
  veoPrompt?: string | null;
  presetHeroImageId?: string | null;
  heroImageUpload?: string | null;
  lastFrameImageUpload?: string | null;
  motionVideoUpload?: string | null;
  /** @deprecated Use heroImageReady — URLs are not stored to avoid multi-MB metadata rows. */
  heroImageUrl?: string | null;
  /** @deprecated Use lastFrameImageReady */
  lastFrameImageUrl?: string | null;
  /** @deprecated Use motionVideoReady */
  motionVideoUrl?: string | null;
  heroImageReady?: boolean;
  lastFrameImageReady?: boolean;
  motionVideoReady?: boolean;
  /** Cinematic scroll experience payload (frames + scenes) */
  cinematicExperience?: import("@/lib/cinematic/types").CinematicExperience | null;
  renderMode?: "cinematic_scroll" | "schema";
  frameSource?: "video" | "interpolated" | "hero_only";
  aiEditsRemaining: number;
  aiEditsUsed: number;
  completedStages: PipelineStageId[];
};

export type PipelineGenerateRequest = {
  templateId?: string | null;
  websitePrompt: string;
  businessName: string;
  promptAttachments?: PromptAttachmentRef[];
  firstImagePrompt?: string;
  lastImagePrompt?: string;
  veoPrompt?: string;
  presetHeroImageId?: string;
  heroImageUpload?: string;
  lastFrameImageUpload?: string;
  motionVideoUpload?: string;
};

export type PipelineGenerateResponse = {
  projectId: string;
  projectName: string;
  websiteSchema: TemplateSchema;
  pipelineMetadata: PipelineMetadata;
  publicPreviewPath: string;
};

export type PipelineEditRequest = {
  projectId: string;
  instruction: string;
};
