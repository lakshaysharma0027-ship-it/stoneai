"use client";

import {
  BarChart3,
  Camera,
  CreditCard,
  Folder,
  Globe,
  Home,
  LayoutGrid,
  Play,
  Settings,
  Sparkles,
  Zap,
} from "lucide-react";
import type { DashboardView } from "./types";
import { normalizeView } from "./types";
import type { DashboardDataContext } from "./hooks/useDashboardData";

type NavItem = {
  id: DashboardView;
  label: string;
  icon: React.ReactNode;
  count?: number;
};

const groups: Array<{ label: string; items: NavItem[] }> = [
  {
    label: "Workspace",
    items: [
      { id: "overview", label: "Overview", icon: <Home size={15} strokeWidth={1.75} /> },
      { id: "projects", label: "Projects", icon: <Folder size={15} strokeWidth={1.75} /> },
      { id: "templates", label: "Templates", icon: <LayoutGrid size={15} strokeWidth={1.75} /> },
    ],
  },
  {
    label: "AI",
    items: [
      { id: "generate-website", label: "Website Generation", icon: <Sparkles size={15} strokeWidth={1.75} /> },
      { id: "generate-image", label: "Image Generation", icon: <Camera size={15} strokeWidth={1.75} /> },
      { id: "generate-video", label: "Video Generation", icon: <Play size={15} strokeWidth={1.75} /> },
    ],
  },
  {
    label: "Publish",
    items: [
      { id: "domains", label: "Domains", icon: <Globe size={15} strokeWidth={1.75} /> },
      { id: "analytics", label: "Analytics", icon: <BarChart3 size={15} strokeWidth={1.75} /> },
    ],
  },
  {
    label: "Account",
    items: [
      { id: "billing", label: "Billing", icon: <CreditCard size={15} strokeWidth={1.75} /> },
      { id: "settings", label: "Settings", icon: <Settings size={15} strokeWidth={1.75} /> },
    ],
  },
];

const isActive = (view: DashboardView, itemId: DashboardView) =>
  normalizeView(view) === normalizeView(itemId);

export function DashboardSidebar({
  view,
  onNavigate,
  data,
}: {
  view: DashboardView;
  onNavigate: (view: DashboardView) => void;
  data: DashboardDataContext;
}) {
  const workspaceLabel = data.userName.includes("@")
    ? `${data.userName.split("@")[0]}'s workspace`
    : `${data.userName}'s workspace`;

  return (
    <aside className="dashboard-sidebar">
      <div className="flex h-[var(--dash-topbar-h)] shrink-0 items-center gap-2.5 border-b border-[var(--dash-border)] px-4">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] bg-white">
          <LayoutGrid size={14} className="text-black" strokeWidth={2} />
        </div>
        <span className="text-[13px] font-semibold tracking-[-0.02em] text-white">StoneAI</span>
      </div>

      <div className="border-b border-[var(--dash-border)] px-4 py-2.5">
        <p className="truncate text-[12px] font-medium text-[var(--dash-text-secondary)]">
          {workspaceLabel}
        </p>
      </div>

      <nav className="flex-1 py-1">
        {groups.map((group) => (
          <div key={group.label} className="dash-nav-group">
            <p className="dash-nav-label">{group.label}</p>
            {group.items.map((item) => {
              const count =
                item.id === "projects"
                  ? data.projects.length
                  : item.id === "domains"
                    ? data.connectedDomains.length
                    : undefined;

              return (
                <div key={item.id} className="dash-nav-item-wrap">
                  <button
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    className={`dash-nav-item ${isActive(view, item.id) ? "active" : ""}`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {count !== undefined ? (
                      <span className="dash-nav-count">{count}</span>
                    ) : null}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-[var(--dash-border)] p-3">
        <div className="mb-2.5 flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--dash-border)] bg-[var(--dash-surface2)] text-[11px] font-semibold text-[var(--dash-text-secondary)]">
            {data.userInitial}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-medium text-[var(--dash-text)]">
              {data.userEmail || data.userName}
            </p>
            <p className="truncate text-[11px] text-[var(--dash-muted)]">
              {data.billingSummary?.plan.name ?? "Free Trial"}
            </p>
          </div>
        </div>
        <div className="mb-2.5 flex items-center justify-between rounded-[var(--dash-radius-sm)] border border-[var(--dash-border)] bg-[var(--dash-surface2)] px-2.5 py-1.5">
          <span className="flex items-center gap-1 text-[11px] text-[var(--dash-muted)]">
            <Zap size={11} />
            Credits
          </span>
          <span className="text-[12px] font-medium tabular-nums text-[var(--dash-text)]">
            {data.creditsRemaining.toLocaleString()}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("billing")}
          className="dash-btn dash-btn-primary w-full text-[12px]"
        >
          Upgrade
        </button>
      </div>
    </aside>
  );
}
