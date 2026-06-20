"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { BlogArticle } from "@/lib/blog/types";
import { categoryMap } from "@/content/blog/categories";

export function BlogSearch({ articles }: { articles: BlogArticle[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return articles
      .filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.tags?.some((t) => t.toLowerCase().includes(q)) ||
          categoryMap[a.category]?.name.toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [articles, query]);

  return (
    <div className="blog-search">
      <label htmlFor="blog-search-input" className="sr-only">
        Search articles
      </label>
      <input
        id="blog-search-input"
        type="search"
        placeholder="Search articles, topics, tools..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoComplete="off"
      />
      {query && (
        <div className="blog-search-results">
          {results.length === 0 ? (
            <p className="blog-search-empty">No articles found for &ldquo;{query}&rdquo;</p>
          ) : (
            <ul>
              {results.map((article) => (
                <li key={article.slug}>
                  <Link href={`/blog/${article.slug}`} onClick={() => setQuery("")}>
                    <strong>{article.title}</strong>
                    <span>{article.excerpt.slice(0, 80)}…</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export function CategoryFilter({
  categories,
  active,
}: {
  categories: { slug: string; name: string }[];
  active?: string;
}) {
  return (
    <div className="blog-category-filter">
      <Link href="/blog" className={!active ? "active" : undefined}>
        All
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/blog/category/${cat.slug}`}
          className={active === cat.slug ? "active" : undefined}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
