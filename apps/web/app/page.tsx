"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import {
  getFeaturedTemplates,
  nanoBananaGallery,
  templateCatalog,
  veoShowcaseItems,
} from "@/lib/template-catalog";
import { STONEAI_COMPANY } from "@/lib/site";

const promptExamples = [
  "A SaaS landing page for a project management tool...",
  "A luxury e-commerce store for handcrafted jewelry...",
  "A modern portfolio for a UX designer...",
  "A cinematic AI agency website with pricing and FAQ...",
];

const features = [
  ["✦", "AI Generation", "Describe your website in natural language. StoneAI builds a complete, unique site - not a template fill-in."],
  ["⌘", "Visual Editor", "Click anything to edit. Drag to reorder. Every element is yours to control without touching code."],
  ["⚡", "Instant Publish", "One click to publish. Your site goes live on a global edge network in under a second."],
  ["◎", "Custom Domains", "Connect any domain with HTTPS, SSL, and DNS configuration handled from the dashboard."],
  ["◐", "AI Image Gen", "Generate unique, on-brand images for any section with Nano Banana workflows."],
  ["▶", "AI Video", "Create hero loops, product demos, and background videos with Veo generation."],
];

const featuredTemplates = getFeaturedTemplates();
const homepageTemplates =
  featuredTemplates.length > 0 ? featuredTemplates : templateCatalog.slice(0, 6);

const testimonials = [
  ["StoneAI feels like having a product designer, copywriter, and deployment engineer in the same prompt box.", "Maya Chen", "Founder, Northstar"],
  ["The generation flow is fast enough for client calls. We describe the offer and show a credible site minutes later.", "Arjun Mehta", "Agency Partner"],
  ["It has the polish we expect from enterprise SaaS, but the workflow is simple enough for every marketer on the team.", "Elena Park", "Growth Lead"],
];

const faqs = [
  ["Can I publish a real website?", "Yes. StoneAI creates editable websites that can be published, hosted, and connected to custom domains."],
  ["Is this only templates?", "No. Templates are starting points. AI generation, editing, images, and video adapt the site to the prompt and brand."],
  ["Does pricing live before signup?", "Yes. The public pricing page is available from the homepage navigation and footer."],
  ["What do credits power?", "Credits power website generation, AI edits, Nano Banana image/copy workflows, and Veo video generation."],
];

