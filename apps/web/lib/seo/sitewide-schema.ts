import { STONEAI_COMPANY, STONEAI_FOUNDERS, STONEAI_DEFAULT_DESCRIPTION, STONEAI_SITE_URL } from "@/lib/site";
import type { FAQItem } from "@/lib/blog/types";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: STONEAI_COMPANY.name,
    legalName: STONEAI_COMPANY.legalName,
    url: STONEAI_SITE_URL,
    email: STONEAI_COMPANY.email,
    sameAs: [STONEAI_COMPANY.xUrl],
    description: STONEAI_DEFAULT_DESCRIPTION,
    logo: `${STONEAI_SITE_URL}/brand/stoneai-logo.jpg`,
    foundingLocation: STONEAI_COMPANY.locations,
    founder: STONEAI_FOUNDERS.map((founder) => ({
      "@type": "Person",
      name: founder.name,
      jobTitle: founder.role,
      image: `${STONEAI_SITE_URL}${founder.image}`,
      description: founder.bio,
    })),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: STONEAI_COMPANY.name,
    url: STONEAI_SITE_URL,
    description: STONEAI_DEFAULT_DESCRIPTION,
    publisher: { "@type": "Organization", name: STONEAI_COMPANY.name },
    potentialAction: {
      "@type": "SearchAction",
      target: `${STONEAI_SITE_URL}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function softwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "StoneAI",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: STONEAI_SITE_URL,
    description: STONEAI_DEFAULT_DESCRIPTION,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free trial available",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "127",
      bestRating: "5",
    },
    featureList: [
      "AI website generation",
      "3D cinematic websites",
      "Visual editor",
      "Custom domains",
      "AI image generation",
      "AI video generation",
    ],
  };
}

export function productSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "StoneAI Website Builder",
    description: STONEAI_DEFAULT_DESCRIPTION,
    brand: { "@type": "Brand", name: STONEAI_COMPANY.name },
    url: `${STONEAI_SITE_URL}/pricing`,
    image: `${STONEAI_SITE_URL}/brand/og-image.png`,
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "0",
      highPrice: "99",
      priceCurrency: "USD",
      offerCount: "4",
      url: `${STONEAI_SITE_URL}/pricing`,
    },
  };
}

export function reviewSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "SoftwareApplication",
      name: "StoneAI",
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: "5",
      bestRating: "5",
    },
    author: { "@type": "Person", name: "Maya Chen" },
    reviewBody:
      "StoneAI feels like having a product designer, copywriter, and deployment engineer in the same prompt box.",
  };
}

export function faqPageSchema(faq: FAQItem[]) {
  if (faq.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function sitewideSchemas() {
  return [organizationSchema(), websiteSchema(), softwareApplicationSchema(), productSchema()];
}
