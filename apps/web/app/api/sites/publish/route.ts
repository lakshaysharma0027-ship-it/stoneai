import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Website } from "@/lib/editor/schema";
import { getPublicSiteUrl, normalizeSiteSlug } from "@/lib/sites/siteResolver";
import { creditService } from "@/services/billing/creditService";
import { planLimitService } from "@/services/billing/planLimitService";

const isWebsite = (value: unknown): value is Website => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Partial<Website>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.projectId === "string" &&
    typeof candidate.name === "string" &&
    Array.isArray(candidate.pages)
  );
};

const resolveAvailableSlug = async (
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  requestedSlug: string,
  projectId: string,
) => {
  const base = normalizeSiteSlug(requestedSlug);

  for (let index = 0; index < 20; index += 1) {
    const slug = index === 0 ? base : `${base}-${index + 1}`;
    const { data, error } = await supabase
      .from("sites")
      .select("project_id")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;
    if (!data || (data as { project_id: string }).project_id === projectId) return slug;
  }

  return `${base}-${crypto.randomUUID().slice(0, 8)}`;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      website?: unknown;
      projectId?: string;
      settings?: {
        siteName?: string;
        seoTitle?: string;
        seoDescription?: string;
        faviconUrl?: string;
        openGraphImageUrl?: string;
        slug?: string;
      };
    };

    if (!isWebsite(payload.website) && !payload.projectId?.trim()) {
      return NextResponse.json({ error: "A valid website or projectId is required." }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError && userError.message !== "Auth session missing!") throw userError;
    if (!user) {
      return NextResponse.json({ error: "You must be logged in to publish." }, { status: 401 });
    }

    let website: Website;

    if (isWebsite(payload.website)) {
      website = payload.website;
    } else {
      const projectId = payload.projectId!.trim();
      const { data: websiteRow, error: websiteError } = await supabase
        .from("websites")
        .select("website")
        .eq("project_id", projectId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (websiteError) throw websiteError;

      if (isWebsite((websiteRow as { website?: unknown } | null)?.website)) {
        website = (websiteRow as { website: Website }).website;
      } else {
        return NextResponse.json(
          { error: "Cinematic website not found. Regenerate with the pipeline." },
          { status: 404 },
        );
      }
    }

    if (website.meta.renderMode !== "cinematic_scroll" || !website.meta.cinematicExperience) {
      return NextResponse.json(
        { error: "Only cinematic scroll experiences can be published." },
        { status: 400 },
      );
    }

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id,user_id")
      .eq("id", website.projectId)
      .single();

    if (projectError) throw projectError;
    if ((project as { user_id: string }).user_id !== user.id) {
      return NextResponse.json({ error: "You cannot publish this project." }, { status: 403 });
    }

    const subscription = await creditService.ensureSubscription(supabase, user.id);
    try {
      await planLimitService.assertCanCreateSite(supabase, {
        userId: user.id,
        subscription,
        currentProjectId: website.projectId,
      });
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Your plan limit has been reached." },
        { status: 402 },
      );
    }

    const slug = await resolveAvailableSlug(
      supabase,
      payload.settings?.slug || website.slug || website.name,
      website.projectId,
    );
    const seoTitle = payload.settings?.seoTitle?.trim() || website.pages[0]?.seo.title || website.meta.title || website.name;
    const seoDescription = payload.settings?.seoDescription?.trim() || website.pages[0]?.seo.description || website.meta.description || "";
    const faviconUrl = payload.settings?.faviconUrl?.trim() || website.meta.favicon;
    const openGraphImageUrl = payload.settings?.openGraphImageUrl?.trim() || website.meta.socialImage;

    const publishedSchema: Website = {
      ...website,
      name: payload.settings?.siteName?.trim() || website.name,
      slug,
      meta: {
        ...website.meta,
        title: seoTitle,
        description: seoDescription,
        favicon: faviconUrl || null,
        socialImage: openGraphImageUrl || null,
      },
      updatedAt: new Date().toISOString(),
      version: website.version + 1,
    };

    const { data, error } = await supabase
      .from("sites")
      .upsert(
        {
          project_id: website.projectId,
          user_id: user.id,
          slug,
          status: "published",
          published_schema: publishedSchema,
          seo_title: seoTitle,
          seo_description: seoDescription,
          favicon_url: faviconUrl || null,
          open_graph_image_url: openGraphImageUrl || null,
        },
        { onConflict: "project_id" },
      )
      .select("id,project_id,user_id,slug,status,published_schema,seo_title,seo_description,favicon_url,open_graph_image_url,created_at,updated_at")
      .single();

    if (error) throw error;

    const { error: analyticsError } = await supabase.from("site_analytics").upsert(
      {
        site_id: (data as { id: string }).id,
        publish_date: new Date().toISOString(),
      },
      { onConflict: "site_id" },
    );

    if (analyticsError) {
      console.error("[StoneAI publish] analytics upsert failed", analyticsError);
      throw analyticsError;
    }

    const { error: domainError } = await supabase
      .from("domains")
      .update({ status: "active" })
      .eq("site_id", (data as { id: string }).id)
      .eq("user_id", user.id)
      .eq("status", "verified");

    if (domainError) throw domainError;

    return NextResponse.json({
      site: data,
      publicUrl: getPublicSiteUrl(slug, new URL(request.url).origin),
    });
  } catch (error) {
    console.error("[StoneAI publish] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not publish site." },
      { status: 500 },
    );
  }
}
