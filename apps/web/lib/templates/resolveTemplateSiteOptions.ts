import type { SupabaseClient } from "@supabase/supabase-js";
import type { Website } from "@/lib/editor/schema";
import type { PipelineMetadata } from "@/lib/pipeline/types";

export type TemplateSiteBuildOptions = {
  templateId: string;
  replacementImageUrl: string | null;
  contentOverrides: Record<string, string> | null;
};

export const mergeTemplateMetaFromPipeline = (
  website: Website,
  metadata?: PipelineMetadata | null,
): Website => {
  if (!metadata || metadata.renderMode !== "template_html") return website;

  return {
    ...website,
    meta: {
      ...website.meta,
      templateId: website.meta.templateId ?? metadata.templateId ?? undefined,
      renderMode: "template_html",
      templateReplacementImageUrl:
        website.meta.templateReplacementImageUrl ??
        metadata.templateReplacementImageUrl ??
        null,
      templateContentOverrides:
        website.meta.templateContentOverrides ?? metadata.templateContentOverrides ?? null,
    },
  };
};

export async function resolvePublishedTemplateSiteOptions(
  supabase: SupabaseClient,
  projectId: string,
  publishedSchema: Website,
): Promise<TemplateSiteBuildOptions | null> {
  const meta = publishedSchema.meta;
  let templateId = meta.templateId ?? null;
  let replacementImageUrl = meta.templateReplacementImageUrl ?? null;
  let contentOverrides = meta.templateContentOverrides ?? null;

  const needsPipelineFallback =
    !templateId || !contentOverrides || replacementImageUrl === null;

  if (needsPipelineFallback) {
    const { data: project, error } = await supabase
      .from("projects")
      .select("template_id,pipeline_metadata")
      .eq("id", projectId)
      .maybeSingle();

    if (error) throw error;

    const pipelineMetadata = (project as { pipeline_metadata?: PipelineMetadata } | null)
      ?.pipeline_metadata;

    templateId =
      templateId ??
      pipelineMetadata?.templateId ??
      (project as { template_id?: string } | null)?.template_id ??
      null;

    if (replacementImageUrl === null || replacementImageUrl === undefined) {
      replacementImageUrl = pipelineMetadata?.templateReplacementImageUrl ?? null;
    }

    if (!contentOverrides || Object.keys(contentOverrides).length === 0) {
      contentOverrides = pipelineMetadata?.templateContentOverrides ?? null;
    }
  }

  if (!templateId || meta.renderMode !== "template_html") {
    return null;
  }

  return {
    templateId,
    replacementImageUrl,
    contentOverrides: contentOverrides ?? null,
  };
}
