import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";

export const metadata: Metadata = {
  title: "FAQ - StoneAI",
  description:
    "Answers to common questions about StoneAI: credits, publishing, custom domains, AI models, and billing.",
};

const faqs: [string, string][] = [
  [
    "What is StoneAI?",
    "StoneAI is a production AI website builder. Describe what you want and StoneAI generates a complete, editable website - layout, copy, images, and structure - then helps you publish it to a global edge network on your own domain.",
  ],
  [
    "How do credits work?",
    "Credits are the currency of StoneAI. Each AI action - generating a website, editing a section, running a Nano Banana image workflow, or rendering a Veo video - consumes credits. Plans include a monthly credit allotment that resets each billing period, and you can upgrade anytime for more.",
  ],
  [
    "Can I publish real websites?",
    "Yes. StoneAI creates fully editable websites that can be published, hosted, and shared. Published sites go live on a global edge network in seconds and remain live as long as your plan is active.",
  ],
  [
    "Can I connect custom domains?",
    "Yes. You can connect any domain you own with HTTPS, SSL, and DNS configuration managed from the dashboard. Custom domains are available on paid plans.",
  ],
  [
    "What AI models are used?",
    "StoneAI combines best-in-class models for each task: large language models for generation and editing, Nano Banana workflows for images and on-brand copy, and Veo for AI video. The platform routes each request to the right model so you get the best result without managing models yourself.",
  ],
  [
    "How does billing work?",
    "StoneAI offers a free trial plus monthly and annual subscription plans. Annual billing saves 20% versus monthly. You can upgrade, downgrade, or cancel anytime from your dashboard - upgrades take effect immediately and downgrades apply at the next billing period.",
  ],
];

export default function FaqPage() {
  return (
    <MarketingShell>
      <header className="page-hero">
        <p className="page-eyebrow">FAQ</p>
        <h1>
          Questions before <span>you build.</span>
        </h1>
        <p className="page-lede">
          Everything you need to know about StoneAI. Can&apos;t find an answer?{" "}
          <Link href="/contact">Contact us</Link>.
        </p>
      </header>

      <section className="page-section">
        <div className="faq-list">
          {faqs.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <style>{`
        .faq-list details{border-bottom:1px solid rgba(255,255,255,.09);padding:22px 0}
        .faq-list summary{cursor:pointer;font-weight:800;font-size:16px;list-style:none}
        .faq-list summary::-webkit-details-marker{display:none}
        .faq-list summary::after{content:"+";float:right;color:#85858f;font-weight:400}
        .faq-list details[open] summary::after{content:"−"}
        .faq-list p{color:#85858f;line-height:1.75;margin:14px 0 0;max-width:760px}
      `}</style>
    </MarketingShell>
  );
}
