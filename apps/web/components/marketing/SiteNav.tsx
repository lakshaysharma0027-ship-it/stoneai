import Link from "next/link";
import { StoneLogo } from "@/components/brand/StoneLogo";

export function SiteNav() {
  return (
    <nav className="site-nav">
      <Link href="/" className="site-nav-brand">
        <StoneLogo size={32} />
      </Link>
      <div className="site-nav-links">
        <Link href="/#features">Features</Link>
        <Link href="/templates">Templates</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/login">Login</Link>
        <Link href="/signup" className="start">
          Start free
        </Link>
      </div>
      <style>{`
        .site-nav{height:74px;max-width:1240px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:0 24px}
        .site-nav-brand{display:flex;align-items:center;gap:10px;color:#fff;text-decoration:none;font-weight:800}
        .site-nav-links{display:flex;align-items:center;gap:6px}
        .site-nav-links a{color:#cfcfd4;text-decoration:none;font-size:14px;padding:10px 14px}
        .site-nav-links a:hover{color:#fff}
        .site-nav-links .start{background:#fff;color:#050506;border-radius:999px;font-weight:800}
        @media(max-width:700px){.site-nav{height:auto;flex-direction:column;gap:8px;padding-top:18px}.site-nav-links{flex-wrap:wrap;justify-content:center}}
      `}</style>
    </nav>
  );
}
