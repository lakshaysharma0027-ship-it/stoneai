import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { STONEAI_CONTACT_EMAIL, STONEAI_SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "StoneAI privacy policy for website generation, accounts, billing, and published sites.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <MarketingShell>
      <article className="marketing-page">
        <div className="marketing-page-inner">
          <h1>Privacy Policy</h1>
          <p className="lead">Last updated: June 10, 2026</p>

          <section>
            <h2>Overview</h2>
            <p>
              StoneAI ({STONEAI_SITE_URL}) provides AI website generation, editing, publishing, domains, and related
              services. This policy explains how we collect, use, and protect information when you use our website and
              application.
            </p>
          </section>

          <section>
            <h2>Information we collect</h2>
            <ul>
              <li>Account information such as name, email address, and authentication credentials.</li>
              <li>Project content including prompts, generated websites, media assets, and publishing settings.</li>
              <li>Billing and subscription data processed through our payment providers.</li>
              <li>Usage data such as page views on published sites, analytics events, and product diagnostics.</li>
              <li>Technical data including IP address, browser type, device information, and cookies.</li>
            </ul>
          </section>

          <section>
            <h2>How we use information</h2>
            <ul>
              <li>Provide, maintain, and improve StoneAI services.</li>
              <li>Authenticate users, secure accounts, and prevent abuse.</li>
              <li>Process subscriptions, credits, and customer support requests.</li>
              <li>Generate websites, images, video assets, and AI-assisted edits you request.</li>
              <li>Publish sites, connect custom domains, and deliver analytics.</li>
              <li>Send transactional emails such as verification, password reset, and billing notices.</li>
            </ul>
          </section>

          <section>
            <h2>Sharing</h2>
            <p>
              We use trusted infrastructure and service providers for hosting, authentication, payments, email delivery,
              and AI processing. We do not sell personal information. We may disclose information when required by law or
              to protect StoneAI, our users, and the public.
            </p>
          </section>

          <section>
            <h2>Retention and security</h2>
            <p>
              We retain account and project data while your account is active and as needed to provide services, comply
              with legal obligations, and resolve disputes. We apply administrative, technical, and organizational
              safeguards appropriate to the nature of the data we process.
            </p>
          </section>

          <section>
            <h2>Your choices</h2>
            <p>
              You may update account settings in the dashboard, request account deletion by contacting us, and manage
              cookie preferences through your browser. Published site analytics may be collected from visitors to sites
              you publish through StoneAI.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              Questions about this policy:{" "}
              <a href={`mailto:${STONEAI_CONTACT_EMAIL}`}>{STONEAI_CONTACT_EMAIL}</a>
            </p>
          </section>
        </div>
      </article>
    </MarketingShell>
  );
}
