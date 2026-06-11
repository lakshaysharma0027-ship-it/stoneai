import Link from "next/link";
import { StoneLogo } from "@/components/brand/StoneLogo";

const STONEAI_CONTACT_EMAIL = "contact@stoneai.in";
const STONEAI_X_URL = "https://x.com/StoneAIusa";

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

type FooterGroup = {
  title: string;
  links: FooterLink[];
};

const groups: FooterGroup[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Templates", href: "/templates" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Documentation", href: "/docs" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
  {
    title: "Social",
    links: [{ label: "X (Twitter)", href: STONEAI_X_URL, external: true }],
  },
];

function FooterAnchor({ link }: { link: FooterLink }) {
  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer">
        {link.label}
      </a>
    );
  }
  return <Link href={link.href}>{link.label}</Link>;
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <StoneLogo size={30} />
          <p>
            AI website generation, image creation, video workflows, publishing,
            domains, and templates for premium teams.
          </p>
          <a className="site-footer-email" href={`mailto:${STONEAI_CONTACT_EMAIL}`}>
            {STONEAI_CONTACT_EMAIL}
          </a>
        </div>
        {groups.map((group) => (
          <div className="site-footer-col" key={group.title}>
            <h4>{group.title}</h4>
            {group.links.map((link) => (
              <FooterAnchor key={link.label} link={link} />
            ))}
          </div>
        ))}
      </div>
      <div className="site-footer-bottom">
        <span>© {new Date().getFullYear()} StoneAI. All rights reserved.</span>
        <div className="site-footer-bottom-links">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
      <style>{`
        .site-footer{padding:70px 0 36px;border-top:1px solid rgba(255,255,255,.08);background:#050506;color:#f7f7f8;font-family:Inter,ui-sans-serif,system-ui,sans-serif}
        .site-footer-inner,.site-footer-bottom{max-width:1180px;margin:0 auto;padding:0 24px}
        .site-footer-inner{display:grid;grid-template-columns:2fr repeat(5,1fr);gap:34px}
        .site-footer p,.site-footer a{color:#85858f;font-size:13px;line-height:1.8;text-decoration:none}
        .site-footer a:hover{color:#fff}
        .site-footer h4{margin:0 0 12px;font-size:14px;color:#f7f7f8}
        .site-footer-col a{display:block}
        .site-footer-brand p{margin-top:14px;max-width:330px}
        .site-footer-email{display:inline-block;margin-top:12px}
        .site-footer-bottom{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:48px;padding-top:24px;border-top:1px solid rgba(255,255,255,.08)}
        .site-footer-bottom span{color:#85858f;font-size:13px}
        .site-footer-bottom-links{display:flex;gap:20px}
        .site-footer-bottom-links a{color:#85858f;font-size:13px;text-decoration:none}
        .site-footer-bottom-links a:hover{color:#fff}
        @media(max-width:900px){.site-footer-inner{grid-template-columns:1fr 1fr;gap:28px}.site-footer-brand{grid-column:1 / -1}.site-footer-bottom{flex-direction:column;align-items:flex-start}}
      `}</style>
    </footer>
  );
}
