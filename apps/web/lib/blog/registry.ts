// Article registry — imports all blog articles
import { article as stoneaiVsLovable } from "@/content/blog/articles/stoneai-vs-lovable";
import { article as stoneaiVsFramer } from "@/content/blog/articles/stoneai-vs-framer";
import { article as stoneaiVsBolt } from "@/content/blog/articles/stoneai-vs-bolt";
import { article as bestAiWebsiteBuilders2026 } from "@/content/blog/articles/best-ai-website-builders-2026";
import { article as best3dWebsiteBuilders } from "@/content/blog/articles/best-3d-website-builders";
import { article as bestLovableAlternatives } from "@/content/blog/articles/best-lovable-alternatives";
import { article as bestFramerAlternatives } from "@/content/blog/articles/best-framer-alternatives";
import { article as bestBoltAlternatives } from "@/content/blog/articles/best-bolt-alternatives";
import { article as howToBuildWebsiteWithAi } from "@/content/blog/articles/how-to-build-website-with-ai";
import { article as aiWebsiteBuilderRealEstate } from "@/content/blog/articles/ai-website-builder-real-estate";
import { article as aiWebsiteBuilderAgencies } from "@/content/blog/articles/ai-website-builder-agencies";
import { article as aiWebsiteBuilderRestaurants } from "@/content/blog/articles/ai-website-builder-restaurants";
import { article as aiWebsiteBuilderDentists } from "@/content/blog/articles/ai-website-builder-dentists";
import { article as aiWebsiteBuilderStartups } from "@/content/blog/articles/ai-website-builder-startups";
import { article as websiteBuilderVsHiringDeveloper } from "@/content/blog/articles/website-builder-vs-hiring-developer";
import { article as aiWebsiteBuilderPricingGuide } from "@/content/blog/articles/ai-website-builder-pricing-guide";
import { article as bestLandingPageBuilders } from "@/content/blog/articles/best-landing-page-builders";
import { article as bestPortfolioWebsiteBuilders } from "@/content/blog/articles/best-portfolio-website-builders";
import { article as bestAgencyWebsiteBuilders } from "@/content/blog/articles/best-agency-website-builders";
import { article as howToCreateInteractive3dWebsites } from "@/content/blog/articles/how-to-create-interactive-3d-websites";
import { article as bestAiWebsiteBuilderForSaas } from "@/content/blog/articles/best-ai-website-builder-for-saas";
import { article as bestAiWebsiteBuilderForConsultants } from "@/content/blog/articles/best-ai-website-builder-for-consultants";
import { article as bestAiWebsiteBuilderForArchitects } from "@/content/blog/articles/best-ai-website-builder-for-architects";
import { article as bestAiWebsiteBuilderForPhotographers } from "@/content/blog/articles/best-ai-website-builder-for-photographers";
import { article as howAiIsChangingWebsiteDesign } from "@/content/blog/articles/how-ai-is-changing-website-design";
import { article as bestInteractiveWebsiteExamples } from "@/content/blog/articles/best-interactive-website-examples";
import { article as bestStartupWebsiteExamples } from "@/content/blog/articles/best-startup-website-examples";
import { article as aiWebsiteBuilderVsWebDesigner } from "@/content/blog/articles/ai-website-builder-vs-web-designer";
import { article as costOfBuildingAWebsiteIn2026 } from "@/content/blog/articles/cost-of-building-a-website-in-2026";
import { article as howToLaunchAWebsiteFast } from "@/content/blog/articles/how-to-launch-a-website-fast";
import { article as websiteDesignTrends2026 } from "@/content/blog/articles/website-design-trends-2026";
import { article as howToCreateAnimatedWebsites } from "@/content/blog/articles/how-to-create-animated-websites";
import { article as futureOf3dWebsites } from "@/content/blog/articles/future-of-3d-websites";
import { article as bestWebsiteBuildersForSmallBusinesses } from "@/content/blog/articles/best-website-builders-for-small-businesses";
import { article as bestAiWebsiteBuilderForLawyers } from "@/content/blog/articles/best-ai-website-builder-for-lawyers";
import { article as bestAiWebsiteBuilderForCoaches } from "@/content/blog/articles/best-ai-website-builder-for-coaches";
import { article as bestAiWebsiteBuilderForFitness } from "@/content/blog/articles/best-ai-website-builder-for-fitness";
import { article as stoneaiVsWebflow } from "@/content/blog/articles/stoneai-vs-webflow";
import { article as bestAiWebsiteBuilderForEcommerce } from "@/content/blog/articles/best-ai-website-builder-for-ecommerce";
import { article as bestAiWebsiteBuilderForInteriorDesigners } from "@/content/blog/articles/best-ai-website-builder-for-interior-designers";
import type { BlogArticle } from "@/lib/blog/types";
import { enrichArticle } from "@/lib/blog/utils";

