"use client";

import {
  Eye,
  Folder,
  Globe,
  Plus,
  Rocket,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { CREDIT_COSTS } from "@/lib/billing/credits";
import type { DashboardDataContext } from "../hooks/useDashboardData";
import { ActivityFeed, type ActivityItem } from "../ui/ActivityFeed";
import { MetricCard, MetricsGrid } from "../ui/MetricCard";
import type { DashboardView } from "../types";
import {
  buildCreditUsageSparkline,
  buildProjectActivitySparkline,
  chipClassForStatus,
  formatShortDate,
  getProjectDomain,
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
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const recentProjects = data.projects.slice(0, 6);
  const projectSpark = buildProjectActivitySparkline(data.projects);
  const usageSpark = buildCreditUsageSparkline(data.creditTransactions);
  const usagePercent = data.monthlyCredits
    ? Math.round((data.creditsUsed / data.monthlyCredits) * 100)
    : 0;

  const activity: ActivityItem[] = [
    ...data.aiHistory.slice(0, 5).map((item) => ({
      id: `ai-${item.id}`,
      type: "website" as const,
      prompt: item.prompt.slice(0, 100),
      time: formatShortDate(item.created_at),
      credits: CREDIT_COSTS.generate_website,
      status: "completed",
    })),
    ...data.mediaHistory.slice(0, 5).map((item) => ({
      id: `media-${item.id}`,
      type: item.media_type,
      prompt: item.prompt.slice(0, 100),
      time: formatShortDate(item.created_at),
      credits: item.credits_used,
      status: item.status,
    })),
  ]
    .slice(0, 6);

  return (
    <div className="dashboard-content-inner">
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[18px] font-semibold tracking-[-0.03em] text-white">Overview</h1>
          <p className="mt-0.5 text-[12px] text-[var(--dash-muted)]">
            {today} · {data.billingSummary?.plan.name ?? "Free Trial"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("generate-website")}
          className="dash-btn dash-btn-primary"
        >
          <Sparkles size={13} />
          Generate with AI
        </button>
      </header>

      {data.localProjectCount > 0 ? (
        <div className="dash-card mb-3 flex flex-wrap items-center justify-between gap-3 px-3.5 py-2.5">
          <p className="text-[12px] text-[var(--dash-text-secondary)]">
            Import {data.localProjectCount} local project
            {data.localProjectCount === 1 ? "" : "s"} into your account
          </p>
          <button
            type="button"
            onClick={() => void data.handleImportLocalProjects()}
            disabled={data.importing}
            className="dash-btn dash-btn-primary text-[11px]"
          >
            {data.importing ? "Importing…" : "Import"}
          </button>
        </div>
      ) : null}

      <MetricsGrid>
        <MetricCard
          icon={<Folder size={14} />}
          label="Projects"
          value={data.projects.length}
          trend={`${data.draftProjectCount} drafts`}
          sparkline={projectSpark}
        />
        <MetricCard
          icon={<Rocket size={14} />}
          label="Published sites"
          value={data.liveSiteCount}
          trend={data.liveSiteCount ? `${data.liveSiteCount} live` : "None yet"}
          trendTone={data.liveSiteCount ? "up" : "neutral"}
        />
        <MetricCard
          icon={<Zap size={14} />}
          label="Credits remaining"
          value={data.creditsRemaining.toLocaleString()}
          trend={`${data.creditsUsed} of ${data.monthlyCredits} used`}
          sparkline={usageSpark}
        />
        <MetricCard
          icon={<TrendingUp size={14} />}
          label="Monthly usage"
          value={`${usagePercent}%`}
          trend={
            data.totalVisitors > 0
              ? `${data.totalVisitors.toLocaleString()} visitors`
              : "Usage from credits"
          }
        />
      </MetricsGrid>

      <div className="dash-split-main">
        <div className="space-y-3">
          <div className="dash-card overflow-hidden">
            <div className="dash-card-header">
              <span className="dash-card-title">Recent projects</span>
              <button
                type="button"
                onClick={() => onNavigate("projects")}
                className="text-[11px] text-[var(--dash-muted)] hover:text-[var(--dash-text-secondary)]"
              >
                View all →
              </button>
            </div>
            {recentProjects.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-[13px] text-[var(--dash-text-secondary)]">No projects yet</p>
                <button
                  type="button"
                  onClick={() => data.router.push("/templates")}
                  className="dash-btn mt-3"
                >
                  <Plus size={12} />
                  New project
                </button>
              </div>
            ) : (
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Status</th>
                    <th>Updated</th>
                    <th>Domain</th>
                    <th>Views</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProjects.map((project) => {
                    const status = getProjectStatus(project, data.publishedSites);
                    const domain = getProjectDomain(
                      project.id,
                      data.publishedSites,
                      data.connectedDomains,
                    );
                    const views = getProjectTraffic(project.id, data.publishedSites);
                    return (
                      <tr
                        key={project.id}
                        className="cursor-pointer"
                        onClick={() => data.router.push(`/editor/${project.id}`)}
                      >
                        <td>
                          <div className="flex items-center gap-2">
                            <span className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-[var(--dash-border)] bg-[var(--dash-surface2)] text-[10px] font-semibold">
                              {projectInitials(project.name)}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-[13px] font-medium text-[var(--dash-text)]">
                                {project.name}
                              </p>
                              <p className="truncate text-[11px] text-[var(--dash-muted)]">
                                {getTemplateName(project)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`dash-chip ${chipClassForStatus(status)}`}>
                            {status === "live" ? "Live" : "Draft"}
                          </span>
                        </td>
                        <td className="text-[12px]">{formatShortDate(project.updatedAt)}</td>
                        <td className="font-mono text-[11px]">{domain?.domain ?? "—"}</td>
                        <td className="tabular-nums">
                          {views !== null && views > 0 ? views.toLocaleString() : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <div className="dash-card overflow-hidden">
            <div className="dash-card-header">
              <span className="dash-card-title">Recent AI activity</span>
              <button
                type="button"
                onClick={() => onNavigate("generate-website")}
                className="text-[11px] text-[var(--dash-muted)] hover:text-[var(--dash-text-secondary)]"
              >
                View all →
              </button>
            </div>
            <ActivityFeed items={activity} />
          </div>
        </div>

        <aside className="space-y-3">
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">Credits</span>
            </div>
            <div className="dash-card-body">
              <p className="text-[26px] font-semibold tracking-[-0.04em] tabular-nums text-white">
                {data.creditsRemaining.toLocaleString()}
              </p>
              <p className="text-[11px] text-[var(--dash-muted)]">
                of {data.monthlyCredits.toLocaleString()} remaining
              </p>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-[var(--dash-border)]">
                <div
                  className="h-full rounded-full bg-white transition-all duration-500"
                  style={{
                    width: `${data.monthlyCredits ? (data.creditsRemaining / data.monthlyCredits) * 100 : 0}%`,
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => onNavigate("billing")}
                className="dash-btn dash-btn-primary mt-3 w-full"
              >
                Upgrade for more credits
              </button>
            </div>
          </div>

          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">Current plan</span>
            </div>
            <div className="dash-card-body">
              <p className="text-[14px] font-semibold text-white">
                {data.billingSummary?.plan.name ?? "Free Trial"}
              </p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-[var(--dash-muted)]">
                {data.monthlyCredits} credits · {data.billingSummary?.plan.siteLimit ?? 1} site
                {(data.billingSummary?.plan.siteLimit ?? 1) === 1 ? "" : "s"} · Community support
              </p>
              <button
                type="button"
                onClick={() => void data.handleCheckout("basic_plus")}
                className="dash-btn dash-btn-primary mt-3 w-full"
              >
                Upgrade plan
              </button>
            </div>
          </div>

          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">Domains</span>
              <button
                type="button"
                onClick={() => onNavigate("domains")}
                className="text-[11px] text-[var(--dash-muted)] hover:text-[var(--dash-text-secondary)]"
              >
                Manage →
              </button>
            </div>
            {data.connectedDomains.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <Globe size={20} className="mx-auto mb-2 text-[var(--dash-muted)]" />
                <p className="text-[12px] text-[var(--dash-text-secondary)]">No domains connected</p>
                <button
                  type="button"
                  onClick={() => onNavigate("domains")}
                  className="dash-btn mt-2.5 text-[11px]"
                >
                  <Plus size={12} />
                  Connect domain
                </button>
              </div>
            ) : (
              <div className="divide-y divide-[var(--dash-border)]">
                {data.connectedDomains.slice(0, 3).map((d) => (
                  <div key={d.id} className="flex items-center justify-between px-3.5 py-2.5">
                    <span className="truncate font-mono text-[12px] text-[var(--dash-text-secondary)]">
                      {d.domain}
                    </span>
                    <span className={`dash-chip ${chipClassForStatus(d.status)}`}>{d.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {data.totalVisitors > 0 ? (
            <div className="dash-card">
              <div className="dash-card-header">
                <span className="dash-card-title">Visitors</span>
                <Eye size={14} className="text-[var(--dash-muted)]" />
              </div>
              <div className="dash-card-body">
                <p className="text-[22px] font-semibold tabular-nums">
                  {data.totalVisitors.toLocaleString()}
                </p>
                <p className="text-[11px] text-[var(--dash-muted)]">
                  {data.totalViews.toLocaleString()} page views
                </p>
              </div>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