function BrowserShowcase() {
  return (
    <div className="gen-demo reveal-card">
      <div className="gen-demo-top">
        <div className="gen-demo-dots"><span /><span /><span /></div>
        <div className="gen-demo-url">stoneai.in/generate/horizon</div>
        <div className="gen-demo-status">Building</div>
      </div>
      <div className="gen-demo-body">
        <div className="gen-panel">
          <div className="gen-block">
            <div className="gen-panel-title">Prompt</div>
            <div className="gen-input">&ldquo;A B2B SaaS landing page for a project management tool called Horizon. Dark theme, modern, enterprise feel.&rdquo;</div>
          </div>
          <div className="gen-block">
            <div className="gen-panel-title">Generation steps</div>
            <div className="gen-progress">
              {["Parsing intent", "Selecting layout", "Writing copy", "Generating visuals", "Applying styles", "Optimizing for speed", "Ready to publish"].map((step, index) => (
                <div key={step} className={`gen-step ${index < 3 ? "done" : index === 3 ? "active" : ""}`}>
                  <span>{index < 3 ? "✓" : index === 3 ? "◐" : "○"}</span>
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="gen-preview">
          <div className="gen-preview-bar">
            <span className="active">Preview</span>
            <span>Code</span>
            <span>Assets</span>
          </div>
          <div className="gen-mockup">
            <div className="gen-mock-nav"><span /><i /><i /><i /><b /></div>
            <div className="gen-mock-hero"><strong /><strong className="sm" /><em /></div>
            <div className="gen-mock-cards"><span /><span /><span /></div>
            <div className="gen-beam" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ tag }: { tag: string }) {
  return (
    <div className="section-label">
      <span>{tag}</span>
      <i />
    </div>
  );
}

export default function HomePage() {
  const [promptIndex, setPromptIndex] = useState(0);
  const activePrompt = useMemo(() => promptExamples[promptIndex], [promptIndex]);

  useEffect(() => {
    const id = window.setInterval(() => setPromptIndex((value) => (value + 1) % promptExamples.length), 2600);
    return () => window.clearInterval(id);
  }, []);

  return (
    <main className="stone-home">
      <MarketingNav priorityLogo />

      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-glow one" />
        <div className="hero-glow two" />
        <div className="float-stack" aria-hidden="true">
          <span>Published in 0.8s</span>
          <span>Custom domain connected</span>
          <span>AI generated 47 pages</span>
          <span>Editing visually</span>
        </div>
        <div className="hero-content">
          <div className="hero-badge"><span /> Introducing AI Video with Veo 3.1</div>
          <h1>Describe it.<br /><span>Watch it build.</span></h1>
          <p>StoneAI generates premium websites, image assets, video sections, publishing flows, and custom-domain-ready experiences from a single prompt.</p>
          <div className="hero-prompt">
            <div className="typing-line">{activePrompt}<span className="cursor">|</span></div>
            <Link href="/signup" className="btn btn-primary">Generate</Link>
          </div>
          <div className="prompt-hints">
            Try:
            {promptExamples.slice(1).map((example, index) => (
              <button key={example} onClick={() => setPromptIndex(index + 1)} type="button">{example.replace("A ", "").replace("...", "")}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="trust">
        <div className="trust-inner">
          {[["Minutes", "Idea to live site"], ["AI-native", "Websites + media"], ["Publish", "Domains + analytics"], ["Global", "Edge-ready hosting"]].map(([value, label]) => (
            <div key={label}><strong>{value}</strong><span>{label}</span></div>
          ))}
          <p>{STONEAI_COMPANY.locations}</p>
        </div>
      </section>

      <section className="section ai-gen">
        <div className="container">
          <SectionLabel tag="AI Generation" />
          <div className="split-head">
            <h2>Describe it.<br /><span>Watch it build.</span></h2>
            <p>StoneAI transforms a short brief into a full production-grade website: layout, copy, visual direction, assets, sections, and deploy-ready structure.</p>
          </div>
          <BrowserShowcase />
        </div>
      </section>

      <section id="features" className="section features-section">
        <div className="container features-grid">
          {features.map(([icon, title, desc]) => (
            <article className="feature-cell" key={title}>
              <div className="feature-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="templates" className="section templates-section">
        <div className="container template-head">
          <div>
            <SectionLabel tag="Templates" />
            <h2>Start from premium<br /><span>StoneAI templates.</span></h2>
            <p>Production-ready starting points for portfolios, SaaS, dining, and immersive experiences. Customize anything with AI or the visual editor.</p>
          </div>
          <Link href="/templates" className="btn btn-ghost">Browse all</Link>
        </div>
        <div className="templates-marquee">
          <div className="templates-track">
            {[...homepageTemplates, ...homepageTemplates].map((template, index) => (
              <Link href="/templates" className="template-card" key={`${template.id}-${index}`}>
                <div className="template-thumb" style={{ background: template.bgColor, padding: 0 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={template.previewImage}
                    alt={`${template.name} preview`}
                    className="template-preview-img"
                  />
                </div>
                <div><strong>{template.name}</strong><span>{template.category}</span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section media-section">
        <div className="container media-grid">
          <div>
            <SectionLabel tag="Nano Banana" />
            <h2>Generate image systems that match the page.</h2>
            <p>Prompt product imagery, section visuals, campaign scenes, and editorial assets inside the same generation workspace.</p>
            <div className="mini-prompt">Minimal monochrome product render, soft edge light, enterprise SaaS hero image</div>
          </div>
          <div className="image-board">
            {nanoBananaGallery.map((image) => (
              <figure className="gallery-item" key={image.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.src} alt={image.alt} loading="lazy" />
                <figcaption>{image.prompt}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section video-section">
        <div className="container video-grid">
          <div className="video-preview">
            {veoShowcaseItems[0]?.videoSrc ? (
              <video
                src={veoShowcaseItems[0].videoSrc}
                poster={veoShowcaseItems[0].posterSrc}
                autoPlay
                muted
                loop
                playsInline
                aria-label="Veo generated hero loop preview"
              />
            ) : (
              <>
                <div className="play-button">▶</div>
                <div className="video-placeholder-label">Veo preview coming soon</div>
                <div className="video-lines">
                  {veoShowcaseItems.map((item) => (
                    <span key={item.id} title={item.title} />
                  ))}
                </div>
              </>
            )}
          </div>
          <div>
            <SectionLabel tag="Veo Video" />
            <h2>Hero loops and product demos from text.</h2>
            <p>Generate launch videos, explainers, atmospheric sections, and product storytelling clips with Veo workflows built into StoneAI.</p>
            <ul className="veo-ready-list">
              {veoShowcaseItems.map((item) => (
                <li key={item.id}>
                  <strong>{item.title}</strong>
                  <span>{item.description}</span>
                  {item.placeholder ? <em>Placeholder ready</em> : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section publishing-section">
        <div className="container">
          <SectionLabel tag="Publishing" />
          <div className="publish-grid">
            {["Custom domains", "Global hosting", "One-click deploy", "Production-ready workflow"].map((item) => (
              <article key={item}><span>✓</span><h3>{item}</h3><p>Professional deployment infrastructure built for real business websites.</p></article>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="section pricing-preview">
        <div className="container pricing-band">
          <div>
            <SectionLabel tag="Pricing" />
            <h2>Start free. Scale with credits.</h2>
            <p>Explore public pricing before signup. Upgrade when your website, image, video, and publishing needs grow.</p>
          </div>
          <Link href="/pricing" className="btn btn-primary">View pricing</Link>
        </div>
      </section>

      <section className="section testimonials">
        <div className="container">
          <SectionLabel tag="Customers" />
          <div className="testimonial-grid">
            {testimonials.map(([quote, name, role]) => (
              <figure key={name}>
                <div>★★★★★</div>
                <blockquote>{quote}</blockquote>
                <figcaption><b>{name}</b><span>{role}</span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="section faq-section">
        <div className="container faq-grid">
          <div><SectionLabel tag="FAQ" /><h2>Questions before you build.</h2></div>
          <div>{faqs.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
        </div>
      </section>

      <MarketingFooter />

      <style>{`
        .stone-home{--bg:#050506;--surface:#0b0b0d;--card:#101014;--card2:#16161a;--line:rgba(255,255,255,.08);--muted:#85858f;--soft:#b8b8c0;--glow:rgba(125,160,255,.15);min-height:100vh;background:var(--bg);color:#f7f7f8;font-family:Inter,ui-sans-serif,system-ui,sans-serif;overflow-x:hidden}
        .container{max-width:1180px;margin:0 auto;padding:0 24px}.stone-brand-logo,.nav-logo{display:flex;align-items:center;gap:10px;color:#fff;text-decoration:none;font-weight:700;letter-spacing:-.02em}.stone-brand-logo-image{border-radius:9px;object-fit:cover;flex-shrink:0}.stone-brand-wordmark{font-weight:700}.btn{display:inline-flex;align-items:center;justify-content:center;border-radius:999px;padding:11px 18px;font-size:13px;font-weight:700;text-decoration:none;border:1px solid var(--line);transition:.2s}.btn-primary{background:#fff;color:#050506;border-color:#fff;box-shadow:0 0 34px rgba(255,255,255,.12)}.btn-primary:hover{transform:translateY(-1px);background:#ececef}.btn-ghost{color:#fff;background:rgba(255,255,255,.04)}.btn-ghost:hover{background:rgba(255,255,255,.08)}
        .hero{position:relative;min-height:930px;padding:190px 24px 90px;display:flex;align-items:flex-start;justify-content:center;text-align:center}.hero-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:72px 72px;mask-image:radial-gradient(circle at center,black,transparent 72%)}.hero-glow{position:absolute;border-radius:999px;filter:blur(64px);opacity:.75}.hero-glow.one{top:120px;width:520px;height:520px;background:var(--glow)}.hero-glow.two{right:-130px;top:300px;width:380px;height:380px;background:rgba(255,255,255,.08)}.float-stack{position:absolute;inset:150px 32px auto;pointer-events:none}.float-stack span{position:absolute;border:1px solid var(--line);background:rgba(255,255,255,.04);backdrop-filter:blur(16px);border-radius:999px;padding:9px 14px;font-size:12px;color:var(--soft);box-shadow:0 16px 50px rgba(0,0,0,.24)}.float-stack span:nth-child(1){left:7%;top:70px}.float-stack span:nth-child(2){right:8%;top:30px}.float-stack span:nth-child(3){left:14%;top:390px}.float-stack span:nth-child(4){right:15%;top:420px}.hero-content{position:relative;max-width:980px}.hero-badge{display:inline-flex;align-items:center;gap:9px;border:1px solid var(--line);border-radius:999px;background:rgba(255,255,255,.045);padding:8px 14px;color:#d7d7dc;font-size:12px;font-weight:700}.hero-badge span{width:7px;height:7px;border-radius:50%;background:#fff;box-shadow:0 0 16px rgba(255,255,255,.8)}.hero h1{margin:28px 0 0;font-size:clamp(4rem,10vw,8.2rem);line-height:.93;letter-spacing:-.08em;font-weight:850}.hero h1 span,.split-head span,.template-head h2 span{background:linear-gradient(135deg,#fff 30%,#9da8bd 100%);-webkit-background-clip:text;color:transparent}.hero p{max-width:690px;margin:28px auto 0;color:var(--soft);font-size:19px;line-height:1.75}.hero-prompt{margin:42px auto 0;max-width:760px;display:flex;gap:12px;align-items:center;border:1px solid var(--line);border-radius:26px;background:rgba(255,255,255,.055);box-shadow:0 24px 90px rgba(0,0,0,.36),inset 0 1px 0 rgba(255,255,255,.06);padding:12px}.typing-line{flex:1;text-align:left;color:#f2f2f3;padding:0 16px;font-size:15px}.cursor{animation:blink 1s infinite}.prompt-hints{margin-top:16px;color:#6f6f78;font-size:13px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap}.prompt-hints button{color:#b8b8c0;background:transparent;border:0;cursor:pointer}.prompt-hints button:hover{color:#fff}@keyframes blink{50%{opacity:0}}
        .trust{padding:0 24px 80px}.trust-inner{max-width:1100px;margin:0 auto;border:1px solid var(--line);border-radius:22px;background:rgba(255,255,255,.035);display:grid;grid-template-columns:repeat(5,1fr);align-items:center;overflow:hidden}.trust-inner div{padding:24px;text-align:center;border-right:1px solid var(--line)}.trust-inner strong{display:block;font-size:26px;letter-spacing:-.04em}.trust-inner span,.trust-inner p{color:var(--muted);font-size:12px}.trust-inner p{padding:24px;line-height:1.9}
        .section{padding:118px 0}.section-label{display:flex;align-items:center;gap:14px;margin-bottom:28px}.section-label span{font-size:11px;text-transform:uppercase;letter-spacing:.22em;color:#d7d7dc;font-weight:800}.section-label i{height:1px;flex:1;background:linear-gradient(90deg,var(--line),transparent)}.split-head,.template-head,.media-grid,.video-grid,.faq-grid{display:grid;grid-template-columns:1fr 1fr;gap:58px;align-items:center}.split-head h2,.template-head h2,.media-grid h2,.video-grid h2,.pricing-band h2,.faq-grid h2{font-size:clamp(2.5rem,5vw,4.8rem);line-height:1.02;letter-spacing:-.06em;margin:0}.split-head p,.template-head p,.media-grid p,.video-grid p,.pricing-band p{color:var(--soft);font-size:17px;line-height:1.8}
        .gen-demo{margin-top:54px;border:1px solid var(--line);border-radius:28px;background:linear-gradient(180deg,rgba(255,255,255,.075),rgba(255,255,255,.025));box-shadow:0 40px 120px rgba(0,0,0,.38);overflow:hidden}.gen-demo-top{height:54px;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:18px;padding:0 20px}.gen-demo-dots{display:flex;gap:8px}.gen-demo-dots span{width:10px;height:10px;border-radius:50%;background:#33343a}.gen-demo-url{flex:1;background:rgba(255,255,255,.05);border:1px solid var(--line);border-radius:999px;padding:8px 14px;color:#8b8b94;font-size:12px}.gen-demo-status{font-size:12px;color:#fff}.gen-demo-body{display:grid;grid-template-columns:360px 1fr}.gen-panel{border-right:1px solid var(--line);padding:22px}.gen-block{border:1px solid var(--line);border-radius:18px;background:rgba(0,0,0,.18);padding:18px;margin-bottom:16px}.gen-panel-title{text-transform:uppercase;letter-spacing:.18em;font-size:10px;color:#777985;margin-bottom:12px}.gen-input{font-size:13px;line-height:1.7;color:#d8d8de}.gen-progress{display:grid;gap:10px}.gen-step{display:flex;gap:10px;color:#6f7078;font-size:13px}.gen-step.done{color:#fff}.gen-step.active{color:#d9dfe9}.gen-step.active span{animation:pulse 1.2s infinite}.gen-preview{padding:18px}.gen-preview-bar{display:flex;gap:4px;margin-bottom:12px}.gen-preview-bar span{padding:7px 13px;border-radius:999px;color:#777985;font-size:12px}.gen-preview-bar .active{background:#fff;color:#050506}.gen-mockup{position:relative;min-height:390px;border:1px solid var(--line);border-radius:20px;background:#060607;overflow:hidden;padding:28px}.gen-mock-nav{display:flex;gap:12px;align-items:center}.gen-mock-nav span{width:32px;height:32px;border-radius:10px;background:#fff}.gen-mock-nav i{width:70px;height:8px;border-radius:9px;background:#25262b}.gen-mock-nav b{margin-left:auto;width:96px;height:30px;border-radius:999px;background:linear-gradient(90deg,#fff,#9aa4b8)}.gen-mock-hero{margin-top:70px}.gen-mock-hero strong{display:block;width:58%;height:34px;border-radius:10px;background:#f5f5f6;margin-bottom:12px}.gen-mock-hero .sm{width:42%;opacity:.6}.gen-mock-hero em{display:block;width:128px;height:38px;border-radius:999px;background:#fff;margin-top:24px}.gen-mock-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:56px}.gen-mock-cards span{height:94px;border:1px solid var(--line);border-radius:16px;background:rgba(255,255,255,.055)}.gen-beam{position:absolute;inset:auto -20% 0;height:180px;background:radial-gradient(ellipse at center,rgba(160,180,255,.18),transparent 62%);animation:beam 3s infinite}
        .features-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line);border:1px solid var(--line);border-radius:28px;overflow:hidden}.feature-cell{background:#080809;padding:34px;min-height:245px;transition:.22s}.feature-cell:hover{background:#101114;transform:translateY(-2px)}.feature-icon{width:42px;height:42px;border:1px solid var(--line);border-radius:13px;display:grid;place-items:center;margin-bottom:28px;background:rgba(255,255,255,.04)}.feature-cell h3{font-size:20px;margin:0 0 10px}.feature-cell p{color:var(--muted);font-size:14px;line-height:1.7}
        .templates-section{overflow:hidden}.template-head{align-items:end}.templates-marquee{margin-top:54px;overflow:hidden}.templates-track{display:flex;gap:18px;width:max-content;animation:scroll 28s linear infinite}.template-card{width:320px;border:1px solid var(--line);border-radius:22px;background:rgba(255,255,255,.04);padding:12px;transition:.2s;text-decoration:none;color:inherit}.template-card:hover{transform:translateY(-6px);background:rgba(255,255,255,.07)}.template-thumb{height:214px;border-radius:16px;overflow:hidden;position:relative}.template-preview-img{width:100%;height:100%;object-fit:cover;display:block}.template-card strong{display:block;margin:15px 4px 2px}.template-card span{color:var(--muted);font-size:13px;margin-left:4px}
        .media-section,.publishing-section{background:#080809}.mini-prompt{margin-top:28px;border:1px solid var(--line);border-radius:18px;background:#050506;padding:18px;color:#d8d8dd}.image-board{display:grid;grid-template-columns:1fr 1fr;gap:14px}.gallery-item{margin:0;border:1px solid var(--line);border-radius:24px;overflow:hidden;background:#050506;position:relative}.gallery-item img{width:100%;height:210px;object-fit:cover;display:block}.gallery-item figcaption{position:absolute;left:0;right:0;bottom:0;padding:14px 16px;font-size:11px;line-height:1.5;color:#d8d8dd;background:linear-gradient(180deg,transparent,rgba(5,5,6,.92))}.gallery-item:nth-child(2),.gallery-item:nth-child(3){transform:translateY(34px)}
        .video-preview{height:420px;border:1px solid var(--line);border-radius:28px;background:radial-gradient(circle at 45% 35%,rgba(160,180,255,.22),transparent 32%),#060607;position:relative;overflow:hidden;box-shadow:0 36px 110px rgba(0,0,0,.35)}.video-preview video{width:100%;height:100%;object-fit:cover}.play-button{position:absolute;inset:0;margin:auto;width:82px;height:82px;border-radius:50%;display:grid;place-items:center;background:#fff;color:#050506;box-shadow:0 0 60px rgba(255,255,255,.18);z-index:2}.video-placeholder-label{position:absolute;left:26px;top:26px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#9da4b5;z-index:2}.video-lines{position:absolute;left:26px;right:26px;bottom:26px;display:grid;gap:10px;z-index:2}.video-lines span{height:9px;border-radius:9px;background:rgba(255,255,255,.12)}.veo-ready-list{list-style:none;margin:28px 0 0;padding:0;display:grid;gap:14px}.veo-ready-list li{border:1px solid var(--line);border-radius:16px;padding:14px 16px;background:rgba(255,255,255,.03)}.veo-ready-list strong{display:block;font-size:14px;margin-bottom:4px}.veo-ready-list span{display:block;color:var(--muted);font-size:13px;line-height:1.6}.veo-ready-list em{display:inline-block;margin-top:8px;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#7f8798;font-style:normal}
        .pricing-band{border:1px solid var(--line);border-radius:30px;background:linear-gradient(135deg,rgba(255,255,255,.08),rgba(255,255,255,.025));padding:48px;display:flex;align-items:center;justify-content:space-between;gap:28px}.publish-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.publish-grid article{border:1px solid var(--line);border-radius:20px;background:rgba(255,255,255,.035);padding:24px}.publish-grid span{color:#fff}.publish-grid p{color:var(--muted);font-size:13px;line-height:1.6}.testimonial-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.testimonial-grid figure{margin:0;border:1px solid var(--line);border-radius:24px;background:rgba(255,255,255,.04);padding:28px;min-height:290px}.testimonial-grid div{color:#fff;font-size:12px;letter-spacing:.18em}.testimonial-grid blockquote{margin:28px 0;color:#e7e7eb;font-size:18px;line-height:1.65}.testimonial-grid figcaption{display:flex;flex-direction:column;gap:4px}.testimonial-grid span{color:var(--muted);font-size:13px}        .faq-grid{align-items:start}.faq-grid details{border-bottom:1px solid var(--line);padding:22px 0}.faq-grid summary{cursor:pointer;font-weight:800}.faq-grid p{color:var(--muted);line-height:1.7}.reveal-card{animation:rise .8s ease both}
        @keyframes scroll{to{transform:translateX(-50%)}}@keyframes rise{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}@keyframes pulse{50%{opacity:.35}}@keyframes beam{50%{transform:translateX(20%);opacity:.55}}
        @media(max-width:900px){.hero{min-height:auto;padding-top:140px}.float-stack{display:none}.hero-prompt{flex-direction:column;align-items:stretch}.trust-inner,.split-head,.template-head,.media-grid,.video-grid,.faq-grid{grid-template-columns:1fr}.trust-inner{grid-template-columns:1fr 1fr}.features-grid,.publish-grid,.testimonial-grid{grid-template-columns:1fr}.gen-demo-body{grid-template-columns:1fr}.gen-panel{border-right:0;border-bottom:1px solid var(--line)}.pricing-band{flex-direction:column;align-items:flex-start}.hero h1{font-size:4rem}.typing-line{font-size:14px}.gallery-item,.gallery-item:nth-child(2),.gallery-item:nth-child(3){transform:none}}
        @media(max-width:480px){.trust-inner{grid-template-columns:1fr}.hero h1{font-size:3rem}.hero p{font-size:16px}.publish-grid article,.feature-cell{padding:20px}.container{padding:0 16px}.hero{padding-left:16px;padding-right:16px}}
        @media(max-width:375px){.hero h1{font-size:2.5rem}.hero-prompt{margin-left:0;margin-right:0}}
      `}</style>
    </main>
  );
}
