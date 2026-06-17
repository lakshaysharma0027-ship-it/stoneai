/**
 * Veo 3.1 Lite production provider surface.
 * Currently backed by Google GenAI video APIs; swap model/env without changing pipeline callers.
 */
export { googleMediaProvider as veoProvider } from "@/services/media/providers/google";

export const VEO_MODEL = "veo-3.1-lite-generate-preview";
