"use client";

import {
  ArrowRight,
  ArrowUpCircle,
  Bolt,
  Folder,
  Globe,
  Plus,
  Rocket,
  Sparkles,
  TrendingUp,
  Upload,
} from "lucide-react";
import { CREDIT_COSTS } from "@/lib/billing/credits";
import type { DashboardDataContext } from "../hooks/useDashboardData";
import { SpecSparkline } from "../ui/SpecSparkline";
import type { DashboardView } from "../types";
import "../overview-projects.css";
import {
  buildCreditUsageSparkline,
  buildProjectActivitySparkline,
  formatShortDate,
  getProjectDomain,
  getProjectGradientIndex,
  getProjectStatus,
  getProjectTraffic,
  getTemplateName,
  projectInitials,
} from "../utils";

export function OverviewPage({
  data,
  onNavigate,
}: {
  data: DashboardDataContext;
  onNavigate: (view: DashboardView) => void;
}) {
  const today = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const recentProjects = data.projects.slice(0, 6);
  const projectSpark = buildProjectActivitySparkline(data.projects);
  const usageSpark = buildCreditUsageSparkline(data.creditTransactions);
  const usagePercent = data.monthlyCredits
    ? Math.round((data.creditsUsed / data.monthlyCredits) * 100)
    : 0;

  const generations = [
    ...data.aiHistory.slice(0, 4).map((item) => ({
      id: `ai-${item.id}`,
      title: item.prompt.slice(0, 80),
      meta: `${formatShortDate(item.created_at)} · Website · ${CREDIT_COSTS.generate_website} credits`,
    })),
    ...data.mediaHistory.slice(0, 4).map((item) => ({
      id: `media-${item.id}`,
      title: item.prompt.slice(0, 80),
      meta: `${formatShortDate(item.created_at)} · ${item.media_type} · ${item.credits_used} credits`,
    })),
  ].slice(0, 5);

  const creditsUsedPercent = data.monthlyCredits
    ? Math.min((data.creditsUsed / data.monthlyCredits) * 100, 100)
    : 0;

  const siteLimit = data.billingSummary?.plan.siteLimit ?? 1;
  const hasCustomDomains = data.connectedDomains.length > 0;

  return (
    <div className="spec-page">
      <div className="page-header">
        <div>
          <div className="page-h1">Overview</div>
          <div className="page-sub">
            {today} · {data.billingSummary?.plan.name ?? "Free Trial"}
          </div>
        </div>
        <div className="page-header-actions">
          <button
            type="button"
            className="btn"
            onClick={() => onNavigate("generate-website")}
          >
            <Sparkles size={13} />
            Generate with AI
          </button>
          {data.localProjectCount > 0 ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => void data.handleImportLocalProjects()}
              disabled={data.importing}
            >
              <Upload size={13} />
              {data.importing ? "Importing…" : "Import"}
            </button>
          ) : null}
        </div>
      </div>

      {data.localProjectCount > 0 ? (
        <div className="import-banner">
          <span className="import-banner-text">
            <strong>Import local projects</strong> — Move {data.localProjectCount} local project
            {data.localProjectCount === 1 ? "" : "s"} into your account.
          </span>
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => void data.handleImportLocalProjects()}
            disabled={data.importing}
          >
            {data.importing ? "Importing…" : "Import"}
          </button>
        </div>
      ) : null}

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-card-icon">
            <Folder size={15} />
          </span>
          <div className="stat-label">Projects</div>
          <div className="stat-value">{data.projects.length}</div>
          <div className="stat-sub">
            {data.draftProjectCount} draft{data.draftProjectCount === 1 ? "" : "s"}
          </div>
          <div className="stat-sparkline">
            <SpecSparkline values={projectSpark} />
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-card-icon">
            <Rocket size={15} />
          </span>
          <div className="stat-label">Published sites</div>
          <div className="stat-value">{data.liveSiteCount}</div>
          <div className="stat-sub">
            {data.liveSiteCount > 0 ? (
              <>
                <span className="live-dot" />
                <span className="live-label">{data.liveSiteCount} live</span>
              </>
            ) : (
              "None published"
            )}
          </div>
          <div className="stat-sparkline">
            <SpecSparkline
              values={data.publishedSites.map((s) => (s.status === "published" ? 1 : 0))}
              variant="green"
            />
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-card-icon">
            <Bolt size={15} />
          </span>
          <div className="stat-label">Credits remaining</div>
          <div className="stat-value">{data.creditsRemaining.toLocaleString()}</div>
          <div className="stat-sub">
            {data.creditsUsed} of {data.monthlyCredits} used
          </div>
          <div className="stat-sparkline">
            <SpecSparkline values={usageSpark.length ? usageSpark : [0, 0, 0, 0, 0, 0, 0]} />
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-card-icon">
            <TrendingUp size={15} />
          </span>
          <div className="stat-label">Monthly usage</div>
          <div className="stat-value">{usagePercent}%</div>
          <div className="stat-sub">Usage from credits</div>
          <div className="stat-sparkline">
            <SpecSparkline
              values={usageSpark.length ? usageSpark : Array.from({ length: 7 }, () => 0)}
            />
          </div>
        </div>
      </div>

      <div className="overview-body">
        <div>
          <div className="panel">
            <div className="panel-head">
              <span className="panel-head-title">Recent projects</span>
              <button type="button" className="panel-link" onClick={() => onNavigate("projects")}>
                View all <ArrowRight size={10} />
              </button>
            </div>
            {recentProjects.length === 0 ? (
              <div className="gen-empty">
                <Sparkles size={20} className="gen-empty-icon" />
                <div className="gen-empty-title">No projects yet</div>
                <div className="gen-empty-sub">Create a project from a template to get started.</div>
              </div>
            ) : (
              <>
                <div className="proj-table-head">
                  <span>Project</span>
                  <span>Status</span>
                  <span>Updated</span>
                  <span>Domain</span>
                  <span>Views</span>
                </div>
                {recentProjects.map((project) => {
                  const status = getProjectStatus(project, data.publishedSites);
                  const domain = getProjectDomain(
                    project.id,
                    data.publishedSites,
                    data.connectedDomains,
                  );
                  const views = getProjectTraffic(project.id, data.publishedSites);
                  return (
                    <div
                      key={project.id}
                      className="proj-table-row"
                      onClick={() => data.router.push(`/editor/${project.id}`)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") data.router.push(`/editor/${project.id}`);
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`proj-icon grad-${getProjectGradientIndex(project.id)}`}>
                          {projectInitials(project.name)}
                        </div>
                        <div className="min-w-0">
                          <div className="proj-cell-name">{project.name}</div>
                          <div className="proj-cell-meta">{getTemplateName(project)}</div>
                        </div>
                      </div>
                      <div>
                        <span className={status === "live" ? "chip chip-live" : "chip chip-draft"}>
                          {status === "live" ? "Live" : "Draft"}
                        </span>
                      </div>
                      <div className="proj-cell-sec">{formatShortDate(project.updatedAt)}</div>
                      <div className="proj-cell-sec">{domain?.domain ?? "—"}</div>
                      <div className="proj-cell-sec">
                        {views !== null && views > 0 ? views.toLocaleString() : "—"}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          <div className="panel">
            <div className="panel-head">
              <span className="panel-head-title">Recent AI generations</span>
              <button
                type="button"
                className="panel-link"
                onClick={() => onNavigate("generate-website")}
              >
                View all <ArrowRight size={10} />
              </button>
            </div>
            {generations.length === 0 ? (
              <div className="gen-empty">
                <Sparkles size={20} className="gen-empty-icon" />
                <div className="gen-empty-title">No generations yet</div>
                <div className="gen-empty-sub">
                  Generate a website, image, or video to see history here.
                </div>
              </div>
            ) : (
              generations.map((item) => (
                <div key={item.id} className="gen-row">
                  <div className="min-w-0 flex-1">
                    <div className="gen-row-title">{item.title}</div>
                    <div className="gen-row-meta">{item.meta}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="panel">
            <div className="panel-head">
              <span className="panel-head-title">Credits</span>
            </div>
            <div className="credits-panel-body">
              <div className="credits-num">{data.creditsRemaining.toLocaleString()}</div>
              <div className="credits-of">of {data.monthlyCredits.toLocaleString()} remaining</div>
              <div className="track">
                <div
                  className="track-fill"
                  data-pct={Math.min(100, Math.max(0, Math.round(creditsUsedPercent)))}
                />
              </div>
              <div className="track-legend">
                <span>{data.creditsUsed} used</span>
                <span>{data.creditsRemaining} free</span>
              </div>
              <button
                type="button"
                className="btn btn-full credits-upgrade-btn"
                onClick={() => onNavigate("billing")}
              >
                Upgrade for more credits
              </button>
              <div className="plan-label">Current plan</div>
              <div className="plan-name">{data.billingSummary?.plan.name ?? "Free Trial"}</div>
              <div className="plan-detail">
                {data.monthlyCredits} credits · {siteLimit} published site
                {siteLimit === 1 ? "" : "s"} · {hasCustomDomains ? "Custom domains" : "No custom domains"} ·
                Community support
              </div>
              <button
                type="button"
                className="btn btn-primary btn-full"
                onClick={() => void data.handleCheckout("basic_plus")}
              >
                <ArrowUpCircle size={13} />
                Upgrade plan
              </button>
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <span className="panel-head-title">Domains</span>
              <button type="button" className="panel-link" onClick={() => onNavigate("domains")}>
                Manage <ArrowRight size={10} />
              </button>
            </div>
            {data.connectedDomains.length === 0 ? (
              <div className="domain-empty">
                <Globe size={18} className="domain-empty-icon" />
                <div className="domain-empty-text">
                  No domains connected.
                  <br />
                  Add a custom domain to go live on your own URL.
                </div>
                <button type="button" className="btn btn-sm btn-full" onClick={() => onNavigate("domains")}>
                  <Plus size={12} />
                  Connect domain
                </button>
              </div>
            ) : (
              data.connectedDomains.slice(0, 4).map((domain) => (
                <div key={domain.id} className="gen-row">
                  <div className="min-w-0 flex-1">
                    <div className="gen-row-title">{domain.domain}</div>
                    <div className="gen-row-meta">{domain.status}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
