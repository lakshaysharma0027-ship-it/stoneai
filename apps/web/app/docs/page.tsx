import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";

export const metadata: Metadata = {
  title: "Documentation - StoneAI",
  description:
    "StoneAI documentation: getting started, creating a website, publishing, domains, billing, and credits.",
};

type DocSection = {
  id: string;
  title: string;
  body: string[];
};

const sections: DocSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    body: [
      "Create a free account to get started - no credit card required. You'll receive starter credits to explore website generation, editing, and publishing.",
      "From the dashboard you can start a new project from a prompt or pick a template, then refine it in the visual editor.",
    ],
  },
  {
    id: "creating-a-website",
    title: "Creating a Website",
    body: [
      "Describe your site in plain language - the business, the vibe, and the sections you want. StoneAI generates a complete website with layout, copy, and visuals.",
      "Open the visual editor to fine-tune anything: click an element to edit it, drag to reorder sections, and use AI to rewrite copy or generate images and video.",
    ],
  },
  {
    id: "publishing",
    title: "Publishing",
    body: [
      "When your site is ready, publish it with one click. StoneAI deploys to a global edge network so your pages load fast everywhere.",
      "You can re-publish at any time to push updates live. Published sites stay online while your plan is active.",
    ],
  },
  {
    id: "domains",
    title: "Domains",
    body: [
      "Every site gets a StoneAI subdomain by default. On paid plans you can connect a custom domain you own.",
      "Add your domain in the dashboard, update the DNS records as shown, and StoneAI handles HTTPS and SSL automatically.",
    ],
  },
  {
    id: "billing",
    title: "Billing",
    body: [
      "StoneAI offers a free trial plus monthly and annual plans. Annual billing saves 20% compared to monthly.",
      "Manage your subscription from the dashboard - upgrade, downgrade, or cancel anytime. See the pricing page for current plans and limits.",
    ],
  },
  {
    id: "credits",
    title: "Credits",
    body: [
      "Credits power AI actions: generating a website, editing sections, running Nano Banana image workflows, and rendering Veo videos.",
      "Each plan includes a monthly credit allotment that resets every billing period. When credits run low, upgrade your plan for more.",
    ],
  },
];

export default function DocsPage() {
  return (
    <MarketingShell>
      <header className="page-hero">
        <p className="page-eyebrow">Documentation</p>
        <h1>
          StoneAI <span>docs.</span>
        </h1>
        <p className="page-lede">
          A starting guide to building, publishing, and managing websites with
          StoneAI. Need help?{" "}
          <Link href="/contact">Contact support</Link>.
        </p>
      </header>

      <section className="page-section">
        <div className="docs-layout">
          <aside className="docs-nav">
            <p>On this page</p>
            <ul>
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.title}</a>
                </li>
              ))}
            </ul>
          </aside>
          <div className="docs-body prose">
            {sections.map((section) => (
              <article key={section.id} id={section.id} className="docs-article">
                <h2>{section.title}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </article>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .docs-layout{display:grid;grid-template-columns:220px 1fr;gap:40px;align-items:start}
        .docs-nav{position:sticky;top:24px}
        .docs-nav p{color:#85858f;font-size:12px;letter-spacing:.12em;text-transform:uppercase;margin:0 0 12px}
        .docs-nav ul{list-style:none;display:flex;flex-direction:column;gap:10px}
        .docs-nav a{color:#c5c5cc;font-size:14px;text-decoration:none}
        .docs-nav a:hover{color:#fff}
        .docs-article{scroll-margin-top:24px}
        .docs-article + .docs-article{margin-top:40px;padding-top:40px;border-top:1px solid rgba(255,255,255,.09)}
        @media(max-width:820px){.docs-layout{grid-template-columns:1fr}.docs-nav{position:static}}
      `}</style>
    </MarketingShell>
  );
}
