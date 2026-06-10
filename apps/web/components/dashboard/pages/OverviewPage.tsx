"use client";

import { ArrowRight, ArrowUpRight, Globe, Plus, Sparkles } from "lucide-react";
import type { DashboardDataContext } from "../hooks/useDashboardData";
import { Button } from "../ui/Button";
import { Chip } from "../ui/Chip";
import { EmptyState } from "../ui/EmptyState";
import { PageHeader } from "../ui/PageHeader";
import { Panel, PanelHead, PanelLink } from "../ui/Panel";
import { StatCard, StatGrid } from "../ui/StatCard";
import {
  formatShortDate,
  getProjectStatus,
  getTemplateName,
  projectInitials,
} from "../utils";
import type { DashboardView } from "../types";

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

  const recentProjects = data.projects.slice(0, 4);
  const recentGenerations = [
    ...data.aiHistory.slice(0, 3).map((item) => ({
      id: item.id,
      title: item.prompt.slice(0, 80),
      meta: `${formatShortDate(item.created_at)} · Website generation`,
      type: "website" as const,
      status: "completed",
    })),
    ...data.mediaHistory.slice(0, 3).map((item) => ({
      id: item.id,
      title: item.prompt.slice(0, 80),
      meta: `${formatShortDate(item.created_at)} · ${item.credits_used} credits · ${item.media_type === "image" ? "Image" : "Video"}`,
      type: item.media_type,
      status: item.status,
    })),
  ]
    .slice(0, 3);

  const creditsRemainingPercent =
    data.monthlyCredits > 0
      ? Math.round((data.creditsRemaining / data.monthlyCredits) * 100)
      : 0;

  return (
    <>
      <PageHeader
        title="Overview"
        subtitle={`${today} — ${data.billingSummary?.plan.name ?? "Free Trial"}`}
        action={
          <Button variant="primary" onClick={() => onNavigate("generate")}>
            <Sparkles size={13} />
            Generate with AI
          </Button>
        }
      />

      {data.localProjectCount > 0 ? (
        <Panel className="mb-3.5">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="text-xs font-medium text-[var(--dash-text)]">Import local projects</p>
              <p className="mt-0.5 text-[11px] text-[var(--dash-hint)]">
                Move {data.localProjectCount} local project
                {data.localProjectCount === 1 ? "" : "s"} into your account.
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => void data.handleImportLocalProjects()}
              disabled={data.importing}
            >
              {data.importing ? "Importing…" : "Import"}
            </Button>
          </div>
        </Panel>
      ) : null}

      <StatGrid>
        <StatCard
          label="Projects"
          value={data.projects.length}
          delta={`${data.projects.length} total`}
        />
        <StatCard
          label="Published sites"
          value={data.liveSiteCount}
          delta={data.liveSiteCount ? `${data.liveSiteCount} live right now` : "None published yet"}
          deltaTone={data.liveSiteCount ? "up" : "neutral"}
        />
        <StatCard
          label="Credits remaining"
          value={data.creditsRemaining.toLocaleString()}
          delta={`${data.creditsUsed} of ${data.monthlyCredits} used`}
          barPercent={creditsRemainingPercent}
          barTone={
            creditsRemainingPercent <= 20
              ? "danger"
              : creditsRemainingPercent <= 50
                ? "warn"
                : "default"
          }
        />
        <StatCard
          label="Total visitors"
          value={data.totalVisitors > 0 ? data.totalVisitors.toLocaleString() : "—"}
          delta={
            data.totalVisitors > 0
              ? "Across published sites"
              : "Connect a domain to track"
          }
        />
      </StatGrid>

      <div className="grid gap-3.5 xl:grid-cols-[1fr_300px]">
        <div>
          <Panel>
            <PanelHead
              title="Recent projects"
              action={<PanelLink onClick={() => onNavigate("projects")}>View all →</PanelLink>}
            />
            {recentProjects.length === 0 ? (
              <EmptyState
                title="No projects yet"
                description="Start from blank or a template."
                action={
                  <Button onClick={() => data.router.push("/templates")}>
                    <Plus size={13} />
                    New project
                  </Button>
                }
              />
            ) : (
              <>
                {recentProjects.map((project) => {
                  const status = getProjectStatus(project, data.publishedSites);
                  return (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => data.router.push(`/editor/${project.id}`)}
                      className="flex w-full cursor-pointer items-center gap-3 border-b border-[var(--dash-border)] px-4 py-2.5 text-left transition-colors last:border-b-0 hover:bg-[var(--dash-surface2)]"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--dash-radius)] border border-[var(--dash-border)] bg-[var(--dash-surface2)] text-[11px] font-semibold text-[var(--dash-muted)]">
                        {projectInitials(project.name)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-medium text-[var(--dash-text)]">
                          {project.name}
                        </span>
                        <span className="block text-[11px] text-[var(--dash-hint)]">
                          {getTemplateName(project)} · Updated {formatShortDate(project.updatedAt)}
                        </span>
                      </span>
                      <span className="flex items-center gap-2">
                        <Chip variant={status === "live" ? "live" : "draft"}>
                          {status === "live" ? "Live" : "Draft"}
                        </Chip>
                        <ArrowRight size={12} className="text-[var(--dash-hint)]" />
                      </span>
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => data.router.push("/templates")}
                  className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left opacity-45 hover:opacity-70"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--dash-radius)] border border-dashed border-[var(--dash-border)] bg-[var(--dash-surface2)] text-[var(--dash-hint)]">
                    +
                  </span>
                  <span>
                    <span className="block text-xs text-[var(--dash-hint)]">New project</span>
                    <span className="block text-[11px] text-[var(--dash-hint)]">
                      Start from blank or a template
                    </span>
                  </span>
                </button>
              </>
            )}
          </Panel>

          <Panel>
            <PanelHead
              title="Recent AI generations"
              action={<PanelLink onClick={() => onNavigate("generate")}>View all →</PanelLink>}
            />
            {recentGenerations.length === 0 ? (
              <EmptyState
                title="No generations yet"
                description="Generate a website, image, or video to see history here."
              />
            ) : (
              recentGenerations.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 border-b border-[var(--dash-border)] px-4 py-2.5 last:border-b-0"
                >
                  <span className="flex h-7 w-10 shrink-0 items-center justify-center rounded border border-[var(--dash-border)] bg-[var(--dash-surface2)] text-[var(--dash-hint)]">
                    {item.type === "website" ? <Globe size={13} /> : <Sparkles size={13} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-medium text-[var(--dash-text)]">
                      {item.title}
                    </span>
                    <span className="block text-[11px] text-[var(--dash-hint)]">{item.meta}</span>
                  </span>
                  <Chip variant={item.status === "completed" ? "live" : "build"}>
                    {item.status === "completed" ? "Done" : item.status}
                  </Chip>
                </div>
              ))
            )}
          </Panel>
        </div>

        <div className="flex flex-col gap-3.5">
          <Panel className="mb-0">
            <PanelHead title="Credits" />
            <div className="px-4 py-3.5">
              <p className="text-[30px] font-semibold tracking-[-1.5px] text-[var(--dash-white)]">
                {data.creditsRemaining.toLocaleString()}
              </p>
              <p className="text-xs text-[var(--dash-hint)]">
                of {data.monthlyCredits.toLocaleString()} remaining
              </p>
              <div className="my-3 h-[3px] overflow-hidden rounded-sm bg-[var(--dash-border)]">
                <div
                  className="h-full rounded-sm bg-[var(--dash-white)] transition-all duration-1000"
                  style={{ width: `${creditsRemainingPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[var(--dash-hint)]">
                <span>{data.creditsUsed} used</span>
                <span>{data.creditsRemaining} free</span>
              </div>
              <Button
                variant="primary"
                fullWidth
                className="mt-3.5"
                onClick={() => onNavigate("billing")}
              >
                Upgrade for more credits
              </Button>
            </div>
          </Panel>

          <Panel className="mb-0">
            <PanelHead title="Current plan" />
            <div className="px-4 py-3.5">
              <p className="mb-1.5 text-[15px] font-semibold text-[var(--dash-white)]">
                {data.billingSummary?.plan.name ?? "Free Trial"}
              </p>
              <p className="text-xs leading-relaxed text-[var(--dash-hint)]">
                {data.monthlyCredits} credits · {data.billingSummary?.plan.siteLimit ?? 1} published
                site{(data.billingSummary?.plan.siteLimit ?? 1) === 1 ? "" : "s"} ·{" "}
                {data.connectedDomains.length ? "Custom domains" : "No custom domains"} · Community
                support
              </p>
              <Button
                variant="primary"
                fullWidth
                className="mt-3.5"
                onClick={() => void data.handleCheckout("basic_plus")}
              >
                <ArrowUpRight size={13} />
                Upgrade plan
              </Button>
            </div>
          </Panel>

          <Panel className="mb-0">
            <PanelHead
              title="Domains"
              action={<PanelLink onClick={() => onNavigate("domains")}>Manage →</PanelLink>}
            />
            {data.connectedDomains.length === 0 ? (
              <EmptyState
                compact
                icon={<Globe size={22} />}
                title="No domains connected"
                description="Add a custom domain to go live on your own URL."
                action={
                  <Button size="sm" onClick={() => onNavigate("domains")}>
                    <Plus size={12} />
                    Connect domain
                  </Button>
                }
              />
            ) : (
              <div className="divide-y divide-[var(--dash-border)]">
                {data.connectedDomains.slice(0, 3).map((domain) => (
                  <div key={domain.id} className="px-4 py-2.5 text-xs text-[var(--dash-text)]">
                    {domain.domain}
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}
