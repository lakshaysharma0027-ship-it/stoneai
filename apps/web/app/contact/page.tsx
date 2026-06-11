import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { STONEAI_CONTACT_EMAIL, STONEAI_X_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact StoneAI for product support, billing questions, and enterprise inquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <MarketingShell>
      <article className="marketing-page">
        <div className="marketing-page-inner">
          <h1>Contact StoneAI</h1>
          <p className="lead">Product support, billing questions, and partnership inquiries.</p>

          <section>
            <h2>Email</h2>
            <p>
              <a href={`mailto:${STONEAI_CONTACT_EMAIL}`}>{STONEAI_CONTACT_EMAIL}</a>
            </p>
          </section>

          <section>
            <h2>Social</h2>
            <p>
              <a href={STONEAI_X_URL} rel="noopener noreferrer" target="_blank">
                @StoneAIusa on X
              </a>
            </p>
          </section>

          <section>
            <h2>Self-serve support</h2>
            <p>
              Existing customers can manage billing, domains, and projects from the{" "}
              <Link href="/dashboard">dashboard</Link>. New users can review{" "}
              <Link href="/#faq">FAQ</Link> or view <Link href="/pricing">pricing</Link>.
            </p>
          </section>
        </div>
      </article>
    </MarketingShell>
  );
}
