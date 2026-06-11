import type { ReactNode } from "react";
import { SiteNav } from "@/components/marketing/SiteNav";
import { SiteFooter } from "@/components/marketing/SiteFooter";

type MarketingShellProps = {
  children: ReactNode;
};

export function MarketingShell({ children }: MarketingShellProps) {
  return (
    <div className="marketing-page">
      <SiteNav />
      <main className="marketing-main">{children}</main>
      <SiteFooter />
      <style>{`
        .marketing-page{--line:rgba(255,255,255,.09);--muted:#85858f;--soft:#c5c5cc;min-height:100vh;background:#050506;color:#fff;font-family:Inter,ui-sans-serif,system-ui,sans-serif;overflow-x:hidden;background-image:linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px);background-size:64px 64px}
        .marketing-main{max-width:880px;margin:0 auto;padding:80px 24px 96px}
        .marketing-main.wide{max-width:1080px}
        .page-eyebrow{color:var(--muted);font-size:12px;letter-spacing:.18em;text-transform:uppercase;margin:0 0 18px}
        .page-hero h1{font-size:clamp(40px,7vw,68px);line-height:1.02;letter-spacing:-.04em;font-weight:600;margin:0 0 18px}
        .page-hero h1 span{color:var(--muted)}
        .page-lede{color:var(--soft);font-size:18px;line-height:1.65;max-width:620px;margin:0}
        .page-section{margin-top:56px}
        .page-section h2{font-size:28px;letter-spacing:-.02em;margin:0 0 14px}
        .page-section h3{font-size:18px;letter-spacing:-.01em;margin:0 0 8px}
        .prose p{color:var(--soft);font-size:15px;line-height:1.8;margin:0 0 16px}
        .prose ul{color:var(--soft);font-size:15px;line-height:1.8;margin:0 0 16px;padding-left:20px}
        .prose li{margin:0 0 8px}
        .prose a{color:#fff;text-decoration:underline;text-underline-offset:3px}
        .card-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:28px}
        .card-grid.two{grid-template-columns:repeat(2,1fr)}
        .info-card{border:1px solid var(--line);border-radius:20px;background:rgba(255,255,255,.03);padding:26px}
        .info-card .icon{font-size:20px;margin-bottom:14px;display:block}
        .info-card h3{font-size:17px;margin:0 0 8px}
        .info-card p{color:var(--muted);font-size:14px;line-height:1.7;margin:0}
        .updated-note{color:var(--muted);font-size:13px;margin:10px 0 0}
        @media(max-width:820px){.card-grid,.card-grid.two{grid-template-columns:1fr}}
      `}</style>
    </div>
  );
}
