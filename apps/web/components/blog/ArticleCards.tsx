import Link from "next/link";
import type { BlogArticle } from "@/lib/blog/types";
import { formatDate } from "@/lib/blog/utils";
import { categoryMap } from "@/content/blog/categories";

export function ArticleCard({ article }: { article: BlogArticle }) {
  const category = categoryMap[article.category];
  return (
    <article className="blog-card">
      <Link href={`/blog/${article.slug}`} className="blog-card-link">
        <div className="blog-card-meta">
          {category && <span className="blog-category-pill">{category.name}</span>}
          <span>{article.readingTimeMinutes ?? 5} min</span>
        </div>
        <h2>{article.title}</h2>
        <p>{article.excerpt}</p>
        <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
      </Link>
    </article>
  );
}

export function FeaturedArticles({ articles }: { articles: BlogArticle[] }) {
  if (articles.length === 0) return null;
  const [hero, ...rest] = articles;
  if (!hero) return null;
  return (
    <section className="blog-featured">
      <div className="blog-section-header">
        <p className="blog-eyebrow">Featured</p>
        <h2>Editor&apos;s picks</h2>
      </div>
      <div className="blog-featured-grid">
        <ArticleCard article={hero} />
        <div className="blog-featured-side">
          {rest.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrendingArticles({ articles }: { articles: BlogArticle[] }) {
  if (articles.length === 0) return null;
  return (
    <section className="blog-trending">
      <div className="blog-section-header">
        <p className="blog-eyebrow">Trending</p>
        <h2>Popular reads</h2>
      </div>
      <ol className="blog-trending-list">
        {articles.map((article, i) => (
          <li key={article.slug}>
            <span className="blog-trending-rank">{String(i + 1).padStart(2, "0")}</span>
            <Link href={`/blog/${article.slug}`}>
              <strong>{article.title}</strong>
              <span>{article.readingTimeMinutes ?? 5} min read</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function RelatedArticles({ articles }: { articles: BlogArticle[] }) {
  if (articles.length === 0) return null;
  return (
    <section className="blog-related">
      <h2>Related articles</h2>
      <div className="blog-related-grid">
        {articles.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>
    </section>
  );
}
