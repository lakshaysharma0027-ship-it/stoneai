"use client";

import { Camera, Download, ExternalLink, Globe, Play, Zap } from "lucide-react";
import { CREDIT_COSTS } from "@/lib/billing/credits";
import type { WebsiteIndustry, WebsiteStyle } from "@/lib/ai";
import type { DashboardDataContext } from "../hooks/useDashboardData";
import { Chip } from "../ui/Chip";
import { DashSelect, DashTextarea } from "../ui/FilterBar";
import { PageHeader } from "../ui/PageHeader";
import { Panel, PanelHead } from "../ui/Panel";
import { formatShortDate } from "../utils";

export function GeneratePage({ data }: { data: DashboardDataContext }) {
  const websiteCost = CREDIT_COSTS.generate_website;
  const imageCost = CREDIT_COSTS.media_image_generate;
  const videoCost = CREDIT_COSTS.media_video_generate;

  const history = [
    ...data.aiHistory.map((item) => ({
      id: `ai-${item.id}`,
      title: item.prompt.slice(0, 100),
      meta: `${formatShortDate(item.created_at)} · Website generation`,
      credits: websiteCost,
      status: "completed",
      type: "website" as const,
      link: item.project_id ? `/editor/${item.project_id}` : null,
      assetUrl: null,
    })),
    ...data.mediaHistory.map((item) => ({
      id: `media-${item.id}`,
      title: item.prompt.slice(0, 100),
      meta: `${formatShortDate(item.created_at)} · ${item.media_type === "image" ? "Image" : "Video"} generation`,
      credits: item.credits_used,
      status: item.status,
      type: item.media_type,
      link: null,
      assetUrl: item.asset_url,
    })),
  ].slice(0, 20);

  const totalCreditsUsed = history.reduce((sum, item) => sum + item.credits, 0);

  return (
    <>
      <PageHeader
        title="AI Generation"
        subtitle={`Generate websites, images, and videos — ${data.creditsRemaining.toLocaleString()} credits remaining`}
      />

      <Panel>
        <div className="p-4">
          <p className="mb-1.5 text-[11px] text-[var(--dash-hint)]">What do you want to build?</p>
          <DashTextarea
            value={data.generateForm.prompt || data.mediaPrompt}
            onChange={(value) => {
              data.updateGenerateForm("prompt", value);
              data.setMediaPrompt(value);
            }}
            rows={4}
            placeholder="Describe your website in detail. Include industry, target audience, key pages, desired style, and any specific features or integrations you need…"
          />
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void data.handleGenerateProject()}
              disabled={data.generating || data.creditsRemaining <= 0}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-[var(--dash-radius)] border border-[var(--dash-white)] bg-[var(--dash-white)] px-3.5 py-1.5 text-xs font-medium text-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Globe size={13} />
              {data.generating ? "Generating…" : "Generate website"}
            </button>
            <button
              type="button"
              onClick={() => {
                data.setMediaMode("image");
                void data.handleGenerateMedia("image");
              }}
              disabled={data.mediaGenerating || data.creditsRemaining <= 0}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-[var(--dash-radius)] border border-[var(--dash-border)] bg-[var(--dash-surface2)] px-3.5 py-1.5 text-xs font-medium text-[var(--dash-muted)] hover:border-[var(--dash-border2)] hover:text-[var(--dash-text)] disabled:opacity-50"
            >
              <Camera size={13} />
              Generate image
            </button>
            <button
              type="button"
              onClick={() => {
                data.setMediaMode("video");
                void data.handleGenerateMedia("video");
              }}
              disabled={data.mediaGenerating || data.creditsRemaining <= 0}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-[var(--dash-radius)] border border-[var(--dash-border)] bg-[var(--dash-surface2)] px-3.5 py-1.5 text-xs font-medium text-[var(--dash-muted)] hover:border-[var(--dash-border2)] hover:text-[var(--dash-text)] disabled:opacity-50"
            >
              <Play size={13} />
              Generate video
            </button>
            <span className="ml-auto flex items-center gap-1 text-[11px] text-[var(--dash-hint)]">
              <Zap size={12} />~{websiteCost} credits
            </span>
          </div>

          {data.generateError ? (
            <p className="mt-2 text-[11px] text-[var(--dash-red)]">{data.generateError}</p>
          ) : null}
          {data.mediaError ? (
            <p className="mt-2 text-[11px] text-[var(--dash-red)]">{data.mediaError}</p>
          ) : null}

          <button
            type="button"
            onClick={() => data.setShowGenerateDetails(!data.showGenerateDetails)}
            className="mt-3 cursor-pointer text-[11px] text-[var(--dash-hint)] hover:text-[var(--dash-muted)]"
          >
            {data.showGenerateDetails ? "Hide" : "Show"} website generation options
          </button>

          {data.showGenerateDetails ? (
            <form
              onSubmit={(e) => void data.handleGenerateProject(e)}
              className="mt-3 grid gap-3 border-t border-[var(--dash-border)] pt-3"
            >
              <label className="grid gap-1 text-[11px] text-[var(--dash-hint)]">
                Business name
                <input
                  value={data.generateForm.businessName}
                  onChange={(e) => data.updateGenerateForm("businessName", e.target.value)}
                  className="rounded-[var(--dash-radius)] border border-[var(--dash-border)] bg-[var(--dash-surface2)] px-2.5 py-1.5 text-xs text-[var(--dash-text)] outline-none"
                  placeholder="StoneAI"
                />
              </label>
              <label className="grid gap-1 text-[11px] text-[var(--dash-hint)]">
                Description
                <DashTextarea
                  value={data.generateForm.description}
                  onChange={(v) => data.updateGenerateForm("description", v)}
                  rows={2}
                  placeholder="A premium AI website builder for startup teams."
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1 text-[11px] text-[var(--dash-hint)]">
                  Industry
                  <DashSelect
                    value={data.generateForm.industry}
                    onChange={(v) =>
                      data.updateGenerateForm("industry", v as WebsiteIndustry | "Auto")
                    }
                  >
                    {["Auto", "AI", "Startup", "Agency", "Portfolio", "SaaS", "Ecommerce"].map(
                      (industry) => (
                        <option key={industry} value={industry}>
                          {industry}
                        </option>
                      ),
                    )}
                  </DashSelect>
                </label>
                <label className="grid gap-1 text-[11px] text-[var(--dash-hint)]">
                  Style
                  <DashSelect
                    value={data.generateForm.style}
                    onChange={(v) => data.updateGenerateForm("style", v as WebsiteStyle)}
                  >
                    {["Premium", "Minimal", "Bold", "Editorial", "Technical"].map((style) => (
                      <option key={style} value={style}>
                        {style}
                      </option>
                    ))}
                  </DashSelect>
                </label>
                <label className="grid gap-1 text-[11px] text-[var(--dash-hint)]">
                  Color preference
                  <input
                    value={data.generateForm.colorPreference}
                    onChange={(e) => data.updateGenerateForm("colorPreference", e.target.value)}
                    className="rounded-[var(--dash-radius)] border border-[var(--dash-border)] bg-[var(--dash-surface2)] px-2.5 py-1.5 text-xs text-[var(--dash-text)] outline-none"
                  />
                </label>
                <label className="grid gap-1 text-[11px] text-[var(--dash-hint)]">
                  Website type
                  <input
                    value={data.generateForm.websiteType}
                    onChange={(e) => data.updateGenerateForm("websiteType", e.target.value)}
                    className="rounded-[var(--dash-radius)] border border-[var(--dash-border)] bg-[var(--dash-surface2)] px-2.5 py-1.5 text-xs text-[var(--dash-text)] outline-none"
                  />
                </label>
              </div>
            </form>
          ) : null}
        </div>
      </Panel>

      <div className="mb-3.5 grid gap-3 md:grid-cols-3">
        {[
          {
            title: "Website generation",
            cost: websiteCost,
            desc: "Full multi-page website. React + Tailwind. Generates homepage, about, pricing, contact, and more. Editable in visual editor after generation.",
          },
          {
            title: "Image generation",
            cost: imageCost,
            desc: "High-resolution image generation. Use directly in your websites or download. Multiple style presets available.",
          },
          {
            title: "Video generation",
            cost: videoCost,
            desc: "Cinematic short-form video generation. Ideal for hero backgrounds, product demos, and social media content.",
          },
        ].map((card) => (
          <Panel key={card.title} className="mb-0">
            <PanelHead title={card.title} action={<Chip variant="draft">{card.cost} credits</Chip>} />
            <p className="px-4 py-3 text-xs leading-relaxed text-[var(--dash-hint)]">{card.desc}</p>
          </Panel>
        ))}
      </div>

      <Panel className="mb-0">
        <PanelHead
          title="Generation history"
          action={
            totalCreditsUsed > 0 ? (
              <span className="text-[11px] text-[var(--dash-hint)]">
                {totalCreditsUsed} credits used total
              </span>
            ) : null
          }
        />
        {history.length === 0 ? (
          <p className="px-4 py-8 text-center text-xs text-[var(--dash-hint)]">
            No generations yet.
          </p>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 border-b border-[var(--dash-border)] px-4 py-2.5 last:border-b-0"
            >
              <span className="flex h-7 w-10 shrink-0 items-center justify-center rounded border border-[var(--dash-border)] bg-[var(--dash-surface2)] text-[var(--dash-hint)]">
                {item.type === "website" ? <Globe size={13} /> : item.type === "image" ? <Camera size={13} /> : <Play size={13} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-medium text-[var(--dash-text)]">
                  {item.title}
                </span>
                <span className="block text-[11px] text-[var(--dash-hint)]">{item.meta}</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-[11px] text-[var(--dash-hint)]">{item.credits} cr</span>
                <Chip variant={item.status === "completed" ? "live" : "build"}>
                  {item.status === "completed" ? "Done" : item.status}
                </Chip>
                {item.link ? (
                  <button
                    type="button"
                    onClick={() => data.router.push(item.link!)}
                    className="cursor-pointer text-[var(--dash-hint)] hover:text-[var(--dash-text)]"
                  >
                    <ExternalLink size={12} />
                  </button>
                ) : null}
                {item.assetUrl ? (
                  <button
                    type="button"
                    onClick={() => window.open(item.assetUrl!, "_blank", "noopener,noreferrer")}
                    className="cursor-pointer text-[var(--dash-hint)] hover:text-[var(--dash-text)]"
                  >
                    <Download size={12} />
                  </button>
                ) : null}
              </span>
            </div>
          ))
        )}
      </Panel>
    </>
  );
}
