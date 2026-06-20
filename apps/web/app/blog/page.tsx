import { ArticleCard, FeaturedArticles, TrendingArticles } from "@/components/blog/ArticleCards";
import { BlogSearch, CategoryFilter } from "@/components/blog/BlogSearch";
import { NewsletterCTA } from "@/components/blog/NewsletterCTA";
import { categories } from "@/content/blog/categories";
import { getAllArticles, getFeaturedArticles, getTrendingArticles } from "@/lib/blog/registry";

export default function BlogIndexPage() {
  const allArticles = getAllArticles();
  const featured = getFeaturedArticles(3);
  const trending = getTrendingArticles(5);
  const rest = allArticles.filter((a) => !featured.some((f) => f.slug === a.slug));

  return (
    <div className="blog-layout">
      <header className="blog-hero">
        <p className="blog-eyebrow">StoneAI Publication</p>
        <h1>Build smarter. Ship faster.</h1>
        <p>
          Deep guides on AI website builders, tool comparisons, industry playbooks, and conversion-focused
          design—for founders, agencies, and growth teams.
        </p>
        <BlogSearch articles={allArticles} />
      </header>

      <CategoryFilter categories={categories} />

      <FeaturedArticles articles={featured} />
      <TrendingArticles articles={trending} />

      <section>
        <div className="blog-section-header">
          <p className="blog-eyebrow">Latest</p>
          <h2>All articles</h2>
        </div>
        <div className="blog-grid">
          {rest.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      <NewsletterCTA />
    </div>
  );
}
