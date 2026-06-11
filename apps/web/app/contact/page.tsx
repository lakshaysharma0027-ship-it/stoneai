import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { ContactForm } from "@/components/marketing/ContactForm";

export const metadata: Metadata = {
  title: "Contact StoneAI",
  description:
    "Get in touch with the StoneAI team. Email contact@stoneai.in or reach us on X.",
};

const CONTACT_EMAIL = "contact@stoneai.in";
const X_URL = "https://x.com/StoneAIusa";

export default function ContactPage() {
  return (
    <MarketingShell>
      <header className="page-hero">
        <p className="page-eyebrow">Contact</p>
        <h1>
          Talk to the <span>StoneAI team.</span>
        </h1>
        <p className="page-lede">
          Questions about plans, publishing, domains, or anything else? Send us a
          message and we&apos;ll get back to you.
        </p>
      </header>

      <section className="page-section">
        <div className="contact-layout">
          <div className="contact-details prose">
            <h2>Reach us directly</h2>
            <p>
              Email:{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </p>
            <p>
              On X:{" "}
              <a href={X_URL} target="_blank" rel="noopener noreferrer">
                @StoneAIusa
              </a>
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      <style>{`
        .contact-layout{display:grid;grid-template-columns:1fr 1.2fr;gap:32px;align-items:start}
        @media(max-width:820px){.contact-layout{grid-template-columns:1fr}}
      `}</style>
    </MarketingShell>
  );
}
