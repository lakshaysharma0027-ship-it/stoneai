"use client";

import { useState } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopbar } from "./DashboardTopbar";
import { useDashboardData } from "./hooks/useDashboardData";
import { useDashboardNavigation } from "./hooks/useDashboardNavigation";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { BillingPage } from "./pages/BillingPage";
import { DomainsPage } from "./pages/DomainsPage";
import { GeneratePage } from "./pages/GeneratePage";
import { MediaPage } from "./pages/MediaPage";
import { OverviewPage } from "./pages/OverviewPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { TeamPage } from "./pages/TeamPage";
import "./dashboard.css";

export function DashboardApp() {
  const data = useDashboardData();
  const { view, navigate } = useDashboardNavigation();
  const [search, setSearch] = useState("");

  const renderPage = () => {
    switch (view) {
      case "projects":
        return <ProjectsPage data={data} search={search} />;
      case "generate":
        return <GeneratePage data={data} />;
      case "media":
        return <MediaPage data={data} search={search} onNavigate={navigate} />;
      case "domains":
        return <DomainsPage data={data} />;
      case "analytics":
        return <AnalyticsPage data={data} />;
      case "billing":
        return <BillingPage data={data} />;
      case "team":
        return <TeamPage data={data} />;
      case "settings":
        return <SettingsPage data={data} />;
      case "overview":
      default:
        return <OverviewPage data={data} onNavigate={navigate} />;
    }
  };

  return (
    <main
      className={`dashboard-root transition-opacity duration-300 ${data.mounted ? "opacity-100" : "opacity-0"}`}
    >
      <div className="dashboard-app">
        <DashboardSidebar view={view} onNavigate={navigate} data={data} />
        <DashboardTopbar
          view={view}
          search={search}
          onSearchChange={setSearch}
          onNavigate={navigate}
          data={data}
        />
        <div className="dashboard-content">{renderPage()}</div>
      </div>
    </main>
  );
}
