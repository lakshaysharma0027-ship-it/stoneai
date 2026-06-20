import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/blog/ArticleCards";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { NewsletterCTA } from "@/components/blog/NewsletterCTA";
import { categoryMap, categories } from "@/content/blog/categories";
import { getArticlesByCategory } from "@/lib/blog/registry";
import { breadcrumbSchema, JsonLd } from "@/lib/blog/schema";
import { STONEAI_SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = categoryMap[slug];
  if (!category) return {};

  return {
    title: `${category.name} — StoneAI Blog`,
    description: category.description,
    alternates: { canonical: `/blog/category/${slug}` },
    openGraph: {
      title: `${category.name} — StoneAI Blog`,
      description: category.description,
      url: `/blog/category/${slug}`,
    },
  };
}

export default async function BlogCategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = categoryMap[slug];
  if (!category) notFound();

  const articles = getArticlesByCategory(slug);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: STONEAI_SITE_URL },
          { name: "Blog", url: `${STONEAI_SITE_URL}/blog` },
          { name: category.name, url: `${STONEAI_SITE_URL}/blog/category/${slug}` },
        ])}
      />
      <div className="blog-layout">
        <Breadcrumbs
          items={[
            { label: "Blog", href: "/blog" },
            { label: category.name },
          ]}
        />
        <header className="blog-hero" style={{ textAlign: "left", margin: "0 0 40px" }}>
          <p className="blog-eyebrow">Category</p>
          <h1 style={{ textAlign: "left" }}>{category.name}</h1>
          <p style={{ textAlign: "left" }}>{category.description}</p>
        </header>
        <div className="blog-grid">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
        <NewsletterCTA />
      </div>
    </>
  );
}
