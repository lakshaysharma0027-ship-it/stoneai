import type { SupabaseClient } from "@supabase/supabase-js";
import { rehydrateCinematicExperience } from "@/lib/cinematic/rehydrateExperience";
import { templateSchemaToWebsite } from "@/lib/editor/applyTemplateSchema";
import type { Website } from "@/lib/editor/schema";
import type { TemplateSchema } from "@/lib/templateSchemas";

const isWebsite = (value: unknown): value is Website => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Partial<Website>;
  return typeof candidate.id === "string" && Array.isArray(candidate.pages);
};

const isTemplateSchema = (value: unknown): value is TemplateSchema => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Partial<TemplateSchema>;
  return typeof candidate.id === "string" && Array.isArray(candidate.sections);
};

export async function loadProjectWebsite(
  supabase: SupabaseClient,
  userId: string,
  projectId: string,
): Promise<Website | null> {
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id,name,website_schema,pipeline_metadata")
    .eq("id", projectId)
    .eq("user_id", userId)
    .maybeSingle();

  if (projectError) throw projectError;
  if (!project) return null;

  const [{ data: websiteRow, error: websiteError }, { data: siteRow, error: siteError }] =
    await Promise.all([
      supabase.from("websites").select("website,updated_at").eq("project_id", projectId).maybeSingle(),
      supabase
        .from("sites")
        .select("published_schema,status,updated_at")
        .eq("project_id", projectId)
        .maybeSingle(),
    ]);

  if (websiteError) throw websiteError;
  if (siteError) throw siteError;

  let website: Website | null = isWebsite((websiteRow as { website?: unknown } | null)?.website)
    ? (websiteRow as { website: Website }).website
    : null;

  const publishedWebsite =
    (siteRow as { status?: string; published_schema?: unknown } | null)?.status === "published" &&
    isWebsite((siteRow as { published_schema?: unknown } | null)?.published_schema)
      ? (siteRow as { published_schema: Website }).published_schema
      : null;

  if (publishedWebsite && website) {
    const siteUpdated = new Date((siteRow as { updated_at: string }).updated_at).getTime();
    const draftUpdated = new Date((websiteRow as { updated_at: string }).updated_at).getTime();
    website = siteUpdated >= draftUpdated ? publishedWebsite : website;
  } else if (publishedWebsite) {
    website = publishedWebsite;
  }

  if (!website) {
    const schema = (project as { website_schema?: unknown }).website_schema;
    if (isTemplateSchema(schema)) {
      website = templateSchemaToWebsite(
        projectId,
        (project as { name?: string }).name ?? "Generated Website",
        schema,
      );
    }
  }

  if (!website) return null;

  const experience = website.meta.cinematicExperience;
  if (!experience) return website;

  const rehydrated = await rehydrateCinematicExperience(
    supabase,
    userId,
    projectId,
    experience,
  );

  return {
    ...website,
    meta: {
      ...website.meta,
      cinematicExperience: rehydrated,
    },
  };
}
