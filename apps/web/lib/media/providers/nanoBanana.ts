/**
 * Nano Banana production provider surface.
 * Currently backed by Google Gemini image APIs; swap model/env without changing pipeline callers.
 */
export { googleMediaProvider as nanoBananaProvider } from "@/services/media/providers/google";

export const NANO_BANANA_MODEL =
  process.env.GOOGLE_NANO_BANANA_MODEL ?? "gemini-2.5-flash-image";
