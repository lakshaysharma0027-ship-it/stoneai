"use client";

import { useState } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopbar } from "./DashboardTopbar";
import { useDashboardData } from "./hooks/useDashboardData";
import { useDashboardNavigation } from "./hooks/useDashboardNavigation";
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

  return (
    <main className="dashboard-root">
      <div className={`dashboard-app transition-opacity duration-300 ${data.mounted ? "opacity-100" : "opacity-0"}`}>
        <DashboardSidebar view={activeView} onNavigate={navigate} data={data} />
        <DashboardTopbar
          view={activeView}
          search={search}
          onSearchChange={setSearch}
          onNavigate={navigate}
          data={data}
        />
        <div className="dashboard-content">
          {!data.mounted ? <DashboardSkeleton /> : renderPage()}
        </div>
      </div>
    </main>
  );
}
