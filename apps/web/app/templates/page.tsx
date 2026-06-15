"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { TemplateGallery } from "@/components/templates/TemplateGallery";
import { getFeaturedTemplates } from "@/lib/template-catalog";
import { templates } from "./lib/templates";

function buildFeaturedTemplates() {
  const featured = getFeaturedTemplates().map(
    (entry) => templates.find((template) => template.id === entry.id)!,
  );
  const featuredIds = new Set(featured.map((template) => template.id));
  const remainder = templates
    .filter((template) => !featuredIds.has(template.id))
    .sort((a, b) => b.uses - a.uses);

  return [...featured, ...remainder].slice(0, 8);
}

export default function PublicTemplatesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const featuredTemplates = useMemo(() => buildFeaturedTemplates(), []);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 250);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main
      style={{
        background: "#000",
        color: "#fff",
        fontFamily: "system-ui, Inter, sans-serif",
        letterSpacing: "-0.01em",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <MarketingNav />
      <div style={{ margin: "0 auto", maxWidth: 1280 }}>
        <section
          style={{
            margin: "0 auto",
            maxWidth: 560,
            padding: "100px 24px 48px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "#555",
              fontSize: 11,
              letterSpacing: "0.12em",
              margin: "0 0 20px",
              textTransform: "uppercase",
            }}
          >
            Template Gallery
          </p>
          <h1
            style={{
              color: "#fff",
              fontSize: "clamp(2rem, 8vw, 3rem)",
              fontWeight: 500,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              margin: "0 0 16px",
            }}
          >
            Explore StoneAI templates.
          </h1>
          <p
            style={{
              color: "#888",
              fontSize: 15,
              lineHeight: 1.6,
              margin: "0 auto",
              maxWidth: 420,
            }}
          >
            Preview our featured starting points before you create an account.
          </p>
        </section>

        <section style={{ margin: "0 24px 48px" }}>
          <TemplateGallery
            templates={featuredTemplates}
            mode="public"
            isLoading={isLoading}
          />
        </section>

        <section
          style={{
            borderTop: "0.5px solid #1a1a1a",
            margin: "0 24px",
            padding: "64px 24px 80px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(1.5rem, 5vw, 2rem)",
              fontWeight: 500,
              letterSpacing: "-0.03em",
              margin: "0 0 12px",
            }}
          >
            Want access to all templates?
          </h2>
          <p style={{ color: "#888", fontSize: 15, margin: "0 auto 28px", maxWidth: 420 }}>
            Create a free account to unlock the full template library, AI generation, and publishing.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <Link
              href="/signup"
              style={{
                background: "#fff",
                borderRadius: 8,
                color: "#000",
                fontSize: 14,
                fontWeight: 500,
                padding: "12px 28px",
                textDecoration: "none",
              }}
            >
              Sign Up
            </Link>
            <Link
              href="/login"
              style={{
                border: "0.5px solid #333",
                borderRadius: 8,
                color: "#fafafa",
                fontSize: 14,
                padding: "12px 28px",
                textDecoration: "none",
              }}
            >
              Login
            </Link>
          </div>
        </section>
      </div>
      <MarketingFooter />
    </main>
  );
}
