import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/MarketingShell";

export const metadata: Metadata = {
  title: "Privacy Policy - StoneAI",
  description: "How StoneAI collects, uses, and protects your information.",
};

const CONTACT_EMAIL = "contact@stoneai.in";

const sections: { title: string; body: string[] }[] = [
  {
    title: "1. Information We Collect",
    body: [
      "Account information you provide when you sign up, such as your name and email address.",
      "Content you create, including prompts, generated websites, uploaded assets, and project data.",
      "Usage and device information collected automatically, such as log data, browser type, and interactions with the service.",
      "Payment information processed by our payment provider. We do not store full card details on our servers.",
    ],
  },
  {
    title: "2. How We Use Information",
    body: [
      "To provide, operate, and improve StoneAI, including generating, editing, publishing, and hosting websites.",
      "To process subscriptions, credits, and billing.",
      "To communicate with you about your account, updates, and support requests.",
      "To maintain security, prevent abuse, and comply with legal obligations.",
    ],
  },
  {
    title: "3. AI Processing",
    body: [
      "Prompts and content you submit may be processed by AI models to generate websites, images, video, and copy. We use this content to deliver the features you request and to operate the service.",
    ],
  },
  {
    title: "4. Sharing of Information",
    body: [
      "We do not sell your personal information. We share information only with service providers who help us operate StoneAI (such as hosting, payments, and email), and when required by law.",
    ],
  },
  {
    title: "5. Data Retention",
    body: [
      "We retain your information for as long as your account is active or as needed to provide the service. You may request deletion of your account and associated data.",
    ],
  },
  {
    title: "6. Security",
    body: [
      "We use industry-standard measures to protect your information. No method of transmission or storage is completely secure, but we work to safeguard your data.",
    ],
  },
  {
    title: "7. Your Rights",
    body: [
      "Depending on your location, you may have rights to access, correct, export, or delete your personal information. Contact us to exercise these rights.",
    ],
  },
  {
    title: "8. Changes to This Policy",
    body: [
      "We may update this Privacy Policy from time to time. Material changes will be communicated through the service or by email.",
    ],
  },
  {
    title: "9. Contact",
    body: [`Questions about this policy? Email us at ${CONTACT_EMAIL}.`],
  },
];

export default function PrivacyPage() {
  return (
    <MarketingShell>
      <header className="page-hero">
        <p className="page-eyebrow">Legal</p>
        <h1>Privacy Policy</h1>
        <p className="updated-note">Last updated: June 2026</p>
      </header>

      <section className="page-section prose legal-body">
        <p>
          This Privacy Policy explains how StoneAI collects, uses, and protects
          your information when you use our website builder and related services.
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
