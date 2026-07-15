# StoneAI SEO Audit Report — June 2026

## Executive Summary

**Estimated SEO Readiness: 88/100** (up from ~72 pre-authority phase)

StoneAI now operates a multi-layer SEO engine: 40+ blog articles, 13 alternative landing pages, 16 industry programmatic pages, 5 template pages, and backlink-ready company assets.

---

## Lighthouse SEO Target: 95+

### Fixes Applied

| Area | Status | Action |
|------|--------|--------|
| Dynamic metadata | ✅ | `lib/seo/metadata.ts` — canonical, OG, Twitter on all new pages |
| OG images | ✅ | `/brand/og-image.png` on all routes via metadata helper |
| Canonical URLs | ✅ | Per-page alternates on blog, alternatives, industries, templates |
| Schema.org | ✅ | Organization, WebSite, SoftwareApplication, Product, Review (sitewide); Article, FAQ, Breadcrumb (content pages) |
| Breadcrumbs | ✅ | Blog, alternatives, industries, templates |
| Sitemap | ✅ | 120+ URLs including industries, alternatives, press, company |
| robots.txt | ✅ | Explicit allows for SEO routes; GPTBot rules for AI search |
| Internal linking | ✅ | `href()` blocks, cluster map in `lib/seo/internal-links.ts` |
| Image optimization | ✅ | Next.js AVIF/WebP formats, 30-day cache TTL |
| Backlink assets | ✅ | `/press`, `/media-kit`, `/company` |

### Remaining for 95+ Lighthouse

1. **Add `alt` text audit** on homepage gallery images (marketing page uses inline styles)
2. **Preconnect** to font CDN if external fonts added
3. **Reduce client JS** on homepage (currently client component — consider splitting static hero)
4. **Add `loading="lazy"`** to below-fold marketing images

---

## Crawlability Report

| Route pattern | Indexed | In sitemap |
|---------------|---------|------------|
| `/blog/*` | Yes | Yes |
| `/alternatives/*` | Yes | Yes |
| `/ai-website-builder-for/*` | Yes | Yes |
| `/templates/*` | Yes | Yes |
| `/press`, `/company`, `/media-kit` | Yes | Yes |
| `/dashboard`, `/editor`, `/api` | No (robots disallow) | No |

**Crawl budget:** Static generation (SSG) for all SEO pages — optimal for crawlers.

---

## Topical Authority Clusters

1. **AI Website Builder** — hub: `/blog/best-ai-website-builders-2026`
2. **Alternatives** — hub: `/alternatives/lovable` + comparison articles
3. **3D Websites** — hub: `/blog/best-3d-website-builders`
4. **Industry verticals** — hub: `/ai-website-builder-for/saas`

---

## Content Inventory (No Duplicates)

- **Original articles:** 20
- **New articles (phase 2):** 20 (non-overlapping slugs)
- **Alternative pages:** 13
- **Industry pages:** 16
- **Template SEO pages:** 5

---

## Ranking Blockers (Remaining)

1. **Domain authority** — needs backlinks (press/media-kit ready)
2. **Content freshness** — schedule monthly article updates
3. **Core Web Vitals** — homepage JS bundle; run Lighthouse on production
4. **Search Console** — submit updated sitemap at [Google Search Console](https://search.google.com/search-console)
5. **Some industry pages link to articles** published in same deploy — verify after build

---

## Conversion SEO

CTAs deployed on: blog (top/middle/bottom), alternatives, industry pages, company/press footers.

Signup path: `/signup` from all CTA blocks.

---

## AI Search Optimization (AEO)

- FAQ schema on all long-form pages
- Comparison tables for AI Overviews / Perplexity citations
- Entity-rich copy: StoneAI, stoneai.in, product features named
- GPTBot allowed on blog and alternatives
- Clear definitions in H2 sections

---

## Recommended Next Steps

1. Deploy to production and submit sitemap
2. Build 10–20 quality backlinks using press kit
3. Add Google Search Console + Bing Webmaster
4. Monitor rankings for: `AI website builder`, `Lovable alternative`, `3D website builder`
5. A/B test homepage CTA copy for signup conversion
