"use client";

import { CREDIT_COSTS } from "@/lib/billing/credits";
import type { WebsiteIndustry, WebsiteStyle } from "@/lib/ai";
import type { DashboardDataContext } from "../hooks/useDashboardData";
import { ActivityFeed, type ActivityItem } from "../ui/ActivityFeed";
import { formatShortDate } from "../utils";

export function WebsiteGenerationPage({ data }: { data: DashboardDataContext }) {
  const cost = CREDIT_COSTS.generate_website;

  const history: ActivityItem[] = data.aiHistory.slice(0, 12).map((item) => ({
    id: item.id,
    type: "website",
    prompt: item.prompt.slice(0, 120),
    time: formatShortDate(item.created_at),
    credits: cost,
    status: "completed",
  }));

  return (
    <div className="dashboard-content-inner">
      <header className="mb-4">
        <h1 className="text-[18px] font-semibold tracking-[-0.03em] text-white">
          Website Generation
        </h1>
        <p className="mt-0.5 text-[12px] text-[var(--dash-muted)]">
          {data.creditsRemaining.toLocaleString()} credits remaining · {cost} per website
        </p>
      </header>

      <div className="grid gap-3 lg:grid-cols-[1fr_320px]">
        <div className="dash-card">
          <div className="dash-card-header">
            <span className="dash-card-title">Describe your website</span>
            <span className="text-[11px] text-[var(--dash-muted)]">{cost} credits</span>
          </div>
          <form
            onSubmit={(e) => void data.handleGenerateProject(e)}
            className="dash-card-body space-y-3"
          >
            <textarea
              value={data.generateForm.prompt}
              onChange={(e) => data.updateGenerateForm("prompt", e.target.value)}
              rows={5}
              placeholder="Describe your website — industry, audience, pages, style, and features…"
              className="dash-input resize-y leading-relaxed"
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-[11px] text-[var(--dash-muted)]">
                Business name
                <input
                  value={data.generateForm.businessName}
                  onChange={(e) => data.updateGenerateForm("businessName", e.target.value)}
                  className="dash-input mt-1"
                  placeholder="StoneAI"
                />
              </label>
              <label className="block text-[11px] text-[var(--dash-muted)]">
                Website type
                <input
                  value={data.generateForm.websiteType}
                  onChange={(e) => data.updateGenerateForm("websiteType", e.target.value)}
                  className="dash-input mt-1"
                  placeholder="Landing page"
                />
              </label>
            </div>

            <label className="block text-[11px] text-[var(--dash-muted)]">
              Description
              <textarea
                value={data.generateForm.description}
                onChange={(e) => data.updateGenerateForm("description", e.target.value)}
                rows={2}
                className="dash-input mt-1 resize-y"
                placeholder="What does your business do?"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-[11px] text-[var(--dash-muted)]">
                Industry
                <select
                  value={data.generateForm.industry}
                  onChange={(e) =>
                    data.updateGenerateForm("industry", e.target.value as WebsiteIndustry | "Auto")
                  }
                  className="dash-input mt-1"
                >
                  {["Auto", "AI", "Startup", "Agency", "Portfolio", "SaaS", "Ecommerce"].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-[11px] text-[var(--dash-muted)]">
                Style
                <select
                  value={data.generateForm.style}
                  onChange={(e) =>
                    data.updateGenerateForm("style", e.target.value as WebsiteStyle)
                  }
                  className="dash-input mt-1"
                >
                  {["Premium", "Minimal", "Bold", "Editorial", "Technical"].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-[11px] text-[var(--dash-muted)] sm:col-span-2">
                Brand colors
                <input
                  value={data.generateForm.colorPreference}
                  onChange={(e) => data.updateGenerateForm("colorPreference", e.target.value)}
                  className="dash-input mt-1"
                  placeholder="Monochrome premium"
                />
              </label>
            </div>

            {data.generateError ? (
              <p className="text-[11px] text-[var(--dash-red)]">{data.generateError}</p>
            ) : null}

            <button
              type="submit"
              disabled={data.generating || data.creditsRemaining <= 0}
              className="dash-btn dash-btn-primary w-full py-2.5"
            >
              {data.generating ? "Generating…" : "Generate website"}
            </button>
          </form>
        </div>

        <div className="dash-card overflow-hidden">
          <div className="dash-card-header">
            <span className="dash-card-title">Generation history</span>
          </div>
          <ActivityFeed items={history} />
        </div>
      </div>
    </div>
  );
}
