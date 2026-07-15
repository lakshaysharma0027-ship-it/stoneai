import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { STONEAI_COMPANY, STONEAI_DEFAULT_DESCRIPTION, STONEAI_SITE_URL } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Media Kit — StoneAI Brand Assets",
  description:
    "Download StoneAI logos, brand colors, product screenshots, and boilerplate copy for press, partnerships, and marketing.",
  path: "/media-kit",
});

export default function MediaKitPage() {
  return (
    <MarketingShell>
      <article className="marketing-page">
        <div className="marketing-page-inner">
          <p className="blog-eyebrow" style={{ marginBottom: 12 }}>Media Kit</p>
          <h1>Brand assets</h1>
          <p className="lead">
            Official StoneAI logos, colors, and copy for press, partners, and creators.
          </p>

          <section>
            <h2>Logo</h2>
            <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16 }}>
              <Image
                src="/brand/stoneai-logo.jpg"
                alt="StoneAI logo"
                width={64}
                height={64}
                style={{ borderRadius: 12 }}
              />
              <div>
                <p>Primary mark — use on dark backgrounds.</p>
                <p>
                  <a href="/brand/stoneai-logo.jpg" download>Download logo (JPG)</a>
                  {" · "}
                  <a href="/brand/og-image.png" download>Download OG image (PNG)</a>
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2>Brand colors</h2>
            <ul>
              <li>Background: #050506</li>
              <li>Surface: #0b0b0d</li>
              <li>Text primary: #f7f7f8</li>
              <li>Text muted: #85858f</li>
              <li>Accent: #ffffff</li>
            </ul>
          </section>

          <section>
            <h2>Boilerplate</h2>
            <blockquote>
              {STONEAI_COMPANY.name} is an AI website builder that turns natural language into production-ready
              websites with cinematic 3D design, visual editing, custom domains, and integrated AI image and video
              generation. {STONEAI_DEFAULT_DESCRIPTION}
            </blockquote>
          </section>

          <section>
            <h2>Product URL</h2>
            <p>
              <a href={STONEAI_SITE_URL}>{STONEAI_SITE_URL}</a>
            </p>
          </section>

          <section>
            <p>
              <Link href="/press">Press page</Link> · <Link href="/contact">Contact</Link>
            </p>
          </section>
        </div>
      </article>
    </MarketingShell>
  );
}
