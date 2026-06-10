"use client";

import { Bell, HelpCircle, Search, Sparkles, Zap } from "lucide-react";
import type { DashboardView } from "./types";
import { VIEW_TITLES, normalizeView } from "./types";
import type { DashboardDataContext } from "./hooks/useDashboardData";

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
  const title = VIEW_TITLES[normalizeView(view)] ?? "Dashboard";

  return (
    <header className="dashboard-topbar">
      <p className="hidden min-w-[120px] text-[13px] font-medium text-[var(--dash-text)] md:block">
        {title}
      </p>

      <div className="flex h-8 max-w-md flex-1 items-center gap-2 rounded-[var(--dash-radius-sm)] border border-[var(--dash-border)] bg-[var(--dash-surface2)] px-2.5">
        <Search size={14} className="shrink-0 text-[var(--dash-muted)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search projects, media, generations…"
          className="w-full border-0 bg-transparent text-[13px] text-[var(--dash-text)] outline-none placeholder:text-[var(--dash-muted)]"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onNavigate("billing")}
          className="hidden items-center gap-1.5 rounded-[var(--dash-radius-sm)] border border-[var(--dash-border)] bg-[var(--dash-surface2)] px-2.5 py-1.5 text-[11px] text-[var(--dash-text-secondary)] transition-colors hover:border-[var(--dash-border-hover)] sm:flex"
        >
          <Zap size={12} />
          <span className="tabular-nums">{data.creditsRemaining.toLocaleString()}</span>
        </button>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-[var(--dash-radius-sm)] border border-[var(--dash-border)] bg-[var(--dash-surface2)] text-[var(--dash-muted)]"
          aria-label="Notifications"
        >
          <Bell size={14} />
        </button>
        <button
          type="button"
          className="hidden h-8 w-8 items-center justify-center rounded-[var(--dash-radius-sm)] border border-[var(--dash-border)] bg-[var(--dash-surface2)] text-[var(--dash-muted)] hover:text-[var(--dash-text-secondary)] sm:flex"
          aria-label="Help"
        >
          <HelpCircle size={14} />
        </button>
        <button
          type="button"
          onClick={() => onNavigate("generate-website")}
          className="dash-btn dash-btn-primary"
        >
          <Sparkles size={13} />
          <span className="hidden sm:inline">Generate</span>
        </button>
      </div>
    </header>
  );
}
