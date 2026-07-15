import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { rehydrateCinematicExperience } from "@/lib/cinematic/rehydrateExperience";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { siteResolver } from "@/lib/sites/siteResolver";
import { WebsiteRenderer } from "@/components/sites/WebsiteRenderer";

type SitePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: SitePageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const site = await siteResolver.resolveByPathSlug(supabase, slug);

  if (!site) return {};

  return {
    title: site.seoTitle ?? site.publishedSchema.meta.title,
    description: site.seoDescription ?? site.publishedSchema.meta.description,
    icons: site.faviconUrl ? [{ rel: "icon", url: site.faviconUrl }] : undefined,
    openGraph: {
      title: site.seoTitle ?? site.publishedSchema.meta.title,
      description: site.seoDescription ?? site.publishedSchema.meta.description,
      images: site.openGraphImageUrl ? [site.openGraphImageUrl] : undefined,
    },
  };
}

export default async function SitePage({ params }: SitePageProps) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const site = await siteResolver.resolveByPathSlug(supabase, slug);

  if (!site) notFound();

  await supabase.rpc("record_site_page_view", { target_site_id: site.id });

  const website = site.publishedSchema;

  if (website.meta.renderMode === "template_html" && website.meta.templateId) {
    redirect(`/api/sites/${slug}/template-html`);
  }

  let hydratedWebsite = website;
  const experience = hydratedWebsite.meta.cinematicExperience;
  if (experience) {
    const rehydrated = await rehydrateCinematicExperience(
      supabase,
      site.userId,
      site.projectId,
      experience,
    );
    hydratedWebsite = {
      ...hydratedWebsite,
      meta: {
        ...hydratedWebsite.meta,
        cinematicExperience: rehydrated,
      },
    };
  }

  return <WebsiteRenderer website={hydratedWebsite} />;
}
