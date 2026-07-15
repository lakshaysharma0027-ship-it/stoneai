import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { BlogCTA } from "@/components/blog/BlogCTA";
import { JsonLd } from "@/components/blog/JsonLd";
import { organizationSchema } from "@/lib/seo/sitewide-schema";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { STONEAI_APP_URL, STONEAI_COMPANY, STONEAI_DEFAULT_DESCRIPTION, STONEAI_X_URL } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Company — StoneAI",
  description:
    "StoneAI company overview: AI website generation, publishing infrastructure, and creative workflows for founders, agencies, and growth teams.",
  path: "/company",
});

export default function CompanyPage() {
  return (
    <MarketingShell>
      <JsonLd data={organizationSchema()} />
      <article className="marketing-page">
        <div className="marketing-page-inner">
          <p className="blog-eyebrow" style={{ marginBottom: 12 }}>Company</p>
          <h1>{STONEAI_COMPANY.name}</h1>
          <p className="lead">{STONEAI_DEFAULT_DESCRIPTION}</p>

          <section>
            <h2>What we build</h2>
            <p>
              StoneAI is an AI-native platform for building, editing, and publishing websites. Teams describe their
              brand in natural language; StoneAI generates layout, copy, visuals, and optional 3D cinematic sections.
              Everything is editable visually and publishable to custom domains.
            </p>
          </section>

          <section>
            <h2>Who we serve</h2>
            <ul>
              <li>Founders launching SaaS and product landing pages</li>
              <li>Agencies delivering client websites at scale</li>
              <li>Real estate, hospitality, and premium local brands</li>
              <li>Creatives building portfolio and studio sites</li>
            </ul>
          </section>

          <section>
            <h2>Locations</h2>
            <p>{STONEAI_COMPANY.locations}</p>
          </section>

          <section>
            <h2>Product</h2>
            <p>
              App: <a href={STONEAI_APP_URL}>{STONEAI_APP_URL.replace("https://", "")}</a>
              <br />
              Social: <a href={STONEAI_X_URL} rel="noopener noreferrer" target="_blank">@StoneAIusa</a>
            </p>
          </section>

          <section>
            <h2>Learn more</h2>
            <p>
              <Link href="/about">About</Link> · <Link href="/press">Press</Link> ·{" "}
              <Link href="/media-kit">Media kit</Link> · <Link href="/blog">Blog</Link>
            </p>
          </section>

          <BlogCTA variant="bottom" />
        </div>
      </article>
    </MarketingShell>
  );
}
