import { STONEAI_COMPANY, STONEAI_DEFAULT_DESCRIPTION, STONEAI_SITE_URL } from "@/lib/site";
import type { BlogArticle, FAQItem } from "./types";
import { formatDate } from "./utils";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: STONEAI_COMPANY.name,
    url: STONEAI_SITE_URL,
    email: STONEAI_COMPANY.email,
    sameAs: [STONEAI_COMPANY.xUrl],
    description: STONEAI_DEFAULT_DESCRIPTION,
    logo: `${STONEAI_SITE_URL}/brand/stoneai-logo.jpg`,
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqSchema(faq: FAQItem[]) {
  if (faq.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function articleSchema(article: BlogArticle, authorName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Organization",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: STONEAI_COMPANY.name,
      logo: {
        "@type": "ImageObject",
        url: `${STONEAI_SITE_URL}/brand/stoneai-logo.jpg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${STONEAI_SITE_URL}/blog/${article.slug}`,
    },
    image: `${STONEAI_SITE_URL}/brand/og-image.png`,
    articleSection: article.category,
    wordCount: article.readingTimeMinutes ? article.readingTimeMinutes * 220 : undefined,
  };
}

export function webPageSchema(title: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${STONEAI_SITE_URL}${path}`,
    isPartOf: {
      "@type": "WebSite",
      name: STONEAI_COMPANY.name,
      url: STONEAI_SITE_URL,
    },
    dateModified: new Date().toISOString().split("T")[0],
  };
}

export function JsonLd({ data }: { data: object | object[] | null }) {
  if (!data) return null;
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
