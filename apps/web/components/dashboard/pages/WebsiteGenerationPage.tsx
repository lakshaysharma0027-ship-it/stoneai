"use client";

import {
  Globe,
  History,
  Info,
  Layout,
  Palette,
  Pencil,
  Wand2,
} from "lucide-react";
import { CREDIT_COSTS } from "@/lib/billing/credits";
import type { WebsiteIndustry, WebsiteStyle } from "@/lib/ai";
import { GenerationPageHeader } from "../generation/GenerationPageHeader";
import { GenerationProgressOverlay } from "../generation/GenerationProgressOverlay";
import {
  COLOR_SWATCHES,
  INDUSTRY_OPTIONS,
  STYLE_OPTIONS,
  WEBSITE_TYPE_OPTIONS,
} from "../generation/constants";
import type { DashboardDataContext } from "../hooks/useDashboardData";
import "../generation-pages.css";
import { formatShortDate } from "../utils";

export function WebsiteGenerationPage({ data }: { data: DashboardDataContext }) {
  const cost = CREDIT_COSTS.generate_website;
  const history = data.aiHistory.slice(0, 12);

  const activeColorId =
    COLOR_SWATCHES.find((swatch) => swatch.label === data.generateForm.colorPreference)?.id ??
    "mono";

  const setColor = (swatch: (typeof COLOR_SWATCHES)[number]) => {
    data.updateGenerateForm("colorPreference", swatch.label);
  };

  const getProjectName = (projectId: string | null, prompt: string) => {
    if (!projectId) return prompt.slice(0, 48) || "Generated website";
    const project = data.projects.find((item) => item.id === projectId);
    return project?.name ?? (prompt.slice(0, 48) || "Generated website");
  };

  return (
    <div className="gen-spec-page">
      <GenerationProgressOverlay
        active={data.generating}
        mode="website"
        title="Generating your website"
        subtitle="This usually takes 30–60 seconds"
      />

      <GenerationPageHeader
        title="Website Generation"
        cost={cost}
        costLabel="per website"
        remaining={data.creditsRemaining}
      />

      <div className="gen-layout">
        <div>
          <div className="gen-card">
            <div className="gen-card-head">
              <span className="gen-card-title">Describe your website</span>
              <span className="gen-card-meta">
                <Info size={12} />
                Be as detailed as possible for best results
              </span>
            </div>
            <form
              className="gen-card-body"
              onSubmit={(e) => void data.handleGenerateProject(e)}
            >
              <textarea
                className="prompt-area"
                value={data.generateForm.prompt}
                onChange={(e) => data.updateGenerateForm("prompt", e.target.value)}
                placeholder="Describe your website — industry, audience, pages, style, and features. Example: A premium SaaS landing page for a project management tool targeting startup founders. Include a hero, features section, pricing table, and FAQ."
                disabled={data.generating}
              />

              <div className="form-grid-2 mt-16">
                <div>
                  <label className="field-label" htmlFor="business-name">
                    Business name
                  </label>
                  <input
                    id="business-name"
                    className="input"
                    value={data.generateForm.businessName}
                    onChange={(e) => data.updateGenerateForm("businessName", e.target.value)}
                    placeholder="StoneAI"
                    disabled={data.generating}
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="website-type">
                    Website type
                  </label>
                  <select
                    id="website-type"
                    className="select"
                    value={data.generateForm.websiteType}
                    onChange={(e) => data.updateGenerateForm("websiteType", e.target.value)}
                    disabled={data.generating}
                  >
                    {WEBSITE_TYPE_OPTIONS.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="field-block">
                <label className="field-label" htmlFor="business-description">
                  Business description{" "}
                  <span className="field-label-optional">(optional)</span>
                </label>
                <textarea
                  id="business-description"
                  className="input"
                  value={data.generateForm.description}
                  onChange={(e) => data.updateGenerateForm("description", e.target.value)}
                  placeholder="What does your business do? Who are your customers?"
                  disabled={data.generating}
                />
              </div>

              <div className="form-grid-2 mt-12">
                <div>
                  <label className="field-label" htmlFor="industry">
                    Industry
                  </label>
                  <select
                    id="industry"
                    className="select"
                    value={data.generateForm.industry}
                    onChange={(e) =>
                      data.updateGenerateForm("industry", e.target.value as WebsiteIndustry | "Auto")
                    }
                    disabled={data.generating}
                  >
                    {INDUSTRY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="field-label" htmlFor="visual-style">
                    Visual style
                  </label>
                  <select
                    id="visual-style"
                    className="select"
                    value={data.generateForm.style}
                    onChange={(e) =>
                      data.updateGenerateForm("style", e.target.value as WebsiteStyle)
                    }
                    disabled={data.generating}
                  >
                    {STYLE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="field-block mt-16">
                <span className="field-label">Brand colors</span>
                <div className="color-row">
                  {COLOR_SWATCHES.map((swatch) => (
                    <button
                      key={swatch.id}
                      type="button"
                      className={`color-swatch ${swatch.className} ${activeColorId === swatch.id ? "active" : ""}`}
                      title={swatch.label}
                      onClick={() => setColor(swatch)}
                      disabled={data.generating}
                      aria-label={swatch.label}
                    />
                  ))}
                  <span className="color-swatch-label">{data.generateForm.colorPreference}</span>
                </div>
              </div>

              {data.generateError ? (
                <p className="gen-error">{data.generateError}</p>
              ) : null}

              <button
                type="submit"
                className={`gen-btn-main ${data.generating || data.creditsRemaining <= 0 ? "disabled" : ""}`}
                disabled={data.generating || data.creditsRemaining <= 0}
              >
                <Wand2 size={15} />
                {data.generating ? "Generating website…" : "Generate website"}
                <span className="cost">· {cost} credits</span>
              </button>
              <div className="gen-notice">
                Generation takes 30–60 seconds · Result opens in editor automatically
              </div>
            </form>
          </div>
        </div>

        <div>
          <div className="aside-panel">
            <div className="aside-head">
              <span className="aside-head-title">Generation history</span>
              <span className="aside-head-count">{history.length} total</span>
            </div>
            {history.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <History size={18} />
                </div>
                <div className="empty-title">No generations yet</div>
                <div className="empty-sub">
                  Your generated websites will appear here. Each one opens directly in the editor.
                </div>
              </div>
            ) : (
              history.map((item) => {
                const name = getProjectName(item.project_id, item.prompt);
                return (
                  <div
                    key={item.id}
                    className="hist-row"
                    onClick={() => {
                      if (item.project_id) data.router.push(`/editor/${item.project_id}`);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && item.project_id) {
                        data.router.push(`/editor/${item.project_id}`);
                      }
                    }}
                    role={item.project_id ? "button" : undefined}
                    tabIndex={item.project_id ? 0 : undefined}
                  >
                    <div className="hist-thumb">
                      <Globe size={13} />
                    </div>
                    <div className="hist-info">
                      <div className="hist-name">{name}</div>
                      <div className="hist-time">
                        {formatShortDate(item.created_at)} · {cost} credits
                      </div>
                    </div>
                    <span className="hist-status hist-done">Done</span>
                    {item.project_id ? (
                      <div className="hist-actions">
                        <button
                          type="button"
                          className="hist-action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            data.router.push(`/editor/${item.project_id}`);
                          }}
                        >
                          Open editor
                        </button>
                      </div>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>

          <div className="aside-panel">
            <div className="aside-head">
              <span className="aside-head-title">Tips</span>
            </div>
            <div className="tip-list">
              <div className="tip-row">
                <div className="tip-icon">
                  <Pencil size={11} />
                </div>
                <div className="tip-text">
                  Describe your <strong>target audience</strong> and the{" "}
                  <strong>main action</strong> you want visitors to take.
                </div>
              </div>
              <div className="tip-row">
                <div className="tip-icon">
                  <Layout size={11} />
                </div>
                <div className="tip-text">
                  List the <strong>pages or sections</strong> you need — hero, pricing, FAQ,
                  team, etc.
                </div>
              </div>
              <div className="tip-row">
                <div className="tip-icon">
                  <Palette size={11} />
                </div>
                <div className="tip-text">
                  Pick a brand color — it applies to buttons, accents, and highlights
                  throughout.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
