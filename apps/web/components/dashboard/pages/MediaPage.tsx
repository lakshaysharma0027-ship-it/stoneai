"use client";

import { useMemo, useState } from "react";
import { Image, Play, Sparkles, Upload } from "lucide-react";
import type { DashboardDataContext } from "../hooks/useDashboardData";
import { Button } from "../ui/Button";
import { DashInput, DashSelect, FilterBar, FilterTabs } from "../ui/FilterBar";
import { PageHeader } from "../ui/PageHeader";
import { Panel } from "../ui/Panel";
import type { DashboardView } from "../types";

export function MediaPage({
  data,
  search,
  onNavigate,
}: {
  data: DashboardDataContext;
  search: string;
  onNavigate: (view: DashboardView) => void;
}) {
  const [filter, setFilter] = useState("All");
  const [localSearch, setLocalSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const query = (search || localSearch).trim().toLowerCase();

  const filtered = useMemo(() => {
    let items = [...data.mediaHistory];
    if (filter === "Images") items = items.filter((i) => i.media_type === "image");
    if (filter === "Videos") items = items.filter((i) => i.media_type === "video");
    if (query) items = items.filter((i) => i.prompt.toLowerCase().includes(query));
    if (sort === "oldest") items.reverse();
    return items;
  }, [data.mediaHistory, filter, query, sort]);

  const fileLabel = (prompt: string, index: number) => {
    const slug = prompt
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 24);
    return slug ? `${slug}-${index}.png` : `media-${index}.png`;
  };

  return (
    <>
      <PageHeader
        title="Media library"
        subtitle={`${data.mediaHistory.length} file${data.mediaHistory.length === 1 ? "" : "s"}`}
        action={
          <div className="flex gap-2">
            <Button onClick={() => onNavigate("generate")}>
              <Upload size={13} />
              Upload
            </Button>
            <Button variant="primary" onClick={() => onNavigate("generate")}>
              <Sparkles size={13} />
              Generate image
            </Button>
          </div>
        }
      />

      <Panel className="mb-0">
        <FilterBar>
          <DashInput
            value={localSearch}
            onChange={setLocalSearch}
            placeholder="Search media…"
            className="h-7 w-[180px]"
          />
          <FilterTabs
            tabs={["All", "Images", "Videos"]}
            active={filter}
            onChange={setFilter}
          />
          <DashSelect
            value={sort}
            onChange={setSort}
            className="ml-1.5 h-7 text-[11px]"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </DashSelect>
        </FilterBar>

        <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
          {filtered.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (item.asset_url) window.open(item.asset_url, "_blank", "noopener,noreferrer");
              }}
              className="relative flex aspect-[4/3] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[var(--dash-radius)] border border-[var(--dash-border)] bg-[var(--dash-surface2)] transition-colors hover:border-[var(--dash-border2)]"
            >
              {item.asset_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.asset_url}
                  alt={item.prompt}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <>
                  {item.media_type === "video" ? (
                    <Play size={18} className="text-[var(--dash-hint)]" />
                  ) : (
                    <Image size={18} className="text-[var(--dash-hint)]" />
                  )}
                </>
              )}
              <span className="absolute bottom-0 left-0 right-0 truncate bg-black/60 px-1.5 py-1 text-[10px] text-[var(--dash-muted)]">
                {fileLabel(item.prompt, index)}
              </span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => onNavigate("generate")}
            className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center rounded-[var(--dash-radius)] border border-dashed border-[var(--dash-border)] bg-[var(--dash-surface2)] opacity-50 hover:opacity-70"
          >
            <Upload size={18} className="text-[var(--dash-hint)]" />
          </button>
        </div>
      </Panel>
    </>
  );
}
