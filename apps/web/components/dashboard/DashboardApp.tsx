"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopbar } from "./DashboardTopbar";
import { useDashboardData } from "./hooks/useDashboardData";
import { useDashboardNavigation } from "./hooks/useDashboardNavigation";
import { useSidebarState } from "./hooks/useSidebarState";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { BillingPage } from "./pages/BillingPage";
import { DomainsPage } from "./pages/DomainsPage";
import { OverviewPage } from "./pages/OverviewPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { WebsiteGenerationPage } from "./pages/WebsiteGenerationPage";
import { WebsiteReadyPage } from "./pages/WebsiteReadyPage";
import { DashboardSkeleton } from "./ui/Skeleton";
import { normalizeView } from "./types";
import "./dashboard.css";

export function DashboardApp() {
  const data = useDashboardData();
  const { view, navigate } = useDashboardNavigation();
  const searchParams = useSearchParams();
  const sidebar = useSidebarState();
  const [search, setSearch] = useState("");
  const activeView = normalizeView(view);
  const readyProjectId = searchParams.get("projectId");

  useEffect(() => {
    const templateId = searchParams.get("templateId");
    if (templateId && activeView === "generate-website") {
      data.updatePipelineForm("templateId", templateId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to URL template param
  }, [activeView, searchParams]);

  const renderPage = () => {
    switch (activeView) {
      case "projects":
        return <ProjectsPage data={data} search={search} onSearchChange={setSearch} />;
      case "generate-website":
        return <WebsiteGenerationPage data={data} />;
      case "website-ready":
        return (
          <WebsiteReadyPage
            data={data}
            projectId={readyProjectId ?? ""}
            onNavigate={navigate}
          />
        );
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
