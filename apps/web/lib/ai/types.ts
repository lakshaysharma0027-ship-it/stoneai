import type { GenerateWebsiteRequest } from "@/lib/ai/schema";

export type WebsiteGenerationInput = GenerateWebsiteRequest & {
  businessName: string;
  description: string;
  colorPreference?: string;
  websiteType?: string;
};

export type AIUsage = {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  model: string;
};

export type AIProviderResult<T> = {
  data: T;
  usage: AIUsage;
};
