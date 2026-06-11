"use client";

import Link from "next/link";
import { useState } from "react";
import { StoneLogo } from "@/components/brand/StoneLogo";
import "./marketing.css";

const links = [
  { href: "/#features", label: "Features" },
  { href: "/templates", label: "Templates" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

export function MarketingNav({ priorityLogo = false }: { priorityLogo?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="marketing-nav-wrap">
      <nav className={`marketing-nav ${open ? "open" : ""}`} aria-label="Primary">
        <Link href="/" className="nav-logo" onClick={() => setOpen(false)}>
          <StoneLogo size={30} priority={priorityLogo} />
        </Link>
        <div className="marketing-nav-links">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
        <div className="marketing-nav-cta">
          <Link href="/login" className="marketing-btn marketing-btn-ghost">
            Login
          </Link>
          <Link href="/signup" className="marketing-btn marketing-btn-primary">
            Start Free
          </Link>
        </div>
        <button
          type="button"
          className="marketing-menu-btn"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "✕" : "☰"}
        </button>
        <div className="marketing-mobile-panel">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link href="/login" onClick={() => setOpen(false)}>
            Login
          </Link>
          <Link href="/signup" className="marketing-btn marketing-btn-primary" onClick={() => setOpen(false)}>
            Start Free
          </Link>
        </div>
      </nav>
    </div>
  );
}
