import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";
import type { TemplateSchema } from "@/lib/templateSchemas";
import {
  CinematicScenePlanSchema,
  GeneratedWebsiteResponseSchema,
  WebsiteEditResponseSchema,
  type CinematicScenePlanResponse,
  type OpenAIGeneratedWebsiteResponse,
  type OpenAIWebsiteEditResponse,
} from "@/lib/ai/structuredSchemas";
import { cinematicSceneEditSystemPrompt, cinematicScenePlanSystemPrompt } from "@/lib/ai/prompts/cinematicPrompts";
import { normalizeCinematicScenePlan } from "@/lib/ai/normalizeCinematicResponse";
import type { EditWebsiteRequest } from "@/lib/ai/schema";
import {
  extractInlineMediaFromSchema,
  restoreInlineMediaToSchema,
  stripInlineMediaFromSchema,
} from "@/lib/media/schemaMedia";
import {
  websiteEditingSystemPrompt,
  websiteGenerationSystemPrompt,
} from "@/lib/ai/prompts/systemPrompts";
import {
  normalizeGeneratedWebsiteResponse,
  normalizeWebsiteEditResponse,
} from "@/lib/ai/normalizeWebsiteResponse";
import type { AIUsage, WebsiteGenerationInput } from "@/lib/ai/types";

export type BedrockProviderResult<T> = {
  data: T;
  usage: AIUsage;
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
  request: WebsiteGenerationInput & {
    media?: {
      heroImageReady?: boolean;
      lastFrameImageReady?: boolean;
      motionVideoReady?: boolean;
    };
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

Upstream media (already generated — do NOT embed URLs, base64, or binary in your JSON):
- Hero image ready: ${request.media?.heroImageReady ? "yes" : "no"}
- Last frame image ready (Veo reference): ${request.media?.lastFrameImageReady ? "yes" : "no"}
- Hero motion video ready: ${request.media?.motionVideoReady ? "yes" : "no"}

Create a complete StoneAI schema with cinematic sections for this business.
Use websiteSchema.id exactly "generated".
Every feature, testimonial, FAQ, gallery item, and pricing tier must include a unique string id.
Always include projectName and seo { title, description }.
Leave hero image/video fields empty when upstream media is ready; the pipeline injects them after generation.
`;

const cinematicPlanInput = (
  request: WebsiteGenerationInput & {
    media?: {
      heroImageReady?: boolean;
      lastFrameImageReady?: boolean;
      motionVideoReady?: boolean;
    };
    templateReference?: string | null;
  },
) => `
Business name: ${request.businessName}
Industry: ${request.industry ?? "Luxury real estate / premium product"}
Style: ${request.style ?? "Cinematic immersive"}
Website type: Scroll-driven cinematic experience
Template reference: ${request.templateReference ?? "Original cinematic direction"}
Business description: ${request.description}
Creative brief: ${request.prompt}

Media pipeline status (visual motion is handled separately — do NOT output URLs):
- First frame ready: ${request.media?.heroImageReady ? "yes" : "no"}
- Last frame ready: ${request.media?.lastFrameImageReady ? "yes" : "no"}
- Motion video ready: ${request.media?.motionVideoReady ? "yes" : "no"}

Design a scene-by-scene scroll journey. Each scene needs id, title, optional subtitle/body, scrollStart (0–1), optional ctaLabel on the final scene.
`;

export const bedrockProvider = {
  async generateCinematicPlan(
    request: WebsiteGenerationInput & {
      media?: {
        heroImageReady?: boolean;
        lastFrameImageReady?: boolean;
        motionVideoReady?: boolean;
      };
      templateReference?: string | null;
    },
  ): Promise<BedrockProviderResult<CinematicScenePlanResponse>> {
    const result = await converseJson<unknown>(
      cinematicScenePlanSystemPrompt,
      cinematicPlanInput(request),
      "stoneai_cinematic_scene_plan",
    );

    const normalized = normalizeCinematicScenePlan(result.data, {
      fallbackProjectName: request.businessName,
      fallbackDescription: request.description,
    });

    return {
      data: CinematicScenePlanSchema.parse(normalized),
      usage: result.usage,
    };
  },

  async editCinematicPlan(
    request: {
      instruction: string;
      currentPlan: CinematicScenePlanResponse;
      businessName: string;
    },
  ): Promise<BedrockProviderResult<CinematicScenePlanResponse>> {
    const result = await converseJson<unknown>(
      cinematicSceneEditSystemPrompt,
      JSON.stringify({
        instruction: request.instruction,
        currentScenePlan: request.currentPlan,
        businessName: request.businessName,
      }),
      "stoneai_cinematic_scene_edit",
    );

    const normalized = normalizeCinematicScenePlan(result.data, {
      fallbackProjectName: request.currentPlan.projectName || request.businessName,
      fallbackDescription: request.currentPlan.story,
    });

    return {
      data: CinematicScenePlanSchema.parse(normalized),
      usage: result.usage,
    };
  },

  async generateWebsite(
    request: WebsiteGenerationInput & {
      media?: {
        heroImageReady?: boolean;
        lastFrameImageReady?: boolean;
        motionVideoReady?: boolean;
      };
      templateId?: string | null;
    },
  ): Promise<BedrockProviderResult<OpenAIGeneratedWebsiteResponse>> {
    const result = await converseJson<unknown>(
      websiteGenerationSystemPrompt,
      generationInput(request),
      "stoneai_website",
    );

    const normalized = normalizeGeneratedWebsiteResponse(result.data, {
      fallbackProjectName: request.businessName,
      fallbackSeoDescription: request.description,
    });

    return {
      data: GeneratedWebsiteResponseSchema.parse(normalized),
      usage: result.usage,
    };
  },

  async editWebsite(
    request: EditWebsiteRequest & { websiteSchema: TemplateSchema },
  ): Promise<BedrockProviderResult<OpenAIWebsiteEditResponse>> {
    const preservedMedia = extractInlineMediaFromSchema(request.websiteSchema);
    const schemaForAi = stripInlineMediaFromSchema(request.websiteSchema);

    const result = await converseJson<unknown>(
      websiteEditingSystemPrompt,
      JSON.stringify({
        instruction: request.instruction,
        websiteSchema: schemaForAi,
      }),
      "stoneai_website_edit",
    );

    const parsed = WebsiteEditResponseSchema.parse(
      normalizeWebsiteEditResponse(result.data),
    );
    const websiteSchema = restoreInlineMediaToSchema(
      parsed.websiteSchema as TemplateSchema,
      preservedMedia,
    );

    return {
      data: {
        ...parsed,
        websiteSchema: websiteSchema as typeof parsed.websiteSchema,
      },
      usage: result.usage,
    };
  },
};
