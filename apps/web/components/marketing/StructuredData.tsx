import { STONEAI_COMPANY, STONEAI_DEFAULT_DESCRIPTION, STONEAI_SITE_URL } from "@/lib/site";

export function StructuredData() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: STONEAI_COMPANY.name,
    url: STONEAI_SITE_URL,
    email: STONEAI_COMPANY.email,
    sameAs: [STONEAI_COMPANY.xUrl],
    description: STONEAI_DEFAULT_DESCRIPTION,
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: STONEAI_COMPANY.name,
    url: STONEAI_SITE_URL,
    description: STONEAI_DEFAULT_DESCRIPTION,
    publisher: {
      "@type": "Organization",
      name: STONEAI_COMPANY.name,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
