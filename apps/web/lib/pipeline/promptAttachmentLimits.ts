export type PromptAttachment = {
  url: string;
  name: string;
  type: "image" | "pdf";
};

export const PROMPT_ATTACHMENT_LIMITS = {
  maxFiles: 5,
  maxImages: 4,
  maxPdfs: 2,
  imageBytes: 5 * 1024 * 1024,
  pdfBytes: 10 * 1024 * 1024,
  pdfTextChars: 3000,
} as const;
