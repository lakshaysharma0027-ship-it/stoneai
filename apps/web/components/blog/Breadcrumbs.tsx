import Link from "next/link";
import type { BlogArticle } from "@/lib/blog/types";
import { formatDate } from "@/lib/blog/utils";
import { categoryMap } from "@/content/blog/categories";

export function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="blog-breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((item, i) => (
          <li key={item.label}>
            {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
            {i < items.length - 1 && <span className="blog-breadcrumb-sep">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function ArticleBreadcrumbs({ article }: { article: BlogArticle }) {
  const category = categoryMap[article.category];
  return (
    <Breadcrumbs
      items={[
        { label: "Blog", href: "/blog" },
        { label: category?.name ?? article.category, href: `/blog/category/${article.category}` },
        { label: article.title },
      ]}
    />
  );
}

export function ArticleMeta({
  article,
  authorName,
}: {
  article: BlogArticle;
  authorName: string;
}) {
  const category = categoryMap[article.category];
  return (
    <div className="blog-article-meta">
      {category && (
        <Link href={`/blog/category/${article.category}`} className="blog-category-pill">
          {category.name}
        </Link>
      )}
      <span>{authorName}</span>
      <span aria-hidden>·</span>
      <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
      <span aria-hidden>·</span>
      <span>{article.readingTimeMinutes ?? 5} min read</span>
    </div>
  );
}
