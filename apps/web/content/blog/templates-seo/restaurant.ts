import type { TemplateSeoPage } from "@/lib/blog/types";
import {
  h2,
  h3,
  p,
  ul,
  ol,
  ctaTop,
  ctaMiddle,
  ctaBottom,
  link,
} from "../blocks";

export const restaurantTemplate: TemplateSeoPage = {
  slug: "restaurant",
  name: "Restaurant",
  seoTitle: "AI Restaurant Website Template — Menu, Reservations & Local SEO | StoneAI",
  metaDescription:
    "Launch a beautiful restaurant website with StoneAI. Menu layouts, reservation CTAs, hours and location, gallery sections, and local SEO—built for cafes, bistros, and fine dining.",
  title: "Restaurant Website Template for Menus, Reservations, and Hungry Local Searchers",
  subtitle:
    "Give guests a mouth-watering site with hours, location, online ordering links, and gallery sections—live before your next weekend service.",
  previewGradient:
    "linear-gradient(135deg, #292524 0%, #b45309 50%, #fbbf24 100%)",
  features: [
    {
      title: "Menu presentation",
      description:
        "Categorized menu layouts for appetizers, mains, drinks, and specials—readable on mobile between commute scrolling.",
    },
    {
      title: "Reservations and ordering CTAs",
      description:
        "Prominent buttons for OpenTable, Resy, phone orders, and delivery partners without burying them in footer links.",
    },
    {
      title: "Hours, location, and maps",
      description:
        "Structured contact blocks with address, parking notes, holiday hours, and embedded map placeholders.",
    },
    {
      title: "Photo gallery and atmosphere",
      description:
        "Visual sections that sell ambiance—interior, plates, bar, patio—because guests eat with their eyes first online.",
    },
  ],
  useCases: [
    "Fine dining restaurants",
    "Casual cafes and bistros",
    "Fast-casual and takeaway spots",
    "Bars and cocktail lounges",
    "Food trucks with permanent locations",
    "Multi-location restaurant groups",
  ],
  faq: [
    {
      question: "Can StoneAI build a website for my restaurant?",
      answer:
        "Yes. Describe your cuisine, atmosphere, location, and services—dine-in, takeaway, catering—and StoneAI generates a restaurant site with menu sections, gallery, about story, hours, and contact pages. Edit dishes and photos in the visual editor, then publish to your domain.",
    },
    {
      question: "Does the template support online menu updates?",
      answer:
        "Menu sections are fully editable in StoneAI without code. Update seasonal dishes, prices, and specials in minutes. Link out to Toast, Square, or delivery apps for online ordering when you are ready.",
    },
    {
      question: "How important is a restaurant website in 2026?",
      answer:
        "Guests still check Google, Instagram, and your website before visiting. Hours, menu, dietary info, and reservation links need one reliable home—not scattered link-in-bio pages. A proper site improves local SEO and converts discovery into booked tables.",
    },
    {
      question: "Can multi-location restaurant groups use one template?",
      answer:
        "Yes. Generate a parent site with location index pages, shared brand story, and per-location hours, menus, and reservation links. Duplicate location templates as you expand.",
    },
  ],
  relatedArticleSlugs: [
    "best-landing-page-builders",
    "ai-website-builder-agencies",
    "ai-website-builder-pricing-guide",
    "stoneai-vs-framer",
  ],
  content: [
    ctaTop(),
    p(
      "Guests decide where to eat before they leave the house. They check the menu on their phone, confirm hours, look at photos of the dining room, and tap reserve—or they bounce to the next result on Google Maps. If your restaurant still relies on a PDF menu, a Facebook page, or a third-party profile alone, you are handing discovery and first impressions to platforms that do not prioritize your brand.",
    ),
    p(
      "StoneAI's restaurant website template gives owners and operators a beautiful, mobile-first site in minutes. Describe your cuisine, vibe, neighborhood, and service model—fine dining reservations, neighborhood brunch spot, late-night tacos—and get pages for menu, gallery, about, events, catering, and contact with conversion paths wired for hospitality.",
    ),
    p(
      "This guide covers what the template includes, how different restaurant types adapt it, and practical steps to launch before your next busy season.",
    ),
    h2("why-restaurants-need-sites", "Why a Dedicated Restaurant Website Still Wins"),
    p(
      "Delivery apps and review sites are distribution, not identity. They take margin, control how photos appear, and mix you with competitors on the same screen. Your website is the one place you control story, photography, private events positioning, and direct reservation links without algorithm changes killing reach overnight.",
    ),
    p(
      "Local SEO rewards restaurants with real sites. Structured hours, address consistency, menu text Google can index, and internal links to location pages help you rank for 'best pasta in Midtown' and 'brunch near me.' The StoneAI template builds those foundations into every page.",
    ),
    h3("mobile-guests", "Designed for Guests on the Move"),
    p(
      "Most restaurant traffic is mobile, often on cellular data between meetings or on the sidewalk comparing options. The template prioritizes fast-loading galleries, tap-to-call buttons, sticky reservation CTAs, and menu typography readable without pinch-zoom. If a guest cannot find tonight's specials in three taps, they choose somewhere else.",
    ),
    ul([
      "Click-to-call and directions links on every page header",
      "Menu categories that expand cleanly on small screens",
      "Allergy and dietary tags on dish descriptions",
      "Private dining and catering inquiry forms",
      "Gift card and merchandise links for additional revenue",
    ]),
    link("best-landing-page-builders", "Best landing page builders for local businesses"),
    h2("template-sections", "Restaurant Template Sections"),
    h3("menu-layouts", "Menu Layouts That Sell the Kitchen"),
    p(
      "Menu pages group dishes by course or category with descriptions that sound like your chef, not a generic template. Price formatting, wine pairings, chef's tasting notes, and seasonal banners are editable blocks. Link to PDF downloads for printers if needed, but keep HTML menus on the site for SEO.",
    ),
    h3("gallery-story", "Gallery and Brand Story"),
    p(
      "Hero photography sets expectations—dim lighting and white tablecloths signal fine dining; bright colors and open kitchen shots signal casual energy. Gallery grids showcase plates, cocktails, patio season, and private event setups. The about page tells origin story: family recipes, chef background, sourcing philosophy. Story builds emotional loyalty beyond star ratings.",
    ),
    h3("hours-location-events", "Hours, Location, Events, and Catering"),
    p(
      "Contact pages consolidate address, parking, public transit, and holiday hour exceptions. Events sections promote live music, wine dinners, and holiday prix fixe menus. Catering blocks capture corporate lunch and wedding inquiries with forms routed to your events manager. Multi-location groups use index pages linking to each neighborhood spot.",
    ),
    ctaMiddle(),
    h2("restaurant-segments", "Adapting the Template by Restaurant Type"),
    p(
      "Fine dining emphasizes reservations, tasting menus, and dress code notes. Fast-casual highlights online ordering and pickup instructions. Bars feature cocktail lists and happy hour timers. Cafes promote morning hours, loyalty programs, and remote-work-friendly seating. Food trucks use simplified menus with today's location schedule. StoneAI adjusts tone and section emphasis from your prompt.",
    ),
    ul([
      "Fine dining: prix fixe, wine list, private dining room gallery",
      "Casual dining: family portions, kids menu, weekly specials",
      "Bars: cocktail program, events calendar, late-night kitchen",
      "Cafes: bakery items, coffee origins, merchandise shelf",
      "Groups: location finder, shared loyalty, central catering desk",
    ]),
    h2("launch-checklist", "Restaurant Website Launch Checklist"),
    ol([
      "Collect photography: hero shot, six plates, interior, bar or patio.",
      "Write a prompt with cuisine, neighborhood, price point, services, and pages needed.",
      "Generate in StoneAI and verify menu readability on iPhone and Android.",
      "Add accurate hours including kitchen close vs door close times.",
      "Link reservation platform, ordering, and social profiles.",
      "Embed Google Map or verify address schema for local search.",
      "Publish before promoting new seasonal menu on Instagram.",
    ]),
    h3("seasonal-updates", "Seasonal Updates Without Agency Fees"),
    p(
      "Menus change. Summer patios open. Holiday hours shift. StoneAI's editor lets managers update dishes and banners in minutes—no ticket to a web agency, no fighting WordPress plugins. Marketing teams spin up Valentine's or Super Bowl landing pages linked from the homepage for two-week campaigns.",
    ),
    h2("staff-training", "Training Staff to Keep the Site Accurate"),
    p(
      "Managers—not only owners—should know how to update hours, 86'd dishes, and event banners in StoneAI. A fifteen-minute walkthrough prevents the classic failure mode: correct info on Instagram, wrong info on the website. Assign one shift lead as site owner; they publish weekly specials every Monday before service.",
    ),
    p(
      "Multi-location groups document update rules in a one-page playbook: who changes menus, who approves photos, how fast holiday hours go live. Consistency across locations builds brand trust when guests visit your second or third restaurant.",
    ),
    h2("visual-quality", "Food Photography and AI Imagery"),
    p(
      "Great food photos drive reservations. When professional shoots lag behind menu changes, StoneAI's AI imagery fills gaps with stylistically consistent plate and ambiance visuals until your photographer visits. Replace generated images with real shots over time—the layout stays stable.",
    ),
    p(
      "Cinematic hero sections and warm color grading help independent restaurants compete visually with chain brands that spend millions on creative. Your site should make guests hungry—that is the job.",
    ),
    h3("reviews-and-social-proof", "Reviews and Press"),
    p(
      "Embed testimonial quotes from Google, Yelp, or local press. Highlight awards—best new restaurant, wine spectator mention, neighborhood favorite. Social proof reduces anxiety for first-time visitors choosing between two similar options on the same block.",
    ),
    h2("ordering-integration", "Connecting Ordering and Reservations"),
    p(
      "The template does not replace your POS—but it links to it cleanly. OpenTable, Resy, Tock, Toast, DoorDash, and Uber Eats buttons belong above the fold on mobile. Direct ordering saves commission when guests pick up. StoneAI keeps those CTAs consistent across pages so you are not maintaining link lists in three places.",
    ),
    h3("private-events-catering", "Private Events and Catering Revenue"),
    p(
      "Full-service restaurants often make higher margin on private dining and catering than walk-in covers. Dedicated event pages describe room capacity, AV options, sample menus, and inquiry forms routed to your events coordinator. Wedding season, corporate holiday parties, and rehearsal dinners start with a Google search—your site should capture that demand with photography of past events, not a buried PDF.",
    ),
    h3("google-business-profile", "Aligning Website with Google Business Profile"),
    p(
      "Guests cross-check your site against your Google listing. Hours, phone number, and address must match exactly or you lose trust and local ranking signals. After publishing in StoneAI, audit NAP consistency across GBP, Instagram, and reservation platforms. Add the website URL to GBP and request reviews from regulars—the site gives reviewers context about what to mention.",
    ),
    h3("seasonal-campaigns", "Seasonal Campaigns and Limited-Time Menus"),
    p(
      "Holiday prix fixe, summer patio menus, and collaboration dinners deserve temporary landing pages linked from your homepage banner. StoneAI lets you publish a Valentine's or holiday campaign page in under an hour, then archive or redirect it when the event ends. Campaign-specific URLs are easier to track in analytics than generic homepage traffic.",
    ),
    p(
      "Independent restaurants compete with chains that have national marketing budgets. A distinctive website with real photography and clear reservation paths levels the playing field for discovery—especially in dense dining markets where guests choose between ten options on the same block.",
    ),
    link("ai-website-builder-pricing-guide", "Website costs for independent restaurants"),
    h2("open-tonight", "Get Your Restaurant Site Live This Week"),
    p(
      "Sign up for StoneAI, describe your restaurant in a detailed prompt, upload your best photos, and publish to your domain. Share the link on Google Business Profile, Instagram bio, and reservation confirmations. A credible site pays for itself in filled tables and catering leads.",
    ),
    p(
      "Whether you run a single neighborhood bistro or a growing restaurant group, the template gives guests everything they need to choose you tonight—not your competitor down the street.",
    ),
    p(
      "Update your menu and specials before the dinner rush, not after the weekend. Guests who land on your site from Instagram or Google should see tonight's offering immediately.",
    ),
    p(
      "Treat the website as part of service: accurate hours, current menus, and working reservation links are hospitality basics in 2026. StoneAI makes those updates fast enough that they actually happen.",
    ),
    p(
      "Photograph new dishes when they hit the menu and swap gallery images the same week. Guests choose restaurants that look active and cared for—your site should reflect what is on the pass tonight.",
    ),
    link("stoneai-vs-framer", "StoneAI vs Framer for hospitality brands"),
    ctaBottom(),
  ],
};
