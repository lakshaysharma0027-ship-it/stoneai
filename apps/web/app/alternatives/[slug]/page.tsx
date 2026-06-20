import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { ContentRenderer } from "@/components/blog/ContentRenderer";
import { FAQSection } from "@/components/blog/FAQSection";
import { BlogCTA } from "@/components/blog/BlogCTA";
import { RelatedArticles } from "@/components/blog/ArticleCards";
import { getAlternativeBySlug, getAllAlternativeSlugs } from "@/content/blog/alternatives/registry";
import { getArticleBySlug } from "@/lib/blog/registry";
import { breadcrumbSchema, faqSchema, JsonLd, webPageSchema } from "@/lib/blog/schema";
import { STONEAI_SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllAlternativeSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getAlternativeBySlug(slug);
  if (!page) return {};

  return {
    title: page.seoTitle,
    description: page.metaDescription,
    alternates: { canonical: `/alternatives/${slug}` },
    openGraph: {
      title: page.seoTitle,
      description: page.metaDescription,
      url: `/alternatives/${slug}`,
      images: [{ url: "/brand/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.seoTitle,
      description: page.metaDescription,
    },
  };
}

export default async function AlternativePage({ params }: Props) {
  const { slug } = await params;
  const page = getAlternativeBySlug(slug);
  if (!page) notFound();

  const relatedArticles = page.relatedArticleSlugs
    .map((s) => getArticleBySlug(s))
    .filter(Boolean);

  return (
    <>
      <JsonLd
        data={[
          webPageSchema(page.title, page.metaDescription, `/alternatives/${slug}`),
          breadcrumbSchema([
            { name: "Home", url: STONEAI_SITE_URL },
            { name: "Alternatives", url: `${STONEAI_SITE_URL}/alternatives/${slug}` },
            { name: page.title, url: `${STONEAI_SITE_URL}/alternatives/${slug}` },
          ]),
          faqSchema(page.faq),
        ]}
      />
      <div className="seo-landing">
        <Breadcrumbs
          items={[
            { label: "Blog", href: "/blog" },
            { label: "Alternatives", href: "/blog/category/alternatives" },
            { label: page.title },
          ]}
        />
        <header className="seo-landing-hero">
          <p className="blog-eyebrow">StoneAI Alternative</p>
          <h1>{page.title}</h1>
          <p className="subtitle">{page.subtitle}</p>
          <p className="subtitle">{page.heroDescription}</p>
          <div className="seo-landing-cta-row">
            <Link href="/signup" className="seo-btn-primary">
              Start Building Free
            </Link>
            <Link href="/pricing" className="seo-btn-ghost">
              View Pricing
            </Link>
          </div>
        </header>

        <BlogCTA variant="top" />

        <div className="blog-comparison-wrap">
          <table className="blog-comparison">
            <thead>
              <tr>
                {page.comparisonHeaders.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {page.comparisonRows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
