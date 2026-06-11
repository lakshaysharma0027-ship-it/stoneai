import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";

export const metadata: Metadata = {
  title: "About StoneAI",
  description:
    "StoneAI is an AI website builder for generating, editing, publishing, and hosting production websites with custom domains, image generation, and AI video.",
};

const capabilities = [
  ["✦", "AI website generation", "Describe a business in plain language and StoneAI generates a complete, production-grade website - layout, copy, and structure - not a template fill-in."],
  ["⚡", "Publishing", "Publish to a global edge network in one click. Sites go live fast and stay fast."],
  ["◎", "Custom domains", "Connect any domain with HTTPS, SSL, and DNS configuration handled from the dashboard."],
  ["▦", "Templates", "Start from a library of world-class templates, then customize anything with AI or the visual editor."],
  ["◐", "Image generation", "Generate on-brand imagery for any section with Nano Banana image workflows."],
  ["▶", "Video workflows", "Create hero loops, product demos, and background video with Veo generation - built into the editor."],
];

export default function AboutPage() {
  return (
    <MarketingShell>
      <header className="page-hero">
        <p className="page-eyebrow">About StoneAI</p>
        <h1>
          The fastest way to <span>build a real website.</span>
        </h1>
        <p className="page-lede">
          StoneAI is a production AI website builder. Describe what you want and
          StoneAI generates a complete, editable, publishable website - then
          helps you take it live on your own domain.
        </p>
      </header>

      <section className="page-section prose">
        <h2>What StoneAI is</h2>
        <p>
          StoneAI turns a short prompt into a full website: layout, copy, visual
          direction, sections, and deploy-ready structure. It pairs AI
          generation with a visual editor, so anyone can ship a credible site in
          minutes and refine every detail without touching code.
        </p>
        <p>
          From first prompt to a live site on a custom domain, StoneAI handles
          the entire workflow - generation, editing, media, publishing, and
          hosting - in one platform.
        </p>
      </section>

      <section className="page-section">
        <h2>What you can do</h2>
        <div className="card-grid">
          {capabilities.map(([icon, title, desc]) => (
            <article className="info-card" key={title}>
              <span className="icon">{icon}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section prose">
        <h2>Built for teams shipping for real</h2>
        <p>
          StoneAI is designed for founders, marketers, and agencies who need
          professional websites without the overhead of a full build. Explore{" "}
          <Link href="/pricing">pricing</Link>, browse{" "}
          <Link href="/templates">templates</Link>, or{" "}
          <Link href="/signup">start free</Link> - no credit card required.
        </p>
      </section>
    </MarketingShell>
  );
}