const rawArticles: BlogArticle[] = [
  stoneaiVsLovable,
  stoneaiVsFramer,
  stoneaiVsBolt,
  bestAiWebsiteBuilders2026,
  best3dWebsiteBuilders,
  bestLovableAlternatives,
  bestFramerAlternatives,
  bestBoltAlternatives,
  howToBuildWebsiteWithAi,
  aiWebsiteBuilderRealEstate,
  aiWebsiteBuilderAgencies,
  aiWebsiteBuilderRestaurants,
  aiWebsiteBuilderDentists,
  aiWebsiteBuilderStartups,
  websiteBuilderVsHiringDeveloper,
  aiWebsiteBuilderPricingGuide,
  bestLandingPageBuilders,
  bestPortfolioWebsiteBuilders,
  bestAgencyWebsiteBuilders,
  howToCreateInteractive3dWebsites,
  bestAiWebsiteBuilderForSaas,
  bestAiWebsiteBuilderForConsultants,
  bestAiWebsiteBuilderForArchitects,
  bestAiWebsiteBuilderForPhotographers,
  howAiIsChangingWebsiteDesign,
  bestInteractiveWebsiteExamples,
  bestStartupWebsiteExamples,
  aiWebsiteBuilderVsWebDesigner,
  costOfBuildingAWebsiteIn2026,
  howToLaunchAWebsiteFast,
  websiteDesignTrends2026,
  howToCreateAnimatedWebsites,
  futureOf3dWebsites,
  bestWebsiteBuildersForSmallBusinesses,
  bestAiWebsiteBuilderForLawyers,
  bestAiWebsiteBuilderForCoaches,
  bestAiWebsiteBuilderForFitness,
  stoneaiVsWebflow,
  bestAiWebsiteBuilderForEcommerce,
  bestAiWebsiteBuilderForInteriorDesigners,
];

export const articles: BlogArticle[] = rawArticles.map(enrichArticle);

export function getAllArticles(): BlogArticle[] {
  return [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: string): BlogArticle[] {
  return getAllArticles().filter((a) => a.category === category);
}

export function getFeaturedArticles(limit = 3): BlogArticle[] {
  return getAllArticles().filter((a) => a.featured).slice(0, limit);
}

export function getTrendingArticles(limit = 5): BlogArticle[] {
  return getAllArticles().filter((a) => a.trending).slice(0, limit);
}

export function getRelatedArticles(article: BlogArticle, limit = 3): BlogArticle[] {
  const related = article.relatedSlugs
    .map((slug) => getArticleBySlug(slug))
    .filter((a): a is BlogArticle => Boolean(a));
  if (related.length >= limit) return related.slice(0, limit);
  const sameCategory = getArticlesByCategory(article.category).filter(
    (a) => a.slug !== article.slug && !related.some((r) => r.slug === a.slug),
  );
  return [...related, ...sameCategory].slice(0, limit);
}

export function getAllArticleSlugs(): string[] {
  return articles.map((a) => a.slug);
}
