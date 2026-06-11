import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { STONEAI_CONTACT_EMAIL, STONEAI_SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "StoneAI terms of service for accounts, credits, subscriptions, publishing, and acceptable use.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <MarketingShell>
      <article className="marketing-page">
        <div className="marketing-page-inner">
          <h1>Terms of Service</h1>
          <p className="lead">Last updated: June 10, 2026</p>

          <section>
            <h2>Agreement</h2>
            <p>
              By accessing or using StoneAI at {STONEAI_SITE_URL}, you agree to these Terms of Service. If you do not
              agree, do not use the service.
            </p>
          </section>

          <section>
            <h2>Service</h2>
            <p>
              StoneAI provides AI-assisted website generation, visual editing, image and video generation workflows,
              publishing, custom domains, templates, analytics, and related features. Features may change over time as
              the product evolves.
            </p>
          </section>

          <section>
            <h2>Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for activity under
              your account. You must provide accurate registration information and comply with applicable laws.
            </p>
          </section>

          <section>
            <h2>Credits, billing, and subscriptions</h2>
            <ul>
              <li>Credits power AI generation, editing, image, and video workflows according to your plan.</li>
              <li>Paid plans renew according to the billing cycle selected at checkout unless canceled.</li>
              <li>Refunds, downgrades, and cancellations follow the billing terms shown at purchase and in your dashboard.</li>
              <li>Free trial and promotional credits may expire or change at StoneAI&apos;s discretion.</li>
            </ul>
          </section>

          <section>
            <h2>Acceptable use</h2>
            <p>You may not use StoneAI to create or distribute unlawful content, infringe intellectual property, send spam, attempt unauthorized access, reverse engineer the platform, or interfere with service operation.</p>
          </section>

          <section>
            <h2>Content and publishing</h2>
            <p>
              You retain rights to content you create, subject to rights needed for StoneAI to host, process, and publish
              your projects. You are responsible for content published to custom domains or StoneAI-hosted URLs.
            </p>
          </section>

          <section>
            <h2>Disclaimer</h2>
            <p>
              StoneAI is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We disclaim warranties to the
              maximum extent permitted by law. We are not liable for indirect, incidental, or consequential damages arising
              from use of the service.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              Legal or terms questions:{" "}
              <a href={`mailto:${STONEAI_CONTACT_EMAIL}`}>{STONEAI_CONTACT_EMAIL}</a>
            </p>
          </section>
        </div>
      </article>
    </MarketingShell>
  );
}
