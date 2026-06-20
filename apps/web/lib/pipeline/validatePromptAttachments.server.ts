import "server-only";

import type { PromptAttachment } from "@/lib/pipeline/promptAttachmentLimits";
import { PROMPT_ATTACHMENT_LIMITS } from "@/lib/pipeline/promptAttachmentLimits";

const BUCKET = "cinematic-media";
const PROMPT_REFERENCE_PATH =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\/prompt-reference\.(pdf|jpe?g|png|webp|gif)$/i;

export function isAllowedPromptAttachmentUrl(url: string, userId: string): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || !userId) return false;

  let parsed: URL;
  let base: URL;
  try {
    parsed = new URL(url);
    base = new URL(supabaseUrl);
  } catch {
    return false;
  }

  const isLocalhost = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
  if (parsed.protocol !== "https:" && !(parsed.protocol === "http:" && isLocalhost)) {
    return false;
  }

  if (parsed.host !== base.host) return false;

  const prefix = `/storage/v1/object/public/${BUCKET}/${userId}/uploads/`;
  if (!parsed.pathname.startsWith(prefix)) return false;

  const remainder = parsed.pathname.slice(prefix.length);
  return PROMPT_REFERENCE_PATH.test(remainder);
}

export function validatePromptAttachments(attachments: PromptAttachment[], userId: string): void {
  if (attachments.length > PROMPT_ATTACHMENT_LIMITS.maxFiles) {
    throw new Error(`Maximum ${PROMPT_ATTACHMENT_LIMITS.maxFiles} prompt attachments allowed.`);
  }

  let pdfCount = 0;
  let imageCount = 0;

  for (const file of attachments) {
    if (file.type === "pdf") pdfCount += 1;
    else if (file.type === "image") imageCount += 1;
    else throw new Error("Invalid prompt attachment type.");

    const name = file.name?.trim();
    if (!name) throw new Error("Prompt attachment name is required.");
    if (name.length > 255) throw new Error("Prompt attachment name is too long.");

    if (!isAllowedPromptAttachmentUrl(file.url, userId)) {
      throw new Error("Prompt attachment URL is not allowed.");
    }
  }

  if (pdfCount > PROMPT_ATTACHMENT_LIMITS.maxPdfs) {
    throw new Error(`Maximum ${PROMPT_ATTACHMENT_LIMITS.maxPdfs} PDF attachments allowed.`);
  }

  if (imageCount > PROMPT_ATTACHMENT_LIMITS.maxImages) {
    throw new Error(`Maximum ${PROMPT_ATTACHMENT_LIMITS.maxImages} image attachments allowed.`);
  }
}
