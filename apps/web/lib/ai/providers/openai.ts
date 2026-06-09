import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import type { TemplateSchema } from "@/lib/templateSchemas";
import {
  ContentGenerationResponseSchema,
  GeneratedWebsiteResponseSchema,
  WebsiteEditResponseSchema,
  type OpenAIContentGenerationResponse,
  type OpenAIGeneratedWebsiteResponse,
  type OpenAIWebsiteEditResponse,
} from "@/lib/ai/structuredSchemas";
import type {
  EditWebsiteRequest,
  GenerateWebsiteRequest,
  WebsiteIndustry,
  WebsiteStyle,
} from "@/lib/ai/schema";
import {
  contentGenerationSystemPrompt,
  websiteEditingSystemPrompt,
  websiteGenerationSystemPrompt,
} from "@/lib/ai/prompts/systemPrompts";

export type OpenAIWebsiteGenerationInput = GenerateWebsiteRequest & {
  businessName: string;
  description: string;
  colorPreference?: string;
  websiteType?: string;
};

export type OpenAIUsage = {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  model: string;
};

export type OpenAIProviderResult<T> = {
  data: T;
  usage: OpenAIUsage;
};

const model = process.env.OPENAI_MODEL ?? "gpt-4.1";

const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY.");
  }

  return new OpenAI({ apiKey });
};

const usageFromResponse = (
  usage: { input_tokens?: number; output_tokens?: number; total_tokens?: number } | null | undefined,
): OpenAIUsage => ({
  inputTokens: usage?.input_tokens ?? 0,
  outputTokens: usage?.output_tokens ?? 0,
  totalTokens: usage?.total_tokens ?? 0,
  model,
});

const generationInput = (request: OpenAIWebsiteGenerationInput) => `
Business name: ${request.businessName}
Industry: ${request.industry ?? "Auto"}
Style: ${request.style ?? "Premium"}
Color preference: ${request.colorPreference ?? "Monochrome premium"}
Website type: ${request.websiteType ?? "Landing page"}
Business description: ${request.description}
User prompt: ${request.prompt}

Create a complete StoneAI schema with the best sections for this business.
`;

export const openAIProvider = {
  async generateWebsite(
    request: OpenAIWebsiteGenerationInput,
  ): Promise<OpenAIProviderResult<OpenAIGeneratedWebsiteResponse>> {
    const client = getOpenAIClient();
    const response = await client.responses.parse({
      model,
      input: [
        { role: "system", content: websiteGenerationSystemPrompt },
        { role: "user", content: generationInput(request) },
      ],
      text: {
        format: zodTextFormat(GeneratedWebsiteResponseSchema, "stoneai_website"),
      },
    });

    if (!response.output_parsed) {
      throw new Error("OpenAI returned no parsed website schema.");
    }

    return {
      data: GeneratedWebsiteResponseSchema.parse(response.output_parsed),
      usage: usageFromResponse(response.usage),
    };
  },

  async editWebsite(
    request: EditWebsiteRequest & { websiteSchema: TemplateSchema },
  ): Promise<OpenAIProviderResult<OpenAIWebsiteEditResponse>> {
    const client = getOpenAIClient();
    const response = await client.responses.parse({
      model,
      input: [
        { role: "system", content: websiteEditingSystemPrompt },
        {
          role: "user",
          content: JSON.stringify({
            instruction: request.instruction,
            websiteSchema: request.websiteSchema,
          }),
        },
      ],
      text: {
        format: zodTextFormat(WebsiteEditResponseSchema, "stoneai_website_edit"),
      },
    });

    if (!response.output_parsed) {
      throw new Error("OpenAI returned no parsed website edit.");
    }

    return {
      data: WebsiteEditResponseSchema.parse(response.output_parsed),
      usage: usageFromResponse(response.usage),
    };
  },

  async generateContent(input: {
    businessName: string;
    industry: WebsiteIndustry | "Auto";
    description: string;
    style: WebsiteStyle;
  }): Promise<OpenAIProviderResult<OpenAIContentGenerationResponse>> {
    const client = getOpenAIClient();
    const response = await client.responses.parse({
      model,
      input: [
        { role: "system", content: contentGenerationSystemPrompt },
        { role: "user", content: JSON.stringify(input) },
      ],
      text: {
        format: zodTextFormat(
          ContentGenerationResponseSchema,
          "stoneai_content",
        ),
      },
    });

    if (!response.output_parsed) {
      throw new Error("OpenAI returned no parsed content.");
    }

    return {
      data: ContentGenerationResponseSchema.parse(response.output_parsed),
      usage: usageFromResponse(response.usage),
    };
  },

  async translateWebsite(input: {
    websiteSchema: TemplateSchema;
    locale: string;
  }): Promise<OpenAIProviderResult<OpenAIWebsiteEditResponse>> {
    return this.editWebsite({
      website: {
        id: "generated",
        name: "Translated Website",
        prompt: `Translate website to ${input.locale}`,
        industry: "Startup",
        style: "Premium",
        pages: [],
      },
      websiteSchema: input.websiteSchema,
      instruction: `Translate all user-facing content to ${input.locale}.`,
    });
  },
};
