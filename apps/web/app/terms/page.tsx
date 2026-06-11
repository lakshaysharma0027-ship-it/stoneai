import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/MarketingShell";

export const metadata: Metadata = {
  title: "Terms of Service - StoneAI",
  description: "The terms and conditions for using StoneAI.",
};

const CONTACT_EMAIL = "contact@stoneai.in";

const sections: { title: string; body: string[] }[] = [
  {
    title: "1. Acceptance of Terms",
    body: [
      "By accessing or using StoneAI, you agree to these Terms of Service. If you do not agree, do not use the service.",
    ],
  },
  {
    title: "2. The Service",
    body: [
      "StoneAI provides an AI website builder for generating, editing, publishing, and hosting websites, including image and video generation and custom-domain support. Features may change over time.",
    ],
  },
  {
    title: "3. Accounts",
    body: [
      "You are responsible for maintaining the security of your account and for all activity that occurs under it. You must provide accurate information and keep it up to date.",
    ],
  },
  {
    title: "4. Plans, Credits, and Billing",
    body: [
      "Paid plans are billed in advance on a monthly or annual basis. Credits are consumed by AI actions and reset each billing period.",
      "You can upgrade, downgrade, or cancel anytime from your dashboard. Fees already paid are non-refundable except where required by law.",
    ],
  },
  {
    title: "5. Acceptable Use",
    body: [
      "You may not use StoneAI to create or distribute unlawful, infringing, harmful, or abusive content, or to violate the rights of others.",
      "You may not attempt to disrupt, reverse engineer, or gain unauthorized access to the service.",
    ],
  },
  {
    title: "6. Your Content",
    body: [
      "You retain ownership of the content you create with StoneAI. You grant us the rights necessary to host, process, and display your content in order to provide the service.",
      "You are responsible for ensuring you have the rights to any content you upload or publish.",
    ],
  },
  {
    title: "7. Intellectual Property",
    body: [
      "StoneAI and its underlying software, branding, and design are owned by StoneAI and protected by applicable laws. These Terms do not grant you rights to our trademarks or technology.",
    ],
  },
  {
    title: "8. Disclaimers",
    body: [
      'The service is provided "as is" without warranties of any kind. We do not guarantee that the service will be uninterrupted, error-free, or that generated output will meet your requirements.',
    ],
  },
  {
    title: "9. Limitation of Liability",
    body: [
      "To the maximum extent permitted by law, StoneAI is not liable for indirect, incidental, or consequential damages arising from your use of the service.",
    ],
  },
  {
    title: "10. Termination",
    body: [
      "We may suspend or terminate your access if you violate these Terms. You may stop using the service and close your account at any time.",
    ],
  },
  {
    title: "11. Changes to These Terms",
    body: [
      "We may update these Terms from time to time. Continued use of the service after changes take effect constitutes acceptance of the updated Terms.",
    ],
  },
  {
    title: "12. Contact",
    body: [`Questions about these Terms? Email us at ${CONTACT_EMAIL}.`],
  },
];

export default function TermsPage() {
  return (
    <MarketingShell>
      <header className="page-hero">
        <p className="page-eyebrow">Legal</p>
        <h1>Terms of Service</h1>
        <p className="updated-note">Last updated: June 2026</p>
      </header>

      <section className="page-section prose legal-body">
        <p>
          These Terms of Service govern your access to and use of StoneAI. Please
          read them carefully.
        </p>
        {sections.map((section) => (
          <div className="legal-section" key={section.title}>
            <h2>{section.title}</h2>
            {section.body.length > 1 ? (
              <ul>
                {section.body.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>{section.body[0]}</p>
            )}
          </div>
        ))}
      </section>

      <style>{`
        .legal-section{margin-top:32px}
        .legal-section h2{font-size:20px;margin:0 0 12px}
      `}</style>
    </MarketingShell>
  );
}
