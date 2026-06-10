"use client";

import { BarChart3, ExternalLink, MoreHorizontal, Pencil } from "lucide-react";
import type { StoredProject } from "@/lib/projects";
import type { DashboardDataContext } from "../hooks/useDashboardData";
import {
  chipClassForStatus,
  formatShortDate,
  getProjectDomain,
  getProjectStatus,
  getProjectTraffic,
  getTemplateName,
  projectInitials,
} from "../utils";

export function ProjectCard({
  project,
  data,
  onMenuToggle,
  menuOpen,
}: {
  project: StoredProject;
  data: DashboardDataContext;
  onMenuToggle: () => void;
  menuOpen: boolean;
}) {
  const status = getProjectStatus(project, data.publishedSites);
  const domain = getProjectDomain(project.id, data.publishedSites, data.connectedDomains);
  const traffic = getProjectTraffic(project.id, data.publishedSites);
  const site = data.publishedSites.find((s) => s.project_id === project.id);

  return (
    <article className="dash-card dash-card-lift group relative flex flex-col overflow-hidden">
      <button
        type="button"
        onClick={() => data.router.push(`/editor/${project.id}`)}
        className="relative flex h-[120px] w-full cursor-pointer items-center justify-center border-b border-[var(--dash-border)] bg-gradient-to-br from-[var(--dash-surface2)] to-[var(--dash-surface)]"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-[var(--dash-border)] bg-[var(--dash-surface3)] text-sm font-semibold text-[var(--dash-text-secondary)]">
          {projectInitials(project.name)}
        </span>
      </button>

      <div className="flex flex-1 flex-col p-3.5">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-[13px] font-medium text-[var(--dash-text)]">
              {project.name}
            </h3>
            <p className="truncate text-[11px] text-[var(--dash-muted)]">
              {getTemplateName(project)}
            </p>
          </div>
          <span className={`dash-chip shrink-0 ${chipClassForStatus(status)}`}>
            {status === "live" ? "Live" : "Draft"}
          </span>
        </div>

        <div className="mb-3 space-y-1 text-[11px] text-[var(--dash-muted)]">
          <p className="truncate">{domain?.domain ?? "No domain"}</p>
          <p>Edited {formatShortDate(project.updatedAt)}</p>
          {traffic !== null && traffic > 0 ? <p>{traffic.toLocaleString()} views</p> : null}
        </div>

        <div className="mt-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => data.router.push(`/editor/${project.id}`)}
            className="dash-btn dash-btn-primary flex-1 text-[11px]"
          >
            <Pencil size={12} />
            Open editor
          </button>
          {site?.status === "published" ? (
            <button
              type="button"
              onClick={() => data.router.push("/dashboard?view=analytics")}
              className="dash-btn px-2"
              title="View analytics"
            >
              <BarChart3 size={13} />
            </button>
          ) : null}
          <div className="relative">
            <button type="button" onClick={onMenuToggle} className="dash-btn px-2">
              <MoreHorizontal size={14} />
            </button>
            {menuOpen ? (
              <div className="absolute right-0 top-9 z-20 min-w-[148px] rounded-[var(--dash-radius-sm)] border border-[var(--dash-border)] bg-[var(--dash-surface2)] py-1 shadow-xl">
                {site?.status === "published" ? (
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-[var(--dash-text-secondary)] hover:bg-[var(--dash-surface3)]"
                    onClick={() => window.open(site.public_url, "_blank", "noopener,noreferrer")}
                  >
                    <ExternalLink size={12} />
                    View live
                  </button>
                ) : null}
                <button
                  type="button"
                  className="w-full px-3 py-1.5 text-left text-xs text-[var(--dash-red)] hover:bg-[var(--dash-surface3)]"
                  onClick={() => void data.handleDeleteProject(project.id)}
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
}
