import { GoogleGenAI } from "@google/genai";
import type { GenerateImageInput, MediaProvider } from "@/lib/media/types";

const getGoogleClient = () => {
  const apiKey = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing GOOGLE_API_KEY.");
  return new GoogleGenAI({ apiKey });
};

const imageModel = () => process.env.GOOGLE_NANO_BANANA_MODEL ?? "gemini-3.1-flash-image";
const videoModel = () => process.env.GOOGLE_VEO_MODEL ?? "veo-3.1-lite-generate-preview";

const materializeVideoUrl = async (
  video: { uri?: string; videoBytes?: string; mimeType?: string } | undefined,
): Promise<string | undefined> => {
  if (!video) return undefined;
  if (video.videoBytes) {
    return `data:${video.mimeType ?? "video/mp4"};base64,${video.videoBytes}`;
  }
  if (!video.uri) return undefined;

  const apiKey = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;
  if (!apiKey) return video.uri;

  const response = await fetch(video.uri, {
    headers: { "x-goog-api-key": apiKey },
  });
  if (!response.ok) {
    throw new Error(`Failed to download generated video (${response.status}).`);
  }
  const mimeType = response.headers.get("content-type")?.split(";")[0]?.trim() ?? "video/mp4";
  const videoBytes = Buffer.from(await response.arrayBuffer()).toString("base64");
  return `data:${mimeType};base64,${videoBytes}`;
};

const toDataUrl = (mimeType: string | undefined, bytes: string) =>
  `data:${mimeType ?? "image/png"};base64,${bytes}`;

const imageInstruction = (input: GenerateImageInput) => {
  const capabilityPrompts: Record<GenerateImageInput["capability"], string> = {
    prompt: "Generate a high-quality image.",
    edit_uploaded: "Edit the uploaded image according to the prompt.",
    background_replacement: "Replace the background while preserving the main subject.",
    product_enhancement: "Enhance this as a premium product image.",
    hero_image: "Create a website hero image suitable for a dark minimalist SaaS interface.",
    marketing_asset: "Create a polished marketing asset for a website or ad.",
  };

  return `${capabilityPrompts[input.capability]}\n\nPrompt: ${input.prompt}`;
};

export const googleMediaProvider: MediaProvider = {
  async generateImage(input) {
    const ai = getGoogleClient();

    if (input.inputImageBase64) {
      const response = await ai.models.generateContent({
        model: imageModel(),
        contents: [
          {
            role: "user",
            parts: [
              { text: imageInstruction(input) },
              {
                inlineData: {
                  mimeType: input.inputMimeType ?? "image/png",
                  data: input.inputImageBase64,
                },
              },
            ],
          },
        ],
      });

      const imagePart = response.candidates?.[0]?.content?.parts?.find((part) => "inlineData" in part);
      const inlineData = imagePart && "inlineData" in imagePart ? imagePart.inlineData : undefined;
      if (!inlineData?.data) throw new Error("Google did not return an edited image.");

      return {
        status: "completed",
        assetUrl: toDataUrl(inlineData.mimeType, inlineData.data),
        metadata: { model: imageModel(), capability: input.capability },
      };
    }

    const response = await ai.models.generateImages({
      model: imageModel(),
      prompt: imageInstruction(input),
      config: {
        numberOfImages: 1,
        aspectRatio: input.aspectRatio ?? "16:9",
        includeRaiReason: true,
      },
    });
    const generated = response.generatedImages?.[0]?.image;
    if (!generated?.imageBytes) throw new Error("Google did not return an image.");

    return {
      status: "completed",
      assetUrl: toDataUrl(generated.mimeType, generated.imageBytes),
      metadata: { model: imageModel(), capability: input.capability },
    };
  },

  async generateVideo(input) {
    const ai = getGoogleClient();
    const source = {
      prompt: input.prompt,
      ...(input.inputImageBase64
        ? {
            image: {
              imageBytes: input.inputImageBase64,
              mimeType: input.inputMimeType ?? "image/png",
            },
          }
        : {}),
    };

    const config: Record<string, unknown> = {
      numberOfVideos: 1,
      aspectRatio: input.aspectRatio ?? "16:9",
      durationSeconds: input.durationSeconds ?? 8,
      enhancePrompt: false,
      generateAudio: false,
    };

    if (input.lastFrameImageBase64) {
      config.lastFrame = {
        imageBytes: input.lastFrameImageBase64,
        mimeType: input.lastFrameMimeType ?? "image/png",
      };
    }

    let operation = await ai.models.generateVideos({
      model: videoModel(),
      source,
      config,
    });

    const startedAt = Date.now();
    while (!operation.done) {
      if (Date.now() - startedAt > 8 * 60 * 1000) {
        throw new Error("Video generation timed out after 8 minutes.");
      }
      await new Promise((resolve) => setTimeout(resolve, 8000));
      operation = await ai.operations.get({ operation });
    }

    if (operation.error) {
      throw new Error(
        typeof operation.error === "object" && operation.error && "message" in operation.error
          ? String((operation.error as { message?: string }).message)
          : "Video generation failed.",
      );
    }

    return {
      status: "completed" as const,
      operationId: operation.name,
      assetUrl: await materializeVideoUrl(operation.response?.generatedVideos?.[0]?.video),
      metadata: {
        model: videoModel(),
        capability: input.capability,
        operation,
        usedLastFrame: Boolean(input.lastFrameImageBase64),
      },
    };
  },
};
