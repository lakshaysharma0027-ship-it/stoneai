"use client";

import { Bell, HelpCircle, Search, Sparkles, Zap } from "lucide-react";
import type { DashboardView } from "./types";
import type { DashboardDataContext } from "./hooks/useDashboardData";
import { Button } from "./ui/Button";

const viewTitles: Record<DashboardView, string> = {
  overview: "Overview",
  projects: "Projects",
  generate: "AI Generation",
  templates: "Templates",
  media: "Media library",
  domains: "Domains",
  analytics: "Analytics",
  billing: "Billing",
  team: "Team",
  settings: "Settings",
};

export function DashboardTopbar({
  view,
  search,
  onSearchChange,
  onNavigate,
  data,
}: {
  view: DashboardView;
  search: string;
  onSearchChange: (value: string) => void;
  onNavigate: (view: DashboardView) => void;
  data: DashboardDataContext;
}) {
  return (
    <header className="dashboard-topbar">
      <div className="flex h-[30px] max-w-[260px] flex-1 items-center gap-1.5 rounded-[var(--dash-radius)] border border-[var(--dash-border)] bg-[var(--dash-surface2)] px-2.5">
        <Search size={13} className="shrink-0 text-[var(--dash-hint)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search projects, media, generations…"
          className="w-full border-0 bg-transparent text-xs text-[var(--dash-text)] outline-none placeholder:text-[var(--dash-hint)]"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onNavigate("billing")}
          className="flex cursor-pointer items-center gap-1 rounded-[var(--dash-radius)] border border-[var(--dash-border)] bg-[var(--dash-surface2)] px-2.5 py-1 text-[11px] text-[var(--dash-muted)] transition-colors hover:border-[var(--dash-border2)] hover:text-[var(--dash-text)]"
        >
          <Zap size={12} />
          {data.creditsRemaining.toLocaleString()} credits
        </button>
        <button
          type="button"
          className="relative flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[var(--dash-radius)] border border-[var(--dash-border)] bg-[var(--dash-surface2)] text-[var(--dash-hint)]"
          aria-label="Notifications"
        >
          <Bell size={14} />
        </button>
        <button
          type="button"
          className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[var(--dash-radius)] border border-[var(--dash-border)] bg-[var(--dash-surface2)] text-[var(--dash-hint)] hover:border-[var(--dash-border2)] hover:text-[var(--dash-text)]"
          aria-label="Help"
        >
          <HelpCircle size={14} />
        </button>
        <Button variant="primary" onClick={() => onNavigate("generate")}>
          <Sparkles size={13} />
          Generate
        </Button>
      </div>

      <span className="sr-only">Current view: {viewTitles[view]}</span>
    </header>
  );
}
