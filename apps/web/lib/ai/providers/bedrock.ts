import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";
import type { TemplateSchema } from "@/lib/templateSchemas";
import {
  GeneratedWebsiteResponseSchema,
  WebsiteEditResponseSchema,
  type OpenAIGeneratedWebsiteResponse,
  type OpenAIWebsiteEditResponse,
} from "@/lib/ai/structuredSchemas";
import type { EditWebsiteRequest } from "@/lib/ai/schema";
import {
  websiteEditingSystemPrompt,
  websiteGenerationSystemPrompt,
} from "@/lib/ai/prompts/systemPrompts";
import type { OpenAIWebsiteGenerationInput, OpenAIUsage } from "./openai";

export type BedrockProviderResult<T> = {
  data: T;
  usage: OpenAIUsage;
};

const modelId =
  process.env.BEDROCK_CLAUDE_MODEL ??
  process.env.AWS_BEDROCK_CLAUDE_MODEL ??
  "global.anthropic.claude-opus-4-6-v1";

const region = process.env.AWS_REGION ?? "us-east-1";

const getBedrockClient = () => {
  const apiKey =
    process.env.AWS_BEDROCK_API_KEY ?? process.env.AWS_BEARER_TOKEN_BEDROCK;

  if (!apiKey) {
    throw new Error(
      "Missing AWS_BEDROCK_API_KEY. Add your Amazon Bedrock API key to environment variables.",
    );
  }

  if (!process.env.AWS_BEARER_TOKEN_BEDROCK) {
    process.env.AWS_BEARER_TOKEN_BEDROCK = apiKey;
  }

  return new BedrockRuntimeClient({ region });
};

const extractJsonObject = (text: string) => {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Bedrock response did not include JSON output.");
  }
  return JSON.parse(text.slice(start, end + 1)) as unknown;
};

const converseJson = async <T>(
  systemPrompt: string,
  userPrompt: string,
  schemaLabel: string,
): Promise<BedrockProviderResult<T>> => {
  const client = getBedrockClient();
  const response = await client.send(
    new ConverseCommand({
      modelId,
      system: [{ text: systemPrompt }],
      messages: [
        {
          role: "user",
          content: [
            {
              text: `${userPrompt}\n\nRespond with valid JSON only matching the ${schemaLabel} schema. No markdown fences.`,
            },
          ],
        },
      ],
      inferenceConfig: {
        maxTokens: 8192,
        temperature: 0.4,
      },
    }),
  );

  const textBlock = response.output?.message?.content?.find(
    (block) => "text" in block && typeof block.text === "string",
  );
  const text = textBlock && "text" in textBlock ? textBlock.text : "";
  if (!text) {
    throw new Error("Bedrock returned an empty response.");
  }

  const usage = response.usage;
  return {
    data: extractJsonObject(text) as T,
    usage: {
      inputTokens: usage?.inputTokens ?? 0,
      outputTokens: usage?.outputTokens ?? 0,
      totalTokens: (usage?.inputTokens ?? 0) + (usage?.outputTokens ?? 0),
      model: modelId,
    },
  };
};

const generationInput = (
  request: OpenAIWebsiteGenerationInput & {
    heroImageUrl?: string;
    lastFrameImageUrl?: string;
    motionVideoUrl?: string;
    templateId?: string | null;
  },
) => `
Business name: ${request.businessName}
Industry: ${request.industry ?? "Auto"}
Style: ${request.style ?? "Premium"}
Color preference: ${request.colorPreference ?? "Monochrome premium"}
Website type: ${request.websiteType ?? "Cinematic landing page"}
Template ID: ${request.templateId ?? "generated"}
Business description: ${request.description}
User prompt: ${request.prompt}
Hero image URL: ${request.heroImageUrl ?? "none"}
Last frame image URL: ${request.lastFrameImageUrl ?? "none"}
Motion video URL: ${request.motionVideoUrl ?? "none"}

Create a complete StoneAI schema with cinematic sections for this business.
When hero image URL is provided, use it in the hero section image field.
`;

export const bedrockProvider = {
  async generateWebsite(
    request: OpenAIWebsiteGenerationInput & {
      heroImageUrl?: string;
      lastFrameImageUrl?: string;
      motionVideoUrl?: string;
      templateId?: string | null;
    },
  ): Promise<BedrockProviderResult<OpenAIGeneratedWebsiteResponse>> {
    const result = await converseJson<unknown>(
      websiteGenerationSystemPrompt,
      generationInput(request),
      "stoneai_website",
    );

    return {
      data: GeneratedWebsiteResponseSchema.parse(result.data),
      usage: result.usage,
    };
  },

  async editWebsite(
    request: EditWebsiteRequest & { websiteSchema: TemplateSchema },
  ): Promise<BedrockProviderResult<OpenAIWebsiteEditResponse>> {
    const result = await converseJson<unknown>(
      websiteEditingSystemPrompt,
      JSON.stringify({
        instruction: request.instruction,
        websiteSchema: request.websiteSchema,
      }),
      "stoneai_website_edit",
    );

    return {
      data: WebsiteEditResponseSchema.parse(result.data),
      usage: result.usage,
    };
  },
};
