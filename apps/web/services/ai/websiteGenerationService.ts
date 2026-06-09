import type { StoredProject } from "@/lib/projects";
import type { TemplateSchema } from "@/lib/templateSchemas";
import type { GenerateWebsiteRequest } from "@/lib/ai";

export type GenerateWebsiteAIRequest = GenerateWebsiteRequest & {
  businessName: string;
  description: string;
  colorPreference?: string;
  websiteType?: string;
};

export type GenerateWebsiteAIResponse = {
  project: StoredProject;
  websiteSchema: TemplateSchema;
  seo: {
    title: string;
    description: string;
  };
};

export const websiteGenerationService = {
  async generate(request: GenerateWebsiteAIRequest): Promise<GenerateWebsiteAIResponse> {
    const response = await fetch("/api/ai/generate-website", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    const payload = (await response.json()) as
      | GenerateWebsiteAIResponse
      | { error?: string };

    if (!response.ok) {
      throw new Error("error" in payload && payload.error ? payload.error : "Could not generate website.");
    }

    return payload as GenerateWebsiteAIResponse;
  },
};
