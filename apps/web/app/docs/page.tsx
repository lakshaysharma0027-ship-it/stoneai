import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";

export const metadata: Metadata = {
  title: "Documentation",
  description: "StoneAI documentation for getting started, generation, publishing, billing, and domains.",
  alternates: { canonical: "/docs" },
};

export default function DocsPage() {
  return (
    <MarketingShell>
      <article className="marketing-page">
        <div className="marketing-page-inner">
          <h1>Documentation</h1>
          <p className="lead">Getting started with StoneAI generation, editing, publishing, and billing.</p>

          <section>
            <h2>Getting started</h2>
            <ul>
              <li>
                <Link href="/signup">Create an account</Link> and verify your email.
              </li>
              <li>Open the <Link href="/dashboard">dashboard</Link> to create your first project.</li>
              <li>Use Website Generation to describe your site in natural language.</li>
              <li>Edit visually in the editor, then publish from the dashboard.</li>
            </ul>
          </section>

          <section>
            <h2>Core workflows</h2>
            <ul>
              <li>
                <strong>Templates:</strong> browse <Link href="/templates">templates</Link> as starting points.
              </li>
              <li>
                <strong>Credits:</strong> review usage and plans on the <Link href="/pricing">pricing page</Link> and in
                dashboard billing.
              </li>
              <li>
                <strong>Domains:</strong> connect custom domains from the Domains section after publishing a site.
              </li>
              <li>
                <strong>Analytics:</strong> view visitor metrics for published sites in the Analytics dashboard view.
              </li>
            </ul>
          </section>

          <section>
            <h2>Need help?</h2>
            <p>
              Contact <Link href="/contact">StoneAI support</Link> or read the homepage{" "}
              <Link href="/#faq">FAQ</Link>.
            </p>
          </section>
        </div>
      </article>
    </MarketingShell>
  );
}
