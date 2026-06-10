"use client";

import { useMemo, useState } from "react";
import { MoreHorizontal, Plus, Upload } from "lucide-react";
import type { DashboardDataContext } from "../hooks/useDashboardData";
import { Button } from "../ui/Button";
import { Chip } from "../ui/Chip";
import { DashInput, FilterBar, FilterTabs } from "../ui/FilterBar";
import { PageHeader } from "../ui/PageHeader";
import { Panel } from "../ui/Panel";
import {
  formatShortDate,
  getProjectDomain,
  getProjectStatus,
  getProjectTraffic,
  projectInitials,
} from "../utils";

export function ProjectsPage({
  data,
  search,
}: {
  data: DashboardDataContext;
  search: string;
}) {
  const [filter, setFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const query = (search || projectFilter).trim().toLowerCase();

  const filtered = useMemo(() => {
    return data.projects.filter((project) => {
      const status = getProjectStatus(project, data.publishedSites);
      if (filter === "Live" && status !== "live") return false;
      if (filter === "Draft" && status !== "draft") return false;
      if (query && !project.name.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [data.projects, data.publishedSites, filter, query]);

  return (
    <>
      <PageHeader
        title="Projects"
        subtitle={`${data.projects.length} total · ${data.liveSiteCount} published · ${data.draftProjectCount} drafts`}
        action={
          <div className="flex gap-2">
            {data.localProjectCount > 0 ? (
              <Button onClick={() => void data.handleImportLocalProjects()} disabled={data.importing}>
                <Upload size={13} />
                Import
              </Button>
            ) : null}
            <Button variant="primary" onClick={() => data.router.push("/templates")}>
              <Plus size={13} />
              New project
            </Button>
          </div>
        }
      />

      <Panel className="mb-0">
        <FilterBar>
          <DashInput
            value={projectFilter}
            onChange={setProjectFilter}
            placeholder="Filter projects…"
            className="h-7 w-[200px]"
          />
          <FilterTabs tabs={["All", "Live", "Draft"]} active={filter} onChange={setFilter} />
        </FilterBar>

        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr className="border-b border-[var(--dash-border)] text-left text-[11px] text-[var(--dash-hint)]">
                <th className="w-[30%] px-4 py-2 font-normal">Name</th>
                <th className="w-[12%] px-4 py-2 font-normal">Status</th>
                <th className="w-[18%] px-4 py-2 font-normal">Last updated</th>
                <th className="w-[20%] px-4 py-2 font-normal">Domain</th>
                <th className="w-[12%] px-4 py-2 font-normal">Traffic</th>
                <th className="w-[8%] px-4 py-2 font-normal" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((project) => {
                const status = getProjectStatus(project, data.publishedSites);
                const domain = getProjectDomain(project.id, data.publishedSites, data.connectedDomains);
                const traffic = getProjectTraffic(project.id, data.publishedSites);
                const site = data.publishedSites.find((s) => s.project_id === project.id);

                return (
                  <tr
                    key={project.id}
                    className="border-b border-[var(--dash-border)] last:border-b-0 hover:bg-[var(--dash-surface2)]"
                  >
                    <td className="px-4 py-2.5">
                      <button
                        type="button"
                        onClick={() => data.router.push(`/editor/${project.id}`)}
                        className="flex cursor-pointer items-center gap-2 text-left"
                      >
                        <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[var(--dash-radius-sm)] border border-[var(--dash-border)] bg-[var(--dash-surface2)] text-[10px] font-semibold">
                          {projectInitials(project.name)}
                        </span>
                        <span className="text-xs font-medium text-[var(--dash-text)]">
                          {project.name}
                        </span>
                      </button>
                    </td>
                    <td className="px-4 py-2.5">
                      <Chip variant={status === "live" ? "live" : "draft"}>
                        {status === "live" ? "Live" : "Draft"}
                      </Chip>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-[var(--dash-muted)]">
                      {formatShortDate(project.updatedAt)}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[11px] text-[var(--dash-hint)]">
                      {domain?.domain ?? "—"}
                    </td>
                    <td className="px-4 py-2.5 text-[11px] text-[var(--dash-hint)]">
                      {traffic !== null && traffic > 0 ? traffic.toLocaleString() : "—"}
                    </td>
                    <td className="relative px-4 py-2.5">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenuId(openMenuId === project.id ? null : project.id)
                        }
                        className="cursor-pointer text-[var(--dash-hint)] hover:text-[var(--dash-text)]"
                      >
                        <MoreHorizontal size={14} />
                      </button>
                      {openMenuId === project.id ? (
                        <div className="absolute right-4 top-10 z-10 min-w-[140px] rounded-[var(--dash-radius)] border border-[var(--dash-border)] bg-[var(--dash-surface2)] py-1 shadow-lg">
                          <button
                            type="button"
                            className="block w-full cursor-pointer px-3 py-1.5 text-left text-xs hover:bg-[var(--dash-surface3)]"
                            onClick={() => {
                              data.router.push(`/editor/${project.id}`);
                              setOpenMenuId(null);
                            }}
                          >
                            Open editor
                          </button>
                          {site?.status === "published" ? (
                            <>
                              <button
                                type="button"
                                className="block w-full cursor-pointer px-3 py-1.5 text-left text-xs hover:bg-[var(--dash-surface3)]"
                                onClick={() => {
                                  window.open(site.public_url, "_blank", "noopener,noreferrer");
                                  setOpenMenuId(null);
                                }}
                              >
                                View live
                              </button>
                              <button
                                type="button"
                                className="block w-full cursor-pointer px-3 py-1.5 text-left text-xs hover:bg-[var(--dash-surface3)]"
                                onClick={() => {
                                  void data.handleUnpublishSite(site.id);
                                  setOpenMenuId(null);
                                }}
                              >
                                Unpublish
                              </button>
                            </>
                          ) : null}
                          <button
                            type="button"
                            className="block w-full cursor-pointer px-3 py-1.5 text-left text-xs text-[var(--dash-red)] hover:bg-[var(--dash-surface3)]"
                            disabled={data.deletingProjectId === project.id}
                            onClick={() => {
                              void data.handleDeleteProject(project.id);
                              setOpenMenuId(null);
                            }}
                          >
                            {data.deletingProjectId === project.id ? "Deleting…" : "Delete"}
                          </button>
                        </div>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
              <tr className="hover:bg-[var(--dash-surface2)]">
                <td className="px-4 py-2.5" colSpan={6}>
                  <button
                    type="button"
                    onClick={() => data.router.push("/templates")}
                    className="flex cursor-pointer items-center gap-2 text-[var(--dash-hint)]"
                  >
                    <span className="flex h-[26px] w-[26px] items-center justify-center rounded-[var(--dash-radius-sm)] border border-dashed border-[var(--dash-border)]">
                      +
                    </span>
                    <span className="text-xs">New project</span>
                    <span className="text-[11px]">· Start from blank or a template</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
