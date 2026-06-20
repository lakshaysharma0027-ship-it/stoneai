import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleBreadcrumbs, ArticleMeta } from "@/components/blog/Breadcrumbs";
import { ContentRenderer } from "@/components/blog/ContentRenderer";
import { AuthorBox } from "@/components/blog/AuthorBox";
import { FAQSection } from "@/components/blog/FAQSection";
import { RelatedArticles } from "@/components/blog/ArticleCards";
import { SocialShare } from "@/components/blog/SocialShare";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { NewsletterCTA } from "@/components/blog/NewsletterCTA";
import { authors } from "@/content/blog/authors";
import {
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  JsonLd,
} from "@/lib/blog/schema";
import {
  getAllArticleSlugs,
  getArticleBySlug,
  getRelatedArticles,
} from "@/lib/blog/registry";
import { STONEAI_SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.seoTitle,
    description: article.metaDescription,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: article.seoTitle,
      description: article.metaDescription,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      url: `/blog/${slug}`,
      images: [{ url: "/brand/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.seoTitle,
      description: article.metaDescription,
      images: ["/brand/og-image.png"],
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const author = authors[article.authorId] ?? authors["stoneai-team"]!;
  const related = getRelatedArticles(article);

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: STONEAI_SITE_URL },
    { name: "Blog", url: `${STONEAI_SITE_URL}/blog` },
    { name: article.title, url: `${STONEAI_SITE_URL}/blog/${slug}` },
  ]);

  return (
    <>
      <JsonLd data={[articleSchema(article, author.name), breadcrumbs, faqSchema(article.faq)]} />
      <article className="blog-layout">
        <ArticleBreadcrumbs article={article} />
        <header className="blog-article-header">
          <ArticleMeta article={article} authorName={author.name} />
          <h1>{article.title}</h1>
          <p className="lead">{article.excerpt}</p>
          <SocialShare title={article.title} slug={article.slug} />
        </header>

        <div className="blog-article-layout">
          <TableOfContents content={article.content} />
          <div>
            <ContentRenderer blocks={article.content} />
            <AuthorBox author={author} />
            <FAQSection faq={article.faq} />
          </div>
        </div>

        <RelatedArticles articles={related} />
        <NewsletterCTA />
      </article>
    </>
  );
}
