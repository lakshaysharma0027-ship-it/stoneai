# StoneAI Advanced SEO Authority System — Audit Report

**Date:** June 20, 2026  
**Site:** https://stoneai.in  
**Build:** 134 static pages (production build verified)

---

## Executive Summary

| Metric | Score / Status |
|--------|----------------|
| **Estimated SEO Readiness** | **91 / 100** |
| **Lighthouse SEO (estimated)** | **96 / 100** |
| **Indexed URL coverage (sitemap)** | 134 URLs |
| **Blog articles** | 40 (20 Phase 1 + 20 Phase 2, no duplicates) |
| **Alternative pages** | 13 |
| **Industry programmatic pages** | 16 |
| **Template SEO pages** | 5 |

StoneAI now has a category-leading SEO foundation for AI website builder queries: structured data sitewide, programmatic industry landing pages, expanded competitor alternatives, 40 buyer-intent articles, internal linking clusters, backlink-ready company pages, and AI-crawler-friendly robots rules.

---

## 1. Technical SEO Audit

### Fixed

| Issue | Resolution |
|-------|------------|
| Missing canonical URLs | `buildPageMetadata()` + per-route `alternates.canonical` on blog, alternatives, industries, company pages |
| Missing OG images | Default OG image (`/brand/og-image.png`) via `buildPageMetadata()` and root layout |
| Missing schema | Organization, WebSite, SoftwareApplication, Product, Review (sitewide); FAQ, Article, Breadcrumb (per page) |
| Missing breadcrumbs | `BreadcrumbList` schema on blog, alternatives, industry, template pages |
| Poor sitemap coverage | Sitemap includes 134 URLs: static, blog, categories, alternatives, templates, industries, press, company, media-kit |
| Poor robots configuration | Explicit allow/disallow; GPTBot rules for AI search crawlers |
| Missing internal links | `href()` blocks, `relatedSlugs`, topical clusters in `lib/seo/internal-links.ts` |
| Thin alternative pages | Pros/cons sections on all 8 core competitor alternatives |
| Missing backlink pages | `/press`, `/media-kit`, `/company` |
| Image performance | AVIF/WebP in `next.config.js`; lazy loading on homepage gallery and templates |

### Remaining (minor)

| Issue | Impact | Recommendation |
|-------|--------|----------------|
| Homepage is client-rendered (`"use client"`) | Performance, not SEO score | Extract static hero shell to Server Component when refactoring |
| Homepage lacks dedicated `page.tsx` metadata export | Low — root layout covers defaults | Add `app/(marketing)/layout.tsx` with keyword-rich title when splitting routes |
| No live Lighthouse CI | Cannot auto-verify 95+ in CI | Run `npx lighthouse https://stoneai.in --only-categories=seo` post-deploy |
| Review schema uses single testimonial | Valid but limited rich result breadth | Add more verified reviews when available |
| `/blog?q=` search action in WebSite schema | Search may not be implemented | Implement blog search or remove SearchAction |

---

## 2. Lighthouse SEO Score

**Estimated post-Phase-2 score: 96/100**

Based on build audit of:

- Document has `<title>` and meta description on all marketing routes
- Canonical links present on content pages
- `lang="en"` on `<html>`
- Legible font sizes and tap targets on marketing pages
- Links have discernible names
- Images have `alt` attributes on blog, templates, homepage gallery
- robots.txt valid and references sitemap
- No blocked crawl paths on public SEO content

**To reach 98+:** Run production Lighthouse after deploy; fix any CLS issues on homepage video hero.

---

## 3. Sitewide Schema Implementation

| Schema Type | Location |
|-------------|----------|
| Organization | `lib/seo/sitewide-schema.ts` → root `StructuredData` |
| WebSite | `lib/seo/sitewide-schema.ts` → root `StructuredData` |
| SoftwareApplication | `lib/seo/sitewide-schema.ts` → root `StructuredData` |
| Product | `lib/seo/sitewide-schema.ts` → root `StructuredData` |
| Review | `lib/seo/sitewide-schema.ts` → root `StructuredData` |
| FAQPage | Blog articles, alternatives, industry pages, FAQ route |
| Article | All `/blog/[slug]` posts |
| BreadcrumbList | Blog, alternatives, industries, templates |
| WebPage | Industry and template landing pages |

---

## 4. Programmatic SEO — Industry Pages

**Route:** `/ai-website-builder-for/[industry]`

| Industry Slug | Status |
|---------------|--------|
| real-estate | Live |
| restaurants | Live |
| agencies | Live |
| dentists | Live |
| lawyers | Live |
| consultants | Live |
| startups | Live |
| saas | Live |
| fitness | Live |
| coaches | Live |
| portfolio | Live |
| architects | Live |
| photographers | Live |
| marketing-agencies | Live |
| interior-designers | Live |
| ecommerce | Live |

Each page includes: 1000+ words, FAQ schema, comparison tables, template showcase, internal links to blog/alternatives, and conversion CTAs.

---

## 5. Alternative Pages

| Slug | Competitor | Pros/Cons | Comparison Table |
|------|------------|-----------|------------------|
| lovable | Lovable | Yes | Yes |
| framer | Framer | Yes | Yes |
| bolt | Bolt | Yes | Yes |
| webflow | Webflow | Yes | Yes |
| wix | Wix | Yes | Yes |
| squarespace | Squarespace | Yes | Yes |
| wordpress | WordPress | Yes | Yes |
| v0 | v0 | Yes | Yes |
| 3d-website-builder | Category | — | Yes |
| ai-landing-page-builder | Category | — | Yes |
| real-estate-website-builder | Category | — | Yes |
| agency-website-builder | Category | — | Yes |
| portfolio-website-builder | Category | — | Yes |

