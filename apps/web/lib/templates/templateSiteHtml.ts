import { readFile } from "fs/promises";
import path from "path";
import { getTemplateById } from "@/lib/template-catalog";
import { nanoBananaGallery } from "@/lib/template-catalog";
import type { PipelineGenerateRequest } from "@/lib/pipeline/types";
import type { PromptAttachmentRef } from "@/lib/pipeline/types";

export function wantsCinematicPipeline(input: PipelineGenerateRequest): boolean {
  return Boolean(
    input.motionVideoUpload?.trim() ||
      input.veoPrompt?.trim() ||
      input.lastFrameImageUpload?.trim() ||
      input.lastImagePrompt?.trim() ||
      input.firstImagePrompt?.trim(),
  );
}

export function isTemplateOnlyGeneration(input: PipelineGenerateRequest): boolean {
  return Boolean(input.templateId?.trim() && !wantsCinematicPipeline(input));
}

export function resolveTemplateReplacementImage(
  input: PipelineGenerateRequest,
  attachments: PromptAttachmentRef[] = [],
): string | undefined {
  if (input.heroImageUpload?.trim()) {
    return input.heroImageUpload.trim();
  }

  const imageAttachment = attachments.find((file) => file.type === "image");
  if (imageAttachment?.url?.trim()) {
    return imageAttachment.url.trim();
  }

  if (input.presetHeroImageId?.trim()) {
    const preset = nanoBananaGallery.find((item) => item.id === input.presetHeroImageId);
    if (preset?.src) return preset.src;
  }

  return undefined;
}

export async function loadTemplateHtml(templateId: string): Promise<string> {
  const template = getTemplateById(templateId);
  if (!template?.htmlPath) {
    throw new Error(`Template "${templateId}" does not have a deployable HTML demo.`);
  }

  const relativePath = template.htmlPath.replace(/^\//, "");
  const filePath = path.join(process.cwd(), "public", relativePath);
  return readFile(filePath, "utf-8");
}

const escapeJsString = (value: string) => value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function applyTemplateContentOverrides(
  html: string,
  overrides: Record<string, string> | null | undefined,
): string {
  if (!overrides || !Object.keys(overrides).length) return html;

  let result = html;

  for (const [slotId, content] of Object.entries(overrides)) {
    if (!content.trim()) continue;

    if (slotId === "title") {
      result = result.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(content)}</title>`);
      continue;
    }

    const pattern = new RegExp(
      `(<([a-zA-Z]+)[^>]*\\bid=["']${escapeRegex(slotId)}["'][^>]*>)([\\s\\S]*?)(<\\/\\2>)`,
      "i",
    );
    result = result.replace(pattern, `$1${content}$4`);
  }

  return result;
}

export function applyTemplateImageSwap(html: string, imageUrl: string): string {
  const escaped = escapeJsString(imageUrl);

  const photoPattern = /const PHOTO='(?:\\'|[^'])*'/;
  if (photoPattern.test(html)) {
    return html.replace(photoPattern, `const PHOTO='${escaped}'`);
  }

  const photoPatternDouble = /const PHOTO="(?:\\"|[^"])*"/;
  if (photoPatternDouble.test(html)) {
    return html.replace(photoPatternDouble, `const PHOTO="${imageUrl.replace(/"/g, '\\"')}"`);
  }

  return html;
}

export async function buildTemplateSiteHtml(
  templateId: string,
  options?: {
    replacementImageUrl?: string | null;
    contentOverrides?: Record<string, string> | null;
  },
): Promise<string> {
  let html = await loadTemplateHtml(templateId);

  if (options?.contentOverrides) {
    html = applyTemplateContentOverrides(html, options.contentOverrides);
  }

  if (options?.replacementImageUrl?.trim()) {
    html = applyTemplateImageSwap(html, options.replacementImageUrl.trim());
  }

  return html;
}
