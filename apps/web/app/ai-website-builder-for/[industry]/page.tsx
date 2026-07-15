import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { ContentRenderer } from "@/components/blog/ContentRenderer";
import { FAQSection } from "@/components/blog/FAQSection";
import { BlogCTA } from "@/components/blog/BlogCTA";
import { RelatedArticles } from "@/components/blog/ArticleCards";
import { getIndustryBySlug, getAllIndustrySlugs } from "@/content/industries/registry";
import { getArticleBySlug } from "@/lib/blog/registry";
import { JsonLd } from "@/components/blog/JsonLd";
import { breadcrumbSchema, faqSchema, webPageSchema } from "@/lib/blog/schema";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { STONEAI_SITE_URL } from "@/lib/site";
import "@/components/blog/blog.css";

type Props = { params: Promise<{ industry: string }> };

export async function generateStaticParams() {
  return getAllIndustrySlugs().map((industry) => ({ industry }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry } = await params;
  const page = getIndustryBySlug(industry);
  if (!page) return {};
  return buildPageMetadata({
    title: page.seoTitle,
    description: page.metaDescription,
    path: `/ai-website-builder-for/${industry}`,
  });
}

export default async function IndustrySeoPage({ params }: Props) {
  const { industry } = await params;
  const page = getIndustryBySlug(industry);
  if (!page) notFound();

  const relatedArticles = page.relatedArticleSlugs
    .map((s) => getArticleBySlug(s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  const path = `/ai-website-builder-for/${industry}`;

  return (
    <>
      <JsonLd
        data={[
          webPageSchema(page.title, page.metaDescription, path),
          breadcrumbSchema([
            { name: "Home", url: STONEAI_SITE_URL },
            { name: "Industries", url: `${STONEAI_SITE_URL}/blog/category/industry` },
            { name: page.name, url: `${STONEAI_SITE_URL}${path}` },
          ]),
          faqSchema(page.faq),
        ]}
      />
      <div className="seo-landing">
        <Breadcrumbs
          items={[
            { label: "Blog", href: "/blog" },
            { label: "Industries", href: "/blog/category/industry" },
            { label: page.title },
          ]}
        />
        <header className="seo-landing-hero">
          <p className="blog-eyebrow">AI Website Builder</p>
          <h1>{page.title}</h1>
          <p className="subtitle">{page.subtitle}</p>
          <p className="subtitle">{page.heroDescription}</p>
          <div className="seo-stats-row">
            {page.stats.map((stat) => (
              <div key={stat.label} className="seo-stat">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="seo-landing-cta-row">
            <Link href="/signup" className="seo-btn-primary">
              Build Your Website With AI
            </Link>
            {page.templateSlug && (
              <Link href={`/templates/${page.templateSlug}`} className="seo-btn-ghost">
                View Template
              </Link>
            )}
          </div>
        </header>

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
    </>
  );
}