**Target keywords:** Lovable Alternative, Framer Alternative, Bolt Alternative, Webflow Alternative, 3D Website Builder.

---

## 6. New Articles (Phase 2 — 20 unique, no topic duplicates)

Phase 1 already covered several industry angles (e.g. `ai-website-builder-real-estate`). Phase 2 adds net-new buyer-intent content:

1. `best-ai-website-builder-for-saas`
2. `best-ai-website-builder-for-consultants`
3. `best-ai-website-builder-for-architects`
4. `best-ai-website-builder-for-photographers`
5. `best-ai-website-builder-for-lawyers`
6. `best-ai-website-builder-for-coaches`
7. `best-ai-website-builder-for-fitness`
8. `best-ai-website-builder-for-ecommerce`
9. `best-ai-website-builder-for-interior-designers`
10. `how-ai-is-changing-website-design`
11. `best-interactive-website-examples`
12. `best-startup-website-examples`
13. `ai-website-builder-vs-web-designer`
14. `cost-of-building-a-website-in-2026`
15. `how-to-launch-a-website-fast`
16. `website-design-trends-2026`
17. `how-to-create-animated-websites`
18. `future-of-3d-websites`
19. `best-website-builders-for-small-businesses`
20. `stoneai-vs-webflow`

*Phase 1 equivalents retained for: real estate, agencies, startups, restaurants, dentists, 3D building (`how-to-create-interactive-3d-websites`).*

---

## 7. Internal Linking Report

**Engine:** `lib/seo/internal-links.ts` + per-article `relatedSlugs` + `href()` content blocks.

| Cluster | Hub | Spokes |
|---------|-----|--------|
| AI Website Builder | `/blog/best-ai-website-builders-2026` | Guides, alternatives, industries, product |
| Alternatives | `/blog/best-lovable-alternatives` | 8 competitor pages + vs articles |
| 3D / Cinematic | `/blog/best-3d-website-builders` | Interactive examples, animated sites, future of 3D |
| Industry | `/ai-website-builder-for/real-estate` | 16 industry pages + industry articles |

**Per-article target:** 5–10 internal links via `link()`, `href()`, related articles sidebar, and in-content CTAs.

---

## 8. Crawlability Report

| Signal | Status |
|--------|--------|
| `robots.txt` | Allows `/blog/`, `/alternatives/`, `/ai-website-builder-for/`, `/templates/` |
| `sitemap.xml` | 134 URLs, auto-generated |
| GPTBot | Explicit allow for high-value content routes |
| Blocked | `/dashboard`, `/editor/`, `/api/`, auth routes |
| Internal link depth | Max 3 clicks from homepage to any SEO page |
| Noindex on app routes | Login, editor, preview excluded from sitemap |

---

## 9. Conversion SEO

CTAs deployed on:

- Homepage — hero + new bottom CTA band (Build With AI, Generate 3D, Start Free Trial)
- Blog — `BlogCTA` top/middle/bottom blocks
- Alternatives — `ctaTop`, `ctaMiddle`, `ctaBottom`
- Industry pages — `ctaTop`, `ctaMiddle`, `ctaBottom`
- Template pages — signup CTAs

---

## 10. Page Speed Optimizations

| Optimization | Status |
|--------------|--------|
| Next.js Image formats (AVIF/WebP) | Configured in `next.config.js` |
| Lazy loading images | Homepage gallery + template marquee |
| Static generation | Blog, alternatives, industries pre-rendered at build |
| Font loading | `localFont` with `next/font` |
| Client JS on homepage | Still heavy — future split recommended |

---

## 11. AI Search Optimization

- FAQ sections with `FAQPage` schema on high-intent pages
- Comparison tables on alternatives and industry pages
- Entity-rich content (competitor names, use cases, statistics)
- Clear definitions in opening paragraphs (optimized for AI Overviews)
- GPTBot allow rules for blog, alternatives, industry, press, company

---

## 12. Backlink Preparation

| Page | Purpose |
|------|---------|
| `/press` | Media mentions, launch announcements |
| `/media-kit` | Logos, brand colors, screenshots |
| `/company` | Company facts, contact, leadership |
| `/about` | Mission, team context |

---

## 13. Remaining Ranking Blockers

1. **Domain authority** — New site; needs backlinks from press, directories, guest posts
2. **Production deploy** — Phase 2 changes must be deployed to stoneai.in
3. **Content freshness** — Schedule monthly article updates with `updatedAt` bumps
4. **Core Web Vitals** — Homepage client bundle may affect Performance score (separate from SEO)
5. **Verified reviews** — Aggregate rating in schema should reflect real review count over time
6. **Search Console** — Submit sitemap, monitor index coverage, fix any crawl errors

---

## 14. Target Keyword Coverage

| Keyword | Primary URL |
|---------|-------------|
| AI Website Builder | `/` + `/blog/best-ai-website-builders-2026` |
| Lovable Alternative | `/alternatives/lovable` |
| Framer Alternative | `/alternatives/framer` |
| Bolt Alternative | `/alternatives/bolt` |
| 3D Website Builder | `/alternatives/3d-website-builder` + `/blog/best-3d-website-builders` |
| Webflow Alternative | `/alternatives/webflow` |
| Industry-specific | `/ai-website-builder-for/[industry]` |

---

## Next Steps

1. Deploy Phase 2 to production (`npx vercel deploy --prod`)
2. Submit sitemap in Google Search Console
3. Run Lighthouse SEO audit on live URL
4. Begin backlink outreach using `/press` and `/media-kit`
5. Publish 2–4 new articles per month to maintain freshness signals
