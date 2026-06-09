export type MediaProviderId = "google" | "openai" | "claude" | "replicate";

export type ImageCapability =
  | "prompt"
  | "edit_uploaded"
  | "background_replacement"
  | "product_enhancement"
  | "hero_image"
  | "marketing_asset";

export type VideoCapability =
  | "text_to_video"
  | "image_to_video"
  | "marketing_video"
  | "product_showcase"
  | "hero_video";

export type MediaGenerationStatus = "pending" | "processing" | "completed" | "failed";

export type GeneratedMedia = {
  assetUrl?: string;
  thumbnailUrl?: string;
  operationId?: string;
  status: MediaGenerationStatus;
  metadata?: Record<string, unknown>;
};

export type GenerateImageInput = {
  prompt: string;
  capability: ImageCapability;
  inputImageBase64?: string;
  inputMimeType?: string;
  aspectRatio?: string;
};

export type GenerateVideoInput = {
  prompt: string;
  capability: VideoCapability;
  inputImageBase64?: string;
  inputMimeType?: string;
  aspectRatio?: string;
  durationSeconds?: number;
};

export type MediaProvider = {
  generateImage: (input: GenerateImageInput) => Promise<GeneratedMedia>;
  generateVideo: (input: GenerateVideoInput) => Promise<GeneratedMedia>;
};
