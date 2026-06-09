import type { SupabaseClient } from "@supabase/supabase-js";
import type { TemplateSchema } from "@/lib/templateSchemas";
import type { OpenAIUsage } from "@/lib/ai/providers/openai";

export const aiPersistenceService = {
  async recordHistory(
    supabase: SupabaseClient,
    input: {
      userId: string;
      projectId?: string | null;
      prompt: string;
      generatedSchema: TemplateSchema;
      generationType: "generate" | "edit" | "restore";
    },
  ) {
    const { error } = await supabase.from("ai_generation_history").insert({
      user_id: input.userId,
      project_id: input.projectId ?? null,
      prompt: input.prompt,
      generated_schema: input.generatedSchema,
      generation_type: input.generationType,
    });

    if (error) throw error;
  },

  async recordUsage(
    supabase: SupabaseClient,
    input: {
      userId: string;
      projectId?: string | null;
      requestType: "generate" | "edit" | "content" | "translate";
      usage: OpenAIUsage;
    },
  ) {
    const { error } = await supabase.from("ai_usage_events").insert({
      user_id: input.userId,
      project_id: input.projectId ?? null,
      provider: "openai",
      model: input.usage.model,
      request_type: input.requestType,
      input_tokens: input.usage.inputTokens,
      output_tokens: input.usage.outputTokens,
      total_tokens: input.usage.totalTokens,
    });

    if (error) throw error;
  },
};
