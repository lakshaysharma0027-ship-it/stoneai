import type { TemplateSchema } from "@/lib/templateSchemas";

export type PipelineStageId =
  | "prompt_input"
  | "image_generation"
  | "motion_generation"
  | "website_build"
  | "website_ready";

export const PIPELINE_STAGES: Array<{ id: PipelineStageId; label: string }> = [
  { id: "prompt_input", label: "Prompt Input" },
  { id: "image_generation", label: "Image Generation" },
  { id: "motion_generation", label: "Motion Generation" },
  { id: "website_build", label: "Website Build" },
  { id: "website_ready", label: "Website Ready" },
];

export type PipelineMetadata = {
  templateId?: string | null;
  websitePrompt: string;
  businessName: string;
  firstImagePrompt?: string | null;
  lastImagePrompt?: string | null;
  veoPrompt?: string | null;
  presetHeroImageId?: string | null;
  heroImageUpload?: string | null;
  lastFrameImageUpload?: string | null;
  motionVideoUpload?: string | null;
  heroImageUrl?: string | null;
  lastFrameImageUrl?: string | null;
  motionVideoUrl?: string | null;
  aiEditsRemaining: number;
  aiEditsUsed: number;
  completedStages: PipelineStageId[];
};

export type PipelineGenerateRequest = {
  templateId?: string | null;
  websitePrompt: string;
  businessName: string;
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
  websiteSchema: TemplateSchema;
};
