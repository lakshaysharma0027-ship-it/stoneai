"use client";

import { useMemo, useState } from "react";
import { Plus, Upload } from "lucide-react";
import type { DashboardDataContext } from "../hooks/useDashboardData";
import { ProjectCard } from "../ui/ProjectCard";

export function ProjectsPage({
  data,
  search,
}: {
  data: DashboardDataContext;
  search: string;
}) {
  const [filter, setFilter] = useState<"All" | "Live" | "Draft">("All");
  const [localSearch, setLocalSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const query = (search || localSearch).trim().toLowerCase();

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
    <div className="dashboard-content-inner">
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[18px] font-semibold tracking-[-0.03em] text-white">Projects</h1>
          <p className="mt-0.5 text-[12px] text-[var(--dash-muted)]">
            {data.projects.length} total · {data.liveSiteCount} published · {data.draftProjectCount}{" "}
            drafts
          </p>
        </div>
        <div className="flex gap-2">
          {data.localProjectCount > 0 ? (
            <button
              type="button"
              onClick={() => void data.handleImportLocalProjects()}
              disabled={data.importing}
              className="dash-btn"
            >
              <Upload size={13} />
              Import
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => data.router.push("/templates")}
            className="dash-btn dash-btn-primary"
          >
            <Plus size={13} />
            New project
          </button>
        </div>
      </header>

      <div className="dash-card mb-3 flex flex-wrap items-center gap-2 px-3 py-2">
        <input
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Search projects…"
          className="dash-input h-8 max-w-[220px] text-[12px]"
        />
        <div className="ml-auto flex gap-1">
          {(["All", "Live", "Draft"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`rounded-[6px] px-2.5 py-1 text-[11px] font-medium transition-colors ${
                filter === tab
                  ? "bg-[var(--dash-surface3)] text-white"
                  : "text-[var(--dash-muted)] hover:text-[var(--dash-text-secondary)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="dash-card px-6 py-14 text-center">
          <p className="text-[13px] text-[var(--dash-text-secondary)]">No projects found</p>
          <button
            type="button"
            onClick={() => data.router.push("/templates")}
            className="dash-btn dash-btn-primary mt-3"
          >
            Create your first project
          </button>
        </div>
      ) : (
        <div className="dash-projects-grid">
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              data={data}
              menuOpen={openMenuId === project.id}
              onMenuToggle={() =>
                setOpenMenuId(openMenuId === project.id ? null : project.id)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
