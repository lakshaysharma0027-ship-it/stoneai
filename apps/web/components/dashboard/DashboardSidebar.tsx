"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import {
  BarChart3,
  Camera,
  CreditCard,
  Folder,
  Globe,
  LayoutDashboard,
  LayoutGrid,
  Link2,
  MoreVertical,
  PanelLeftClose,
  PanelRightClose,
  Play,
  Settings,
} from "lucide-react";
import type { DashboardView } from "./types";
import { normalizeView } from "./types";
import type { DashboardDataContext } from "./hooks/useDashboardData";
import { STONEAI_LOGO_ALT, STONEAI_LOGO_SRC } from "@/lib/brand";
import "./dashboard-sidebar.css";

type NavItem = {
  id: DashboardView;
  label: string;
  icon: ReactNode;
  count?: number;
};

const groups: Array<{ label: string; items: NavItem[]; dividerBefore?: boolean }> = [
  {
    label: "Workspace",
    items: [
      {
        id: "overview",
        label: "Overview",
        icon: <LayoutDashboard className="sb-icon" size={16} strokeWidth={1.75} />,
      },
      {
        id: "projects",
        label: "Projects",
        icon: <Folder className="sb-icon" size={16} strokeWidth={1.75} />,
      },
      {
        id: "templates",
        label: "Templates",
        icon: <LayoutGrid className="sb-icon" size={16} strokeWidth={1.75} />,
      },
    ],
  },
  {
    label: "AI Tools",
    items: [
      {
        id: "generate-website",
        label: "Website Generation",
        icon: <Globe className="sb-icon" size={16} strokeWidth={1.75} />,
      },
      {
        id: "generate-image",
        label: "Image Generation",
        icon: <Camera className="sb-icon" size={16} strokeWidth={1.75} />,
      },
      {
        id: "generate-video",
        label: "Video Generation",
        icon: <Play className="sb-icon" size={16} strokeWidth={1.75} />,
      },
    ],
  },
  {
    label: "Publish",
    items: [
      {
        id: "domains",
        label: "Domains",
        icon: <Link2 className="sb-icon" size={16} strokeWidth={1.75} />,
      },
      {
        id: "analytics",
        label: "Analytics",
        icon: <BarChart3 className="sb-icon" size={16} strokeWidth={1.75} />,
      },
    ],
  },
  {
    label: "Account",
    dividerBefore: true,
    items: [
      {
        id: "billing",
        label: "Billing",
        icon: <CreditCard className="sb-icon" size={16} strokeWidth={1.75} />,
      },
      {
        id: "settings",
        label: "Settings",
        icon: <Settings className="sb-icon" size={16} strokeWidth={1.75} />,
      },
    ],
  },
];

const isActive = (view: DashboardView, itemId: DashboardView) =>
  normalizeView(view) === normalizeView(itemId);

export function DashboardSidebar({
  view,
  onNavigate,
  data,
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onCloseMobile,
}: {
  view: DashboardView;
  onNavigate: (view: DashboardView) => void;
  data: DashboardDataContext;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const workspaceLabel = data.userName.includes("@")
    ? `${data.userName.split("@")[0]}'s workspace`
    : `${data.userName}'s workspace`;

  const displayName = data.userEmail
    ? data.userEmail.split("@")[0]
    : data.userName;

  const creditsRemainingPct = data.monthlyCredits
    ? Math.min(
        100,
        Math.round((data.creditsRemaining / data.monthlyCredits) * 100 / 5) * 5,
      )
    : 100;

  const handleNav = (itemId: DashboardView) => {
    onNavigate(itemId);
    onCloseMobile();
  };

  return (
    <aside
      className={`sb-sidebar ${collapsed ? "sb-collapsed" : ""} ${mobileOpen ? "sb-mobile-open" : ""}`}
      aria-label="Dashboard navigation"
    >
      <div className="sb-logo-row">
        <div className="sb-logo-inner">
          <div className="sb-logo-icon">
            <Image
              src={STONEAI_LOGO_SRC}
              alt={STONEAI_LOGO_ALT}
              width={28}
              height={28}
              className="sb-logo-image"
            />
          </div>
          <span className="sb-logo-text">StoneAI</span>
        </div>
        <button
          type="button"
          className="sb-toggle-btn"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
        >
          {collapsed ? <PanelRightClose size={14} /> : <PanelLeftClose size={14} />}
        </button>
      </div>

      <div className="sb-ws-pill">
        <div className="sb-ws-dot" aria-hidden />
        <span className="sb-ws-label">{workspaceLabel}</span>
      </div>

      <div className="sb-nav-scroll">
        {groups.map((group) => (
          <div key={group.label}>
            {group.dividerBefore ? <div className="sb-nav-divider" /> : null}
            <div className="sb-nav-section">
              <div className="sb-nav-section-label">{group.label}</div>
            </div>
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
                  data-tip={item.label}
                  className={`sb-nav-item ${isActive(view, item.id) ? "active" : ""}`}
                  onClick={() => handleNav(item.id)}
                  aria-current={isActive(view, item.id) ? "page" : undefined}
                >
                  {item.icon}
                  <span className="sb-label">{item.label}</span>
                  {count !== undefined ? <span className="sb-badge">{count}</span> : null}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="sb-credits-bar">
        <div className="sb-credits-top">
          <span className="sb-credits-label">Credits</span>
          <span className="sb-credits-count">{data.creditsRemaining.toLocaleString()}</span>
        </div>
        <div className="sb-credits-track">
          <div className="sb-credits-fill" data-pct={creditsRemainingPct} />
        </div>
      </div>

      <button type="button" className="sb-upgrade-btn" onClick={() => handleNav("billing")}>
        Upgrade plan
      </button>

      <div className="sb-user-row">
        <div className="sb-avatar">{data.userInitial}</div>
        <div className="sb-user-info">
          <div className="sb-user-name">{displayName}</div>
          <div className="sb-user-plan">{data.billingSummary?.plan.name ?? "Free Trial"}</div>
        </div>
        <MoreVertical size={14} className="sb-user-more" aria-hidden />
      </div>
    </aside>
  );
}
