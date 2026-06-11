import Link from "next/link";
import { StoneLogo } from "@/components/brand/StoneLogo";
import { STONEAI_COMPANY, STONEAI_CONTACT_EMAIL, STONEAI_X_URL } from "@/lib/site";
import "./marketing.css";

const footerColumns = [
  {
    title: "Product",
    links: [
      { href: "/#features", label: "Features" },
      { href: "/templates", label: "Templates" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/docs", label: "Documentation" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="marketing-footer">
      <div className="marketing-footer-grid">
        <div>
          <StoneLogo size={30} />
          <p style={{ marginTop: 14 }}>
            AI website generation, image creation, video workflows, publishing, domains, and templates for premium teams.
          </p>
          <p style={{ marginTop: 10 }}>
            <a href={STONEAI_X_URL} rel="noopener noreferrer" target="_blank">
              Follow on X
            </a>
          </p>
        </div>
        {footerColumns.map((column) => (
          <div key={column.title}>
            <h4>{column.title}</h4>
            {column.links.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="marketing-footer-bottom">
        <span>© {new Date().getFullYear()} {STONEAI_COMPANY.name}. All rights reserved.</span>
        <span>
          <a href={`mailto:${STONEAI_CONTACT_EMAIL}`}>{STONEAI_CONTACT_EMAIL}</a>
        </span>
        <span>{STONEAI_COMPANY.locations}</span>
      </div>
    </footer>
  );
}
