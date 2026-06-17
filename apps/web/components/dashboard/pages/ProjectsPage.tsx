"use client";

import { useMemo, useState } from "react";
import { MoreHorizontal, Pencil, Plus, Search, Upload } from "lucide-react";
import type { DashboardDataContext } from "../hooks/useDashboardData";
import "../overview-projects.css";
import {
  formatShortDate,
  getProjectCardThumbIndex,
  getProjectDomain,
  getProjectStatus,
  getTemplateName,
  projectInitials,
} from "../utils";

export function ProjectsPage({
  data,
  search,
  onSearchChange,
}: {
  data: DashboardDataContext;
  search: string;
  onSearchChange: (value: string) => void;
}) {
  const [filter, setFilter] = useState<"All" | "Live" | "Draft">("All");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const query = search.trim().toLowerCase();

  const filtered = useMemo(() => {
    return data.projects.filter((project) => {
      const site = data.publishedSites.find((s) => s.project_id === project.id);
      const isLive = site?.status === "published";
      if (filter === "Live" && !isLive) return false;
      if (filter === "Draft" && isLive) return false;
      if (query && !project.name.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [data.projects, data.publishedSites, filter, query]);

  return (
    <div className="spec-page">
      <div className="proj-page-header">
        <div>
          <div className="proj-page-title">Projects</div>
          <div className="proj-page-sub">
            {data.projects.length} total · {data.liveSiteCount} published · {data.draftProjectCount}{" "}
            drafts
          </div>
        </div>
        <div className="proj-page-actions">
          {data.localProjectCount > 0 ? (
            <button
              type="button"
              className="btn"
              onClick={() => void data.handleImportLocalProjects()}
              disabled={data.importing}
            >
              <Upload size={13} />
              {data.importing ? "Importing…" : "Import"}
            </button>
          ) : null}
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => data.router.push("/templates")}
          >
            <Plus size={13} />
            New project
          </button>
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-search">
          <Search size={13} className="filter-search-icon" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search projects…"
          />
        </div>
        <div className="filter-divider" />
        {(["All", "Live", "Draft"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            className={`filter-tab ${filter === tab ? "active" : ""}`}
            onClick={() => setFilter(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {exportError ? <p className="gen-error">{exportError}</p> : null}

      {filtered.length === 0 ? (
        <div className="proj-empty">
          <p>No projects found</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => data.router.push("/templates")}
          >
            <Plus size={13} />
            Create your first project
          </button>
        </div>
      ) : (
        <div className="proj-card-grid">
          {filtered.map((project) => {
            const status = getProjectStatus(project, data.publishedSites);
            const domain = getProjectDomain(
              project.id,
              data.publishedSites,
              data.connectedDomains,
            );
            const site = data.publishedSites.find((s) => s.project_id === project.id);
            const templateName = getTemplateName(project);

            return (
              <article key={project.id} className="proj-card">
                <div
                  className={`proj-card-thumb thumb-${getProjectCardThumbIndex(project.id)}`}
                  onClick={() => data.router.push(`/dashboard?view=website-ready&projectId=${project.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      data.router.push(`/dashboard?view=website-ready&projectId=${project.id}`);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  {projectInitials(project.name)}
                  <div className="proj-card-status">
                    <span className={status === "live" ? "chip chip-live" : "chip chip-draft"}>
                      {status === "live" ? "Live" : "Draft"}
                    </span>
                  </div>
                </div>
                <div className="proj-card-body">
                  <div className="proj-card-name">{project.name}</div>
                  <div className="proj-card-meta">
                    {templateName} · {domain?.domain ?? "No domain"} · Edited{" "}
                    {formatShortDate(project.updatedAt)}
                  </div>
                  <div className="proj-card-footer">
                    <button
                      type="button"
                      className="proj-card-open"
                      onClick={() =>
                        data.router.push(`/dashboard?view=website-ready&projectId=${project.id}`)
                      }
                    >
                      <Pencil size={12} />
                      Open website
                    </button>
                    <div className="proj-card-more-wrap">
                      <button
                        type="button"
                        className="proj-card-more"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === project.id ? null : project.id);
                        }}
                        aria-label="More actions"
                      >
                        <MoreHorizontal size={13} />
                      </button>
                      {openMenuId === project.id ? (
                        <div className="proj-card-menu">
                          <button
                            type="button"
                            onClick={() => {
                              setExportError(null);
                              setExportingId(project.id);
                              void data
                                .handleExportProject(project.id, project.name)
                                .catch((error) => {
                                  setExportError(
                                    error instanceof Error ? error.message : "Export failed.",
                                  );
                                })
                                .finally(() => setExportingId(null));
                              setOpenMenuId(null);
                            }}
                          >
                            {exportingId === project.id ? "Exporting…" : "Download ZIP"}
                          </button>
                          {site?.status === "published" ? (
                            <button
                              type="button"
                              onClick={() => {
                                window.open(site.public_url, "_blank", "noopener,noreferrer");
                                setOpenMenuId(null);
                              }}
                            >
                              View live
                            </button>
                          ) : null}
                          {site?.status === "published" ? (
                            <button
                              type="button"
                              onClick={() => {
                                void data.handleUnpublishSite(site.id);
                                setOpenMenuId(null);
                              }}
                            >
                              Unpublish
                            </button>
                          ) : null}
                          <button
                            type="button"
                            className="danger"
                            onClick={() => {
                              void data.handleDeleteProject(project.id);
                              setOpenMenuId(null);
                            }}
                          >
                            Delete project
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
