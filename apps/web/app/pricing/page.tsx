"use client";

import Link from "next/link";
import { useState } from "react";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { STONEAI_CONTACT_EMAIL } from "@/lib/site";

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
    credits: 100,
    websites: 1,
    cta: "Start Free Trial",
    note: "3 days only · Credit card, debit card, or UPI autopay required",
    cardFeatures: [
      "AI Website Generation",
      "AI Editing",
      "Trial Hosting",
      "100 Credits",
      "1 Website",
    ],
  },
  {
    id: "basic",
    name: "Basic",
    monthlyPrice: 15,
    annualPrice: 12,
    credits: 1500,
    websites: 1,
    cta: "Get Basic",
    cardFeatures: [
      "AI Website Generation",
      "AI Editing",
      "Nano Banana Image Generation",
      "Custom Domains",
    ],
  },
  {
    id: "basic_plus",
    name: "Basic Plus",
    monthlyPrice: 25,
    annualPrice: 20,
    credits: 2500,
    websites: 2,
    badge: "Most Popular",
    highlight: true,
    cta: "Get Basic Plus",
    cardFeatures: [
      "AI Website Generation",
      "AI Editing",
      "Nano Banana Image Generation",
      "Veo 3.1 Video Generation",
      "Custom Domains",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 40,
    annualPrice: 32,
    credits: 6000,
    websites: 5,
    cta: "Get Pro",
    cardFeatures: [
      "AI Website Generation",
      "AI Editing",
      "Nano Banana Image Generation",
      "Veo 3.1 Video Generation",
      "Custom Domains",
      "Priority Generation Queue",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    monthlyPrice: 160,
    annualPrice: 128,
    credits: 25000,
    websites: 30,
    badge: "Best Value",
    cta: "Get Premium",
    cardFeatures: [
      "AI Website Generation",
      "AI Editing",
      "Nano Banana Image Generation",
      "Veo 3.1 Video Generation",
      "Custom Domains",
      "Priority Support",
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
    name: "AI Editing",
    tooltip: "Edit any element with natural language.",
    plans: { free_trial: true, basic: true, basic_plus: true, pro: true, premium: true },
  },
  {
    name: "Trial Hosting",
    plans: { free_trial: "3 days", basic: false, basic_plus: false, pro: false, premium: false },
  },
  {
    name: "Nano Banana Image Generation",
    tooltip: "AI image generation for on-brand website visuals.",
    plans: { free_trial: false, basic: true, basic_plus: true, pro: true, premium: true },
  },
  {
    name: "Veo 3.1 Video Generation",
    tooltip: "AI video generation embedded in website sections.",
    plans: { free_trial: false, basic: false, basic_plus: true, pro: true, premium: true },
  },
  {
    name: "Custom Domains",
    plans: { free_trial: false, basic: true, basic_plus: true, pro: true, premium: true },
  },
  {
    name: "Priority Generation Queue",
    plans: { free_trial: false, basic: false, basic_plus: false, pro: true, premium: true },
  },
  {
    name: "Priority Support",
    plans: { free_trial: false, basic: false, basic_plus: false, pro: false, premium: true },
  },
];

const faqs = [
  ["What is a credit?", "Credits are the currency of StoneAI. Each AI action - generating a page section, editing a component, running Nano Banana, or rendering a Veo 3.1 clip - consumes credits."],
  ["Can I upgrade or downgrade my plan?", "Yes. You can change plans from your dashboard. Upgrades take effect immediately; downgrades apply at the next billing period."],
  ["What happens when I run out of credits?", "AI-powered actions pause until your credits reset. Your published sites remain live."],
  ["Does the free trial require a payment method?", "Yes. A credit card, debit card, or UPI autopay is required to start the 3-day free trial."],
  ["What is Nano Banana?", "Nano Banana is StoneAI's inline image and copy workflow for rewriting content and generating brand-fit visuals."],
  ["What is Veo 3.1?", "Veo 3.1 generates website-ready video scenes, hero loops, product showcases, and explainers."],
  ["Do you offer annual billing?", "Yes. Annual billing saves 20% compared to monthly."],
  ["Is there an Enterprise plan?", "For 50+ sites, SSO, SLA guarantees, or custom credit volume, contact sales."],
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
    <article className={`price-card ${plan.highlight ? "featured" : ""}`}>
      {plan.badge ? <div className="price-badge">{plan.badge}</div> : null}
      <p className="plan-name">{plan.name}</p>
      <div className="price-line">
        {price === null ? <strong>Free</strong> : <><strong>${price}</strong><span>/mo</span></>}
      </div>
      {annual && price ? <p className="annual-note">Billed ${price * 12}/year</p> : <p className="annual-note">{plan.note ?? (plan.id === "free_trial" ? "3 days only" : "Cancel anytime")}</p>}
      <div className="plan-divider" />
      <div className="plan-stats">
        <div><span>Credits</span><b>{plan.credits.toLocaleString()}</b></div>
        <div><span>Websites</span><b>{plan.websites}</b></div>
      </div>
      <ul>
        {plan.cardFeatures.map((feature) => <li key={feature}>{feature}</li>)}
      </ul>
      <Link className={plan.highlight ? "card-cta primary" : "card-cta"} href={plan.id === "free_trial" ? "/signup" : `/signup?plan=${plan.id}&billing=${annual ? "annual" : "monthly"}`}>{plan.cta}</Link>
    </article>
  );
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [activeTab, setActiveTab] = useState<"credits" | "nano" | "veo">("credits");

  return (
    <main className="pricing-page">
      <MarketingNav />

      <section className="pricing-hero">
        <p>StoneAI Pricing</p>
        <h1>Build websites.<br /><span>Pay for what you use.</span></h1>
        <h2>One AI platform for generation, editing, image creation, and video. Start with a 3-day free trial.</h2>
        <BillingToggle annual={annual} setAnnual={setAnnual} />
      </section>

      <section className="cards-wrap">
        <div className="cards-grid">{plans.map((plan) => <PricingCard annual={annual} key={plan.id} plan={plan} />)}</div>
        <p className="fineprint">All prices in USD. Credits reset monthly. Cancel anytime.</p>
      </section>

      <section className="matrix-section">
        <div className="section-head"><h2>Compare plans</h2><p>Every feature, every plan - at a glance.</p></div>
        <div className="matrix-wrap">
          <table>
            <thead>
              <tr><th>Feature</th>{plans.map((plan) => <th key={plan.id}>{plan.highlight ? <small>★ Popular</small> : null}{plan.name}</th>)}</tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={feature.name} className={index % 2 === 0 ? "alt" : ""}>
                  <td>{feature.name}{feature.tooltip ? <span title={feature.tooltip}>?</span> : null}</td>
                  {plans.map((plan) => <td key={plan.id}><Mark value={feature.plans[plan.id]} /></td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="usage-section">
        <div className="section-head"><h2>How credits work</h2><p>Credits, Nano Banana, and Veo - explained simply.</p></div>
        <div className="tabs">
          {(["credits", "nano", "veo"] as const).map((tab) => <button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)} type="button">{tab === "credits" ? "Credits" : tab === "nano" ? "Nano Banana" : "Veo 3.1"}</button>)}
        </div>
        {activeTab === "credits" ? (
          <div className="usage-list">
            {[["Generate full website", "40-80", "One-time on generation"], ["AI section edit", "2-5", "Per save"], ["Nano Banana rewrite", "1-3", "Per block"], ["Veo 3.1 video clip", "50-120", "Depends on resolution"], ["AI image generation", "8-15", "Per image"], ["Template customisation", "10-20", "Per site"]].map(([action, credits, note]) => (
              <div key={action}><span><b>{action}</b><em>{note}</em></span><strong>{credits} cr</strong></div>
            ))}
          </div>
        ) : activeTab === "nano" ? (
          <div className="examples-grid">{["Hero headline rewrite", "Product description", "CTA button copy", "About section"].map((item) => <article key={item}><small>{item}</small><p>Before: generic page copy</p><b>After: brand-tuned conversion copy</b></article>)}</div>
        ) : (
          <div className="examples-grid">{["Product hero loop", "Explainer clip", "Brand atmosphere", "Testimonial backdrop"].map((item) => <article key={item}><small>{item}</small><p>Prompt-based video scene</p><b>50-80 credits</b></article>)}</div>
        )}
      </section>

      <section className="faq-pricing">
        <div className="section-head"><h2>Pricing FAQ</h2><p>Everything to know before you start.</p></div>
        <div className="faq-list">{faqs.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
      </section>

      <section className="enterprise-cta">
        <div>
          <p>Enterprise</p>
          <h2>Need 50+ sites or custom credit volume?</h2>
          <span>Dedicated support, SSO, SLA guarantees, team workflows, agency controls, and custom generation limits.</span>
        </div>
        <Link href={`mailto:${STONEAI_CONTACT_EMAIL}`}>Contact sales</Link>
      </section>

      <MarketingFooter />

      <style>{`
        .pricing-page{--bg:#050506;--surface:#0b0b0d;--card:#111116;--line:rgba(255,255,255,.09);--muted:#85858f;--soft:#c5c5cc;min-height:100vh;background:#050506;color:#fff;font-family:Inter,ui-sans-serif,system-ui,sans-serif;background-image:linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px);background-size:64px 64px;overflow-x:hidden}
        .pricing-hero{text-align:center;padding:120px 24px 64px}.pricing-hero p{text-transform:uppercase;letter-spacing:.25em;color:#777985;font-size:12px;font-weight:800}.pricing-hero h1{font-size:clamp(4rem,8vw,7.2rem);letter-spacing:-.075em;line-height:.98;margin:18px 0}.pricing-hero h1 span{color:#8d8d96}.pricing-hero h2{max-width:650px;margin:0 auto 36px;color:#a8a8b0;font-size:18px;line-height:1.7;font-weight:400}.billing-toggle{display:inline-flex;align-items:center;gap:12px;border:1px solid var(--line);background:rgba(255,255,255,.045);border-radius:999px;padding:8px}.billing-toggle button{border:0;background:transparent;color:#777985;font-weight:800;cursor:pointer;padding:8px 12px;border-radius:999px}.billing-toggle button.active{color:#fff}.billing-toggle em{font-size:11px;background:rgba(255,255,255,.08);border:1px solid var(--line);border-radius:999px;padding:3px 7px;font-style:normal}.switch{width:50px!important;height:28px!important;background:#2a2a31!important;padding:3px!important}.switch span{display:block;width:22px;height:22px;border-radius:50%;background:#9696a0;transition:.2s}.switch span.annual{transform:translateX(22px);background:#fff}
        .cards-wrap{max-width:1320px;margin:0 auto;padding:0 24px 90px}.cards-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:16px}.price-card{position:relative;min-height:440px;border:1px solid var(--line);border-radius:26px;background:rgba(18,18,22,.82);padding:26px;display:flex;flex-direction:column;box-shadow:0 24px 90px rgba(0,0,0,.24);transition:.2s}.price-card:hover{transform:translateY(-5px);border-color:rgba(255,255,255,.2)}.price-card.featured{border-color:#fff;background:linear-gradient(180deg,rgba(255,255,255,.12),rgba(255,255,255,.045));box-shadow:0 0 70px rgba(255,255,255,.08)}.price-badge{position:absolute;top:-12px;left:50%;transform:translateX(-50%);white-space:nowrap;background:#fff;color:#050506;border-radius:999px;padding:5px 12px;font-size:11px;font-weight:900}.plan-name{text-transform:uppercase;letter-spacing:.16em;color:#a5a5ad;font-size:12px;font-weight:900}.price-line{margin-top:18px;display:flex;align-items:end;gap:6px}.price-line strong{font-size:42px;letter-spacing:-.06em}.price-line span,.annual-note{color:#777985;font-size:13px}.plan-divider{height:1px;background:var(--line);margin:24px 0}.plan-stats{display:grid;gap:12px}.plan-stats div{display:flex;justify-content:space-between;color:#a7a7af;font-size:14px}.plan-stats b{color:#fff}.price-card ul{list-style:none;padding:0;margin:26px 0;display:grid;gap:11px;color:#d2d2d8;font-size:14px}.price-card li:before{content:"✓";margin-right:8px;color:#fff}.card-cta{margin-top:auto;text-align:center;text-decoration:none;border:1px solid var(--line);border-radius:16px;padding:13px;color:#fff;font-weight:900}.card-cta.primary{background:#fff;color:#050506}.fineprint{text-align:center;color:#666873;font-size:12px;margin-top:22px}
        .section-head{text-align:center;margin-bottom:38px}.section-head h2{font-size:36px;letter-spacing:-.05em;margin:0}.section-head p{color:#777985}.matrix-section,.usage-section,.faq-pricing{max-width:1100px;margin:0 auto;padding:88px 24px}.matrix-wrap{overflow:auto;border:1px solid var(--line);border-radius:26px;background:rgba(255,255,255,.035);-webkit-overflow-scrolling:touch}table{width:100%;border-collapse:collapse;min-width:920px}th,td{padding:17px 18px;border-bottom:1px solid rgba(255,255,255,.06);text-align:center;font-size:13px}th:first-child,td:first-child{text-align:left;color:#d4d4da}th{color:#a6a6ae;font-weight:900}th small{display:block;color:#fff;font-size:10px;margin-bottom:4px}.alt{background:rgba(255,255,255,.025)}td span[title]{margin-left:7px;color:#666;cursor:help}.mark{font-size:18px}.mark.no{color:#444}.matrix-text{color:#dcdce2;font-size:12px;font-weight:800}
        .tabs{display:flex;gap:3px;border:1px solid var(--line);border-radius:18px;background:rgba(255,255,255,.045);padding:5px;margin-bottom:34px}.tabs button{flex:1;border:0;border-radius:13px;background:transparent;color:#888892;font-weight:900;padding:13px;cursor:pointer}.tabs .active{background:#fff;color:#050506}.usage-list{display:grid;gap:12px}.usage-list div,.examples-grid article{border:1px solid var(--line);border-radius:18px;background:rgba(255,255,255,.04);padding:20px}.usage-list div{display:flex;justify-content:space-between;align-items:center}.usage-list b,.usage-list em{display:block}.usage-list em{color:#666873;font-size:12px;font-style:normal;margin-top:5px}.usage-list strong{white-space:nowrap}.examples-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}.examples-grid small{color:#777985;text-transform:uppercase;letter-spacing:.16em}.examples-grid p{color:#777985}.examples-grid b{color:#fff}
        .faq-list{border-top:1px solid var(--line)}.faq-list details{border-bottom:1px solid var(--line);padding:22px 0}.faq-list summary{cursor:pointer;font-weight:900}.faq-list p{color:#9999a2;line-height:1.75}.enterprise-cta{max-width:1100px;margin:0 auto 120px;border:1px solid var(--line);border-radius:32px;background:linear-gradient(135deg,rgba(255,255,255,.1),rgba(255,255,255,.035));padding:44px;display:flex;justify-content:space-between;align-items:center;gap:30px}.enterprise-cta p{text-transform:uppercase;letter-spacing:.2em;color:#888892;font-size:12px}.enterprise-cta h2{font-size:42px;letter-spacing:-.055em;margin:0 0 10px}.enterprise-cta span{color:#a9a9b1;line-height:1.7}.enterprise-cta a{background:#fff;color:#050506;border-radius:999px;padding:14px 20px;text-decoration:none;font-weight:900;white-space:nowrap}
        @media(max-width:1100px){.cards-grid{grid-template-columns:repeat(2,1fr)}.enterprise-cta{flex-direction:column;align-items:flex-start}}@media(max-width:700px){.cards-grid,.examples-grid{grid-template-columns:1fr}.pricing-hero h1{font-size:4rem}.enterprise-cta h2{font-size:32px}.matrix-wrap{-webkit-overflow-scrolling:touch}}@media(max-width:480px){.pricing-hero{padding:104px 16px 48px}.pricing-hero h1{font-size:3rem}.cards-wrap{padding:0 16px 72px}.price-card{min-height:auto;padding:22px}}
      `}</style>
    </main>
  );
}
