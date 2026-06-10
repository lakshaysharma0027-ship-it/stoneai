"use client";

import {
  BarChart3,
  CreditCard,
  Folder,
  Globe,
  Home,
  Image,
  LayoutGrid,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import type { DashboardView } from "./types";
import type { DashboardDataContext } from "./hooks/useDashboardData";

type NavItem = {
  id: DashboardView;
  label: string;
  icon: React.ReactNode;
  count?: number;
};

const groups: Array<{ label: string; items: NavItem[] }> = [
  {
    label: "Build",
    items: [
      { id: "overview", label: "Overview", icon: <Home size={15} /> },
      { id: "projects", label: "Projects", icon: <Folder size={15} /> },
      { id: "generate", label: "AI Generation", icon: <Sparkles size={15} /> },
      { id: "templates", label: "Templates", icon: <LayoutGrid size={15} /> },
      { id: "media", label: "Media library", icon: <Image size={15} /> },
    ],
  },
  {
    label: "Publish",
    items: [
      { id: "domains", label: "Domains", icon: <Globe size={15} /> },
      { id: "analytics", label: "Analytics", icon: <BarChart3 size={15} /> },
    ],
  },
  {
    label: "Account",
    items: [
      { id: "billing", label: "Billing", icon: <CreditCard size={15} /> },
      { id: "team", label: "Team", icon: <Users size={15} /> },
      { id: "settings", label: "Settings", icon: <Settings size={15} /> },
    ],
  },
];

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
      <div className="flex h-[var(--dash-topbar-h)] shrink-0 items-center gap-2 border-b border-[var(--dash-border)] px-4">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--dash-radius-sm)] bg-[var(--dash-white)]">
          <LayoutGrid size={13} className="text-black" />
        </div>
        <span className="text-[13px] font-semibold text-[var(--dash-white)] tracking-[-0.3px]">
          StoneAI
        </span>
      </div>

      <div className="mx-1.5 mt-1 flex items-center justify-between rounded-[var(--dash-radius)] px-2.5 py-2.5">
        <span className="truncate text-[11px] font-medium text-[var(--dash-text)]">
          {workspaceLabel}
        </span>
      </div>

      {groups.map((group) => (
        <div key={group.label} className="px-1.5 pt-3.5">
          <p className="mb-0.5 px-2.5 text-[10px] uppercase tracking-wider text-[var(--dash-hint)]">
            {group.label}
          </p>
          {group.items.map((item) => {
            const count =
              item.id === "projects"
                ? data.projects.length
                : item.id === "domains"
                  ? data.connectedDomains.length
                  : undefined;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`mb-0.5 flex w-full cursor-pointer items-center gap-2 rounded-[var(--dash-radius)] px-2.5 py-1.5 text-xs transition-colors ${
                  view === item.id
                    ? "bg-[var(--dash-surface2)] font-medium text-[var(--dash-white)]"
                    : "text-[var(--dash-muted)] hover:bg-[var(--dash-surface2)] hover:text-[var(--dash-text)]"
                }`}
              >
                <span className="shrink-0">{item.icon}</span>
                <span>{item.label}</span>
                {count !== undefined ? (
                  <span className="ml-auto text-[10px] text-[var(--dash-hint)]">{count}</span>
                ) : null}
              </button>
            );
          })}
        </div>
      ))}

      <div className="mt-auto shrink-0 border-t border-[var(--dash-border)] p-1.5">
        <button
          type="button"
          onClick={() => onNavigate("settings")}
          className="flex w-full cursor-pointer items-center gap-2 rounded-[var(--dash-radius)] px-2.5 py-1.5 hover:bg-[var(--dash-surface2)]"
        >
          <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border border-[var(--dash-border2)] bg-[var(--dash-surface3)] text-[11px] font-semibold text-[var(--dash-muted)]">
            {data.userInitial}
          </span>
          <span className="min-w-0 text-left">
            <span className="block truncate text-xs text-[var(--dash-text)]">
              {data.userEmail || data.userName}
            </span>
            <span className="block text-[10px] text-[var(--dash-hint)]">
              {data.billingSummary?.plan.name ?? "Free Trial"} · {data.creditsRemaining} credits
            </span>
          </span>
        </button>
      </div>
    </aside>
  );
}
