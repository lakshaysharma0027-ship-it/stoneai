import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "StoneAI FAQ — AI Website Builder",
  description: "Answers to common questions about StoneAI credits, publishing, templates, custom domains, and billing.",
  path: "/faq",
});

const faqs = [
  [
    "Can I publish a real website?",
    "Yes. StoneAI creates editable websites that can be published, hosted, and connected to custom domains.",
  ],
  [
    "Is StoneAI only templates?",
    "No. Templates are starting points. AI generation, editing, images, and video adapt the site to your prompt and brand.",
  ],
  [
    "Does pricing live before signup?",
    "Yes. The public pricing page is available from the homepage navigation and footer.",
  ],
  [
    "What do credits power?",
    "Credits power website generation, AI edits, image workflows, video generation, and related AI actions.",
  ],
  [
    "Can I connect custom domains?",
    "Yes. Custom domains can be managed from the dashboard after you publish a site.",
  ],
  [
    "Where can I get help?",
    "Use the contact page for support, product questions, and partnership inquiries.",
  ],
];

export default function FaqPage() {
  return (
    <MarketingShell>
      <article className="marketing-page">
        <div className="marketing-page-inner">
          <h1>FAQ</h1>
          <p className="lead">
            Common questions before you build with StoneAI. Need more detail? <Link href="/contact">Contact us</Link>.
          </p>

          {faqs.map(([question, answer]) => (
            <section key={question}>
              <h2>{question}</h2>
              <p>{answer}</p>
            </section>
          ))}
        </div>
      </article>
    </MarketingShell>
  );
}
