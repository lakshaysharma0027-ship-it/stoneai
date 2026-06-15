"use client";

import Link from "next/link";
import { useState } from "react";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { STONEAI_CONTACT_EMAIL } from "@/lib/site";
import { calculatePlanMonthlyCredits, FREE_TRIAL_DAYS, PLAN_ACTION_LIMITS } from "@/lib/billing/planLimits";

type Plan = {
  id: "free_trial" | "basic" | "basic_plus" | "pro" | "premium";
  name: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  credits: number;
  websites: number;
  badge?: string;
  highlight?: boolean;
  cta: string;
  cardFeatures: string[];
  note?: string;
};

type Feature = {
  name: string;
  tooltip?: string;
  plans: Record<Plan["id"], boolean | string>;
};

const plans: Plan[] = [
  {
    id: "free_trial",
    name: "Free Trial",
    monthlyPrice: null,
    annualPrice: null,
    credits: calculatePlanMonthlyCredits("free_trial"),
    websites: PLAN_ACTION_LIMITS.free_trial.websites,
    cta: "Start Free Trial",
    note: `${FREE_TRIAL_DAYS} days only · Payment method required`,
    cardFeatures: [
      "100 credits",
      "1 website",
      "Preset gallery only",
      "Free hosting",
    ],
  },
  {
    id: "basic",
    name: "Basic",
    monthlyPrice: 15,
    annualPrice: 12,
    credits: calculatePlanMonthlyCredits("basic"),
    websites: PLAN_ACTION_LIMITS.basic.websites,
    cta: "Get Basic",
    cardFeatures: [
      "1 website · 2 images · 1 video · 1 AI edit",
      "Nano Banana & Veo",
      "Custom domain & free hosting",
    ],
  },
  {
    id: "basic_plus",
    name: "Basic Plus",
    monthlyPrice: 25,
    annualPrice: 20,
    credits: calculatePlanMonthlyCredits("basic_plus"),
    websites: PLAN_ACTION_LIMITS.basic_plus.websites,
    badge: "Most Popular",
    highlight: true,
    cta: "Get Basic Plus",
    cardFeatures: [
      "2 websites · 4 images · 2 videos · 2 AI edits",
      "Nano Banana & Veo",
      "Custom domain & free hosting",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 50,
    annualPrice: 40,
    credits: calculatePlanMonthlyCredits("pro"),
    websites: PLAN_ACTION_LIMITS.pro.websites,
    cta: "Get Pro",
    cardFeatures: [
      "4 websites · 16 images · 6 videos · 6 AI edits",
      "Priority generation queue",
      "Custom domain & free hosting",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    monthlyPrice: 100,
    annualPrice: 80,
    credits: calculatePlanMonthlyCredits("premium"),
    websites: PLAN_ACTION_LIMITS.premium.websites,
    badge: "Best Value",
    cta: "Get Premium",
    cardFeatures: [
      "10 websites · 20 images · 15 videos · 20 AI edits",
      "Priority support",
      "Custom domain & free hosting",
    ],
  },
];

const features: Feature[] = [
  {
    name: "AI Website Generation",
    tooltip: "Generate full websites from text prompts.",
    plans: { free_trial: true, basic: true, basic_plus: true, pro: true, premium: true },
  },
  {
    name: "Preset gallery (trial)",
    plans: { free_trial: true, basic: false, basic_plus: false, pro: false, premium: false },
  },
  {
    name: "Nano Banana images",
    plans: { free_trial: false, basic: true, basic_plus: true, pro: true, premium: true },
  },
  {
    name: "Veo video",
    plans: { free_trial: false, basic: true, basic_plus: true, pro: true, premium: true },
  },
  {
    name: "AI edits",
    plans: {
      free_trial: false,
      basic: "1",
      basic_plus: "2",
      pro: "6",
      premium: "20",
    },
  },
  {
    name: "Trial hosting",
    plans: { free_trial: `${FREE_TRIAL_DAYS} days`, basic: false, basic_plus: false, pro: false, premium: false },
  },
  {
    name: "Custom domains",
    plans: { free_trial: false, basic: true, basic_plus: true, pro: true, premium: true },
  },
  {
    name: "Free hosting",
    plans: { free_trial: true, basic: true, basic_plus: true, pro: true, premium: true },
  },
  {
    name: "Priority queue",
    plans: { free_trial: false, basic: false, basic_plus: false, pro: true, premium: true },
  },
];

const faqs = [
  ["What is a credit?", "Credits pay for AI actions: 100 for a website, 25 per image, 50 per video, and 50 per AI edit."],
  ["Can I upgrade or downgrade my plan?", "Yes. Change plans from your dashboard. Upgrades take effect immediately; downgrades apply at the next billing period."],
  ["What happens when I run out of credits?", "AI actions pause until credits reset. Published sites stay live."],
  ["Does the free trial require a payment method?", "Yes. A credit card, debit card, or UPI autopay is required. Use a 100% off coupon for testing — payment method still required."],
  ["What is Nano Banana?", "StoneAI's image generation for brand-fit website visuals."],
  ["What is Veo?", "AI video generation for hero loops and product showcases."],
  ["Do you offer annual billing?", "Yes. Annual billing saves 20% compared to monthly."],
  ["Is there an Enterprise plan?", `For 50+ sites, SSO, or custom volume, contact ${STONEAI_CONTACT_EMAIL}.`],
];

function Mark({ value }: { value: boolean | string }) {
  if (value === true) return <span className="mark yes">✓</span>;
  if (value === false) return <span className="mark no">×</span>;
  return <span className="matrix-text">{value}</span>;
}

function BillingToggle({ annual, setAnnual }: { annual: boolean; setAnnual: (value: boolean) => void }) {
  return (
    <div className="billing-toggle">
      <button className={!annual ? "active" : ""} onClick={() => setAnnual(false)} type="button">Monthly</button>
      <button aria-label="Toggle billing period" className="switch" onClick={() => setAnnual(!annual)} type="button"><span className={annual ? "annual" : ""} /></button>
      <button className={annual ? "active" : ""} onClick={() => setAnnual(true)} type="button">Annual <em>Save 20%</em></button>
    </div>
  );
}

function PricingCard({ plan, annual }: { plan: Plan; annual: boolean }) {
  const price = annual ? plan.annualPrice : plan.monthlyPrice;

  return (
    <article className={`pricing-card${plan.highlight ? " highlight" : ""}`}>
      {plan.badge ? <span className="card-badge">{plan.badge}</span> : null}
      <h3>{plan.name}</h3>
      <div className="card-price">{price === null ? "Free" : `$${price}`}<span>{price === null ? "" : "/mo"}</span></div>
      {annual && price ? <p className="annual-note">Billed ${price * 12}/year</p> : <p className="annual-note">{plan.note ?? (plan.id === "free_trial" ? `${FREE_TRIAL_DAYS} days only` : "Cancel anytime")}</p>}
      <ul className="card-features">
        {plan.cardFeatures.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
      <Link className={plan.highlight ? "card-cta primary" : "card-cta"} href={plan.id === "free_trial" ? "/signup" : `/signup?plan=${plan.id}&billing=${annual ? "annual" : "monthly"}`}>{plan.cta}</Link>
    </article>
  );
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <main className="marketing-page pricing-page">
      <MarketingNav />
      <section className="section pricing-hero">
        <div className="container narrow">
          <p className="eyebrow">Pricing</p>
          <h1>Simple plans. Real limits. No surprises.</h1>
          <h2>One AI platform for generation, editing, images, and video. Start with a {FREE_TRIAL_DAYS}-day free trial.</h2>
          <BillingToggle annual={annual} setAnnual={setAnnual} />
        </div>
      </section>

      <section className="section">
        <div className="container pricing-grid">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} annual={annual} />
          ))}
        </div>
      </section>

      <section className="section matrix-section">
        <div className="container">
          <h2>Compare plans</h2>
          <div className="matrix-wrap">
            <table className="matrix">
              <thead>
                <tr>
                  <th>Feature</th>
                  {plans.map((plan) => (
                    <th key={plan.id}>{plan.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feature) => (
                  <tr key={feature.name}>
                    <td>{feature.name}</td>
                    {plans.map((plan) => (
                      <td key={plan.id}>
                        <Mark value={feature.plans[plan.id]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section faq-section">
        <div className="container narrow">
          <h2>FAQ</h2>
          <div className="faq-list">
            {faqs.map(([question, answer]) => (
              <details key={question} className="faq-item">
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <MarketingFooter />
    </main>
  );
}
