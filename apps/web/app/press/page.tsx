import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { BlogCTA } from "@/components/blog/BlogCTA";
import { STONEAI_COMPANY, STONEAI_CONTACT_EMAIL, STONEAI_X_URL } from "@/lib/site";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Press — StoneAI News & Announcements",
  description:
    "StoneAI press resources, product announcements, and media contact for journalists covering AI website builders and no-code publishing.",
  path: "/press",
});

const announcements = [
  {
    date: "2026-03-01",
    title: "StoneAI launches cinematic 3D website generation",
    summary: "New pipeline generates interactive WebGL experiences from natural language prompts.",
  },
  {
    date: "2026-01-15",
    title: "StoneAI expands AI media with integrated image and video",
    summary: "Nano Banana and Veo workflows now ship inside the website builder workspace.",
  },
  {
    date: "2025-11-10",
    title: "StoneAI opens public beta for agencies",
    summary: "Digital agencies can now deliver client sites from prompt to publish in under an hour.",
  },
];

export default function PressPage() {
  return (
    <MarketingShell>
      <article className="marketing-page">
        <div className="marketing-page-inner">
          <p className="blog-eyebrow" style={{ marginBottom: 12 }}>Press</p>
          <h1>StoneAI in the news</h1>
          <p className="lead">
            Coverage, announcements, and resources for journalists writing about AI website builders,
            no-code publishing, and the future of web design.
          </p>

          <section>
            <h2>Media contact</h2>
            <p>
              For press inquiries:{" "}
              <a href={`mailto:${STONEAI_CONTACT_EMAIL}`}>{STONEAI_CONTACT_EMAIL}</a>
            </p>
            <p>Follow updates on <a href={STONEAI_X_URL} rel="noopener noreferrer" target="_blank">X (@StoneAIusa)</a>.</p>
          </section>

          <section>
            <h2>Recent announcements</h2>
            {announcements.map((item) => (
              <div key={item.title} style={{ marginBottom: 24 }}>
                <time dateTime={item.date} style={{ fontSize: 12, color: "#85858f" }}>{item.date}</time>
                <h3 style={{ margin: "6px 0" }}>{item.title}</h3>
                <p>{item.summary}</p>
              </div>
            ))}
          </section>

          <section>
            <h2>Resources</h2>
            <ul>
              <li><Link href="/media-kit">Media kit &amp; brand assets</Link></li>
              <li><Link href="/company">Company overview</Link></li>
              <li><Link href="/about">About StoneAI</Link></li>
            </ul>
          </section>

          <BlogCTA variant="bottom" />
        </div>
      </article>
    </MarketingShell>
  );
}
