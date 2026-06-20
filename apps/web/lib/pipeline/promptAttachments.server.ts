import "server-only";

import type { PromptAttachment } from "@/lib/pipeline/promptAttachmentLimits";
import { PROMPT_ATTACHMENT_LIMITS } from "@/lib/pipeline/promptAttachmentLimits";
import { isAllowedPromptAttachmentUrl } from "@/lib/pipeline/validatePromptAttachments.server";

const PDF_FETCH_TIMEOUT_MS = 15_000;

const truncate = (text: string, max: number) =>
  text.length <= max ? text : `${text.slice(0, max)}\n…[truncated]`;

async function extractPdfText(buffer: Buffer): Promise<string> {
  const pdfParse = (await import("pdf-parse")).default;
  const result = await pdfParse(buffer);
  return result.text?.trim() ?? "";
}

async function fetchPdfBuffer(url: string, maxBytes: number): Promise<Buffer> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PDF_FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal, redirect: "error" });
    if (!response.ok) {
      throw new Error("PDF fetch failed.");
    }

    const contentLength = response.headers.get("content-length");
    if (contentLength && Number(contentLength) > maxBytes) {
      throw new Error("PDF exceeds size limit.");
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("PDF response has no body.");

    const chunks: Uint8Array[] = [];
    let total = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.length;
      if (total > maxBytes) {
        throw new Error("PDF exceeds size limit.");
      }
      chunks.push(value);
    }

    return Buffer.concat(chunks);
  } finally {
    clearTimeout(timeout);
  }
}

/** Build a compact context block — URLs only for images, extracted text for PDFs. */
export async function buildPromptAttachmentContext(
  attachments: PromptAttachment[],
  userId: string,
): Promise<string> {
  if (!attachments.length) return "";

  const lines: string[] = [
    "User-provided prompt references (for creative direction only — do NOT embed URLs or binary in JSON output):",
  ];

  for (const file of attachments) {
    if (file.type === "image") {
      lines.push(`- Reference image: ${file.name} (brand/visual asset — reflect in copy and art direction)`);
      continue;
    }

    if (!isAllowedPromptAttachmentUrl(file.url, userId)) {
      lines.push(`- PDF ${file.name}: could not be read`);
      continue;
    }

    try {
      const buffer = await fetchPdfBuffer(file.url, PROMPT_ATTACHMENT_LIMITS.pdfBytes);
      const text = truncate(await extractPdfText(buffer), PROMPT_ATTACHMENT_LIMITS.pdfTextChars);
      lines.push(`- PDF ${file.name} excerpt:\n${text || "(empty or unreadable)"}`);
    } catch {
      lines.push(`- PDF ${file.name}: extraction failed`);
    }
  }

  return lines.join("\n");
}
