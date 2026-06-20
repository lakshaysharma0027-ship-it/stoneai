import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { ContentRenderer } from "@/components/blog/ContentRenderer";
import { FAQSection } from "@/components/blog/FAQSection";
import { BlogCTA } from "@/components/blog/BlogCTA";
import { RelatedArticles } from "@/components/blog/ArticleCards";
import { getTemplateSeoBySlug, getAllTemplateSeoSlugs } from "@/content/blog/templates-seo/registry";
import { getArticleBySlug } from "@/lib/blog/registry";
import { JsonLd } from "@/components/blog/JsonLd";
import { breadcrumbSchema, faqSchema, webPageSchema } from "@/lib/blog/schema";
import { STONEAI_SITE_URL } from "@/lib/site";
import "@/components/blog/blog.css";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllTemplateSeoSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getTemplateSeoBySlug(slug);
  if (!page) return {};

  return {
    title: page.seoTitle,
    description: page.metaDescription,
    alternates: { canonical: `/templates/${slug}` },
    openGraph: {
      title: page.seoTitle,
      description: page.metaDescription,
      url: `/templates/${slug}`,
      images: [{ url: "/brand/og-image.png", width: 1200, height: 630 }],
    },
  };
}

export default async function TemplateSeoPage({ params }: Props) {
  const { slug } = await params;
  const page = getTemplateSeoBySlug(slug);
  if (!page) notFound();

  const relatedArticles = page.relatedArticleSlugs
    .map((s) => getArticleBySlug(s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  return (
    <MarketingShell>
      <JsonLd
        data={[
          webPageSchema(page.title, page.metaDescription, `/templates/${slug}`),
          breadcrumbSchema([
            { name: "Home", url: STONEAI_SITE_URL },
            { name: "Templates", url: `${STONEAI_SITE_URL}/templates` },
            { name: page.name, url: `${STONEAI_SITE_URL}/templates/${slug}` },
          ]),
          faqSchema(page.faq),
        ]}
      />
      <div className="seo-landing">
        <Breadcrumbs
          items={[
            { label: "Templates", href: "/templates" },
            { label: page.name },
          ]}
        />
        <header className="seo-landing-hero">
          <p className="blog-eyebrow">StoneAI Template</p>
          <h1>{page.title}</h1>
          <p className="subtitle">{page.subtitle}</p>
          <div className="seo-landing-cta-row">
            <Link href="/signup" className="seo-btn-primary">
              Generate This Template
            </Link>
            <Link href="/templates" className="seo-btn-ghost">
              Browse All Templates
            </Link>
          </div>
        </header>

        <div
          className="seo-template-preview"
          style={{ background: page.previewGradient }}
        >
          <span>{page.name} template preview</span>
        </div>

        <BlogCTA variant="top" />

        <div className="seo-features-grid">
          {page.features.map((f) => (
            <div key={f.title} className="seo-feature-card">
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </div>
          ))}
        </div>

        <BlogCTA variant="middle" />
        <ContentRenderer blocks={page.content} />
        <BlogCTA variant="bottom" />
        <FAQSection faq={page.faq} />
        {relatedArticles.length > 0 && <RelatedArticles articles={relatedArticles} />}
      </div>
    </MarketingShell>
  );
}
