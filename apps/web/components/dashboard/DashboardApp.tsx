"use client";

import { useState } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopbar } from "./DashboardTopbar";
import { useDashboardData } from "./hooks/useDashboardData";
import { useDashboardNavigation } from "./hooks/useDashboardNavigation";
import { useSidebarState } from "./hooks/useSidebarState";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { BillingPage } from "./pages/BillingPage";
import { DomainsPage } from "./pages/DomainsPage";
import { ImageGenerationPage } from "./pages/ImageGenerationPage";
import { OverviewPage } from "./pages/OverviewPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { VideoGenerationPage } from "./pages/VideoGenerationPage";
import { WebsiteGenerationPage } from "./pages/WebsiteGenerationPage";
import { DashboardSkeleton } from "./ui/Skeleton";
import { normalizeView } from "./types";
import "./dashboard.css";

export function DashboardApp() {
  const data = useDashboardData();
  const { view, navigate } = useDashboardNavigation();
  const sidebar = useSidebarState();
  const [search, setSearch] = useState("");
  const activeView = normalizeView(view);

  const renderPage = () => {
    switch (activeView) {
      case "projects":
        return <ProjectsPage data={data} search={search} onSearchChange={setSearch} />;
      case "generate-website":
        return <WebsiteGenerationPage data={data} />;
      case "generate-image":
        return <ImageGenerationPage data={data} />;
      case "generate-video":
        return <VideoGenerationPage data={data} />;
      case "domains":
        return <DomainsPage data={data} />;
      case "analytics":
        return <AnalyticsPage data={data} />;
      case "billing":
        return <BillingPage data={data} />;
      case "settings":
        return <SettingsPage data={data} />;
      case "overview":
      default:
        return <OverviewPage data={data} onNavigate={navigate} />;
    }
  };

  const appClassName = [
    "dashboard-app",
    "transition-opacity duration-300",
    data.mounted ? "opacity-100" : "opacity-0",
    sidebar.collapsedPreference && !sidebar.isMobile ? "sb-collapsed" : "",
    sidebar.mobileOpen ? "sb-mobile-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <main className="dashboard-root">
      {sidebar.mobileOpen ? (
        <button
          type="button"
          className="sb-backdrop"
          onClick={sidebar.closeMobile}
          aria-label="Close navigation menu"
        />
      ) : null}
      <div className={appClassName}>
        <DashboardSidebar
          view={activeView}
          onNavigate={navigate}
          data={data}
          collapsed={sidebar.collapsed}
          onToggleCollapsed={sidebar.toggleCollapsed}
          mobileOpen={sidebar.mobileOpen}
          onCloseMobile={sidebar.closeMobile}
        />
        <DashboardTopbar
          view={activeView}
          search={search}
          onSearchChange={setSearch}
          onNavigate={navigate}
          data={data}
          onOpenMobile={sidebar.openMobile}
          showMobileMenu={sidebar.isMobile}
        />
        <div className="dashboard-content">
          {!data.mounted ? <DashboardSkeleton /> : renderPage()}
        </div>
      </div>
    </main>
  );
}
