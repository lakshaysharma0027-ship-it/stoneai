"use client";

import { BarChart3, Clock, FileBarChart, LineChart } from "lucide-react";
import type { DashboardDataContext } from "../hooks/useDashboardData";
import { buildActivityFeed } from "../analytics/buildActivityFeed";
import "../domains-analytics.css";
import { formatShortDate } from "../utils";

export function AnalyticsPage({ data }: { data: DashboardDataContext }) {
  const hasVisitorData = data.totalViews > 0 || data.totalVisitors > 0;
  const creditsConsumed = data.creditsUsed;
  const publishedCount = data.publishedSites.filter((s) => s.status === "published").length;
  const domainCount = data.connectedDomains.length;

  const topPages = data.publishedSites
    .map((site) => ({
      id: site.id,
      title: site.seo_title ?? site.slug,
      views: site.site_analytics?.[0]?.page_views ?? 0,
      url: site.public_url,
      lastVisit: site.site_analytics?.[0]?.last_visit,
      status: site.status,
    }))
    .sort((a, b) => b.views - a.views);

  const topPagesWithViews = topPages.filter((page) => page.views > 0);
  const maxViews = Math.max(...topPages.map((p) => p.views), 1);

  const activity = buildActivityFeed({
    publishedSites: data.publishedSites,
    connectedDomains: data.connectedDomains,
    aiHistory: data.aiHistory,
    creditTransactions: data.creditTransactions,
  });

  const getDomainForSite = (siteId: string) =>
    data.connectedDomains.find((domain) => domain.siteId === siteId)?.domain ?? "—";

  return (
    <div className="da-page">
      <header className="pg-header">
        <h1>Analytics</h1>
        <p>Performance across all published sites</p>
      </header>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Total visitors</div>
          {hasVisitorData ? (
            <div className="metric-value">{data.totalVisitors.toLocaleString()}</div>
          ) : (
            <div className="metric-dash" />
          )}
          <div className="metric-sub">{hasVisitorData ? "Unique visitors" : "No data yet"}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Page views</div>
          {hasVisitorData ? (
            <div className="metric-value">{data.totalViews.toLocaleString()}</div>
          ) : (
            <div className="metric-dash" />
          )}
          <div className="metric-sub">{hasVisitorData ? "Across all sites" : "No data yet"}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Published sites</div>
          <div className="metric-value">{publishedCount}</div>
          <div className="metric-sub">{domainCount} connected domain{domainCount === 1 ? "" : "s"}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Credits consumed</div>
          <div className="metric-value">{creditsConsumed.toLocaleString()}</div>
          <div className="metric-sub">This billing period</div>
        </div>
      </div>

      <div className="analytics-row">
        <div className="section-card">
          <div className="card-header">
            <h2>Visitors over time</h2>
          </div>
          {hasVisitorData ? (
            <div className="chart-bars-wrap">
              <div className="chart-bars">
                {topPages
                  .filter((page) => page.views > 0)
                  .map((page) => (
                    <div key={page.id} className="chart-bar-col">
                      <div className="chart-bar-track">
                        <div
                          className="chart-bar"
                          data-h={Math.max(8, Math.round((page.views / maxViews) * 100))}
                          title={`${page.title}: ${page.views} views`}
                        />
                      </div>
                      <div className="chart-bar-label">{page.title}</div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="chart-placeholder">
              <div className="chart-icon">
                <LineChart size={18} />
              </div>
              <div className="chart-placeholder-title">No visitor data</div>
              <div className="chart-placeholder-sub">
                Data will appear after your first visitors arrive. Publish your site and share the
                URL to start tracking.
              </div>
            </div>
          )}
        </div>

        <div className="section-card">
          <div className="card-header">
            <h2>Traffic sources</h2>
          </div>
          <div className="chart-placeholder">
            <div className="chart-icon">
              <Clock size={18} />
            </div>
            <div className="chart-placeholder-sub">
              Traffic source breakdown is not available yet.
            </div>
          </div>

          <div className="top-pages-inner">
            <div className="card-header top-pages-header">
              <h2>Top pages</h2>
            </div>
            {topPagesWithViews.length === 0 ? (
              <div className="chart-placeholder chart-placeholder-compact">
                <div className="chart-icon">
                  <FileBarChart size={18} />
                </div>
                <span className="chart-placeholder-sub">No page data yet</span>
              </div>
            ) : (
              topPagesWithViews.map((page) => (
                <div key={page.id} className="top-page-row">
                  <span className="top-page-name">{page.title}</span>
                  <span className="top-page-views">{page.views.toLocaleString()} views</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="section-card">
        <div className="card-header">
          <h2>Published sites</h2>
          <small>
            {data.publishedSites.length} site{data.publishedSites.length === 1 ? "" : "s"} ·{" "}
            {data.totalViews.toLocaleString()} total views
          </small>
        </div>
        {data.publishedSites.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <BarChart3 size={18} />
            </div>
            <h3>No published sites</h3>
            <p>Publish a project to see site analytics here.</p>
          </div>
        ) : (
          <table className="sites-table">
            <thead>
              <tr>
                <th>Site</th>
                <th>URL</th>
                <th>Views</th>
                <th>Last visit</th>
                <th>Domain</th>
                <th>Status</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {topPages.map((site) => (
                <tr key={site.id}>
                  <td>
                    <div className="site-name">{site.title}</div>
                  </td>
                  <td>
                    <div className="site-url">{site.url}</div>
                  </td>
                  <td className="site-views">{site.views.toLocaleString()}</td>
                  <td className="site-views">
                    {site.lastVisit ? formatShortDate(site.lastVisit) : "—"}
                  </td>
                  <td className="site-views">{getDomainForSite(site.id)}</td>
                  <td>
                    <span className={`tag ${site.status === "published" ? "tag-live" : "tag-disconnected"}`}>
                      {site.status === "published" ? "Live" : site.status}
                    </span>
                  </td>
                  <td className="actions-col">
                    <div className="table-actions">
                      <button
                        type="button"
                        onClick={() => window.open(site.url, "_blank", "noopener,noreferrer")}
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const published = data.publishedSites.find((s) => s.id === site.id);
                          if (published) data.router.push(`/editor/${published.project_id}`);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void data.handleUnpublishSite(site.id)}
                      >
                        Unpublish
                      </button>
                      <button
                        type="button"
                        className="danger"
                        onClick={() => void data.handleDeleteSite(site.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="section-card">
        <div className="card-header">
          <h2>Recent activity</h2>
          <small>{activity.length} events</small>
        </div>
        {activity.length === 0 ? (
          <div className="empty-state empty-state-compact">
            <div className="chart-icon">
              <BarChart3 size={18} />
            </div>
            <h3>No activity yet</h3>
            <p>Publish a site, connect a domain, or run a generation to see activity here.</p>
          </div>
        ) : (
          activity.map((item) => (
            <div key={item.id} className="activity-row">
              <span className="activity-dot" aria-hidden />
              <div>
                <div className="activity-title">{item.title}</div>
                <div className="activity-meta">{item.meta}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
