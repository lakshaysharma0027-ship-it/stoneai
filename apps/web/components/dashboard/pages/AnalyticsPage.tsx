"use client";

import { BarChart3, FileBarChart } from "lucide-react";
import type { DashboardDataContext } from "../hooks/useDashboardData";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { PageHeader } from "../ui/PageHeader";
import { Panel, PanelHead } from "../ui/Panel";
import { StatCard, StatGrid } from "../ui/StatCard";

export function AnalyticsPage({ data }: { data: DashboardDataContext }) {
  const hasData = data.totalViews > 0 || data.totalVisitors > 0;

  const topPages = data.publishedSites
    .map((site) => ({
      title: site.seo_title ?? site.slug,
      views: site.site_analytics?.[0]?.page_views ?? 0,
      url: site.public_url,
    }))
    .filter((page) => page.views > 0)
    .sort((a, b) => b.views - a.views);

  return (
    <>
      <PageHeader
        title="Analytics"
        subtitle="Performance across all published sites"
      />

      <StatGrid>
        <StatCard
          label="Total visitors"
          value={data.totalVisitors > 0 ? data.totalVisitors.toLocaleString() : "—"}
          delta={hasData ? "Unique visitors" : "No data yet"}
        />
        <StatCard
          label="Page views"
          value={data.totalViews > 0 ? data.totalViews.toLocaleString() : "—"}
          delta={hasData ? "Across all sites" : "No data yet"}
        />
        <StatCard label="Bounce rate" value="—" delta="Not tracked yet" />
        <StatCard label="Avg. session" value="—" delta="Not tracked yet" />
      </StatGrid>

      <Panel>
        <PanelHead title="Visitors over time" />
        {hasData ? (
          <div className="flex h-12 items-end gap-0.5 px-4 pb-2 pt-2.5">
            {data.publishedSites.map((site) => {
              const views = site.site_analytics?.[0]?.page_views ?? 0;
              const max = Math.max(...data.publishedSites.map((s) => s.site_analytics?.[0]?.page_views ?? 0), 1);
              const height = Math.max((views / max) * 100, 8);
              return (
                <div
                  key={site.id}
                  className="flex-1 rounded-t-sm bg-[var(--dash-border2)]"
                  style={{ height: `${height}%` }}
                  title={`${site.slug}: ${views} views`}
                />
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={<BarChart3 size={22} />}
            title="No visitor data"
            description="Connect a custom domain and publish your site to start tracking visitors."
          />
        )}
      </Panel>

      <div className="grid gap-3.5 md:grid-cols-2">
        <Panel className="mb-0">
          <PanelHead title="Traffic sources" />
          <EmptyState compact description="Traffic source breakdown is not available yet." />
        </Panel>

        <Panel className="mb-0">
          <PanelHead title="Top pages" />
          {topPages.length === 0 ? (
            <EmptyState compact icon={<FileBarChart size={20} />} description="No page data yet" />
          ) : (
            <div>
              {topPages.map((page) => (
                <div
                  key={page.url}
                  className="flex items-center justify-between border-b border-[var(--dash-border)] px-4 py-2.5 last:border-b-0"
                >
                  <span className="truncate text-xs text-[var(--dash-text)]">{page.title}</span>
                  <span className="text-[11px] text-[var(--dash-hint)]">
                    {page.views.toLocaleString()} views
                  </span>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>

      <Panel className="mt-3.5 mb-0">
        <PanelHead title="Published sites" />
        {data.publishedSites.length === 0 ? (
          <EmptyState title="No published sites" description="Publish a project to see site analytics here." />
        ) : (
          <div>
            {data.publishedSites.map((site) => (
              <div
                key={site.id}
                className="flex flex-wrap items-center gap-2 border-b border-[var(--dash-border)] px-4 py-2.5 last:border-b-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-[var(--dash-text)]">
                    {site.seo_title ?? site.slug}
                  </p>
                  <p className="truncate text-[11px] text-[var(--dash-hint)]">
                    {site.public_url} · {site.site_analytics?.[0]?.page_views ?? 0} views
                  </p>
                </div>
                <Button size="sm" onClick={() => window.open(site.public_url, "_blank", "noopener,noreferrer")}>
                  View
                </Button>
                <Button size="sm" onClick={() => data.router.push(`/editor/${site.project_id}`)}>
                  Edit
                </Button>
                <Button size="sm" onClick={() => void data.handleUnpublishSite(site.id)}>
                  Unpublish
                </Button>
                <Button size="sm" onClick={() => void data.handleDeleteSite(site.id)}>
                  Delete
                </Button>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </>
  );
}
