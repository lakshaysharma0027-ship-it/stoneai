import { notFound } from "next/navigation";
import type { Metadata } from "next";
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

  return <WebsiteRenderer website={site.publishedSchema} />;
}
