import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";

export const metadata: Metadata = {
  title: "Features",
  description: "Explore StoneAI features for AI website generation, visual editing, publishing, domains, images, and video.",
  alternates: { canonical: "/features" },
};

const features = [
  ["AI Generation", "Describe your website in natural language and StoneAI builds a complete, editable site structure."],
  ["Visual Editor", "Edit content, sections, and layout visually without writing code."],
  ["Instant Publish", "Publish generated websites quickly with production-ready hosting workflows."],
  ["Custom Domains", "Connect owned domains with HTTPS and DNS guidance from the dashboard."],
  ["AI Image Generation", "Create on-brand image assets for sections, campaigns, and launches."],
  ["AI Video", "Generate hero loops, explainers, and product storytelling clips for richer pages."],
];

export default function FeaturesPage() {
  return (
    <MarketingShell>
      <article className="marketing-page">
        <div className="marketing-page-inner">
          <h1>Features</h1>
          <p className="lead">
            StoneAI brings generation, editing, publishing, domains, and media workflows into one website creation
            workspace.
          </p>

          {features.map(([title, description]) => (
            <section key={title}>
              <h2>{title}</h2>
              <p>{description}</p>
            </section>
          ))}

          <section>
            <p>
              Browse <Link href="/templates">templates</Link> or compare <Link href="/pricing">pricing</Link>.
            </p>
          </section>
        </div>
      </article>
    </MarketingShell>
  );
}
