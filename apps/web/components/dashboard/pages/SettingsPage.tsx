"use client";

import type { DashboardDataContext } from "../hooks/useDashboardData";
import { Button } from "../ui/Button";
import { PageHeader } from "../ui/PageHeader";
import { Panel, PanelHead } from "../ui/Panel";

export function SettingsPage({ data }: { data: DashboardDataContext }) {
  const displayName = data.userName.includes("@") ? data.userName.split("@")[0] : data.userName;

  return (
    <div className="dashboard-content-inner">
      <PageHeader title="Settings" subtitle="Profile, workspace, and account" />

      <div className="grid gap-3.5 lg:grid-cols-2">
        <Panel>
          <PanelHead title="Profile" />
          <div className="space-y-3.5 p-4">
            <label className="block text-[11px] text-[var(--dash-hint)]">
              Display name
              <input
                readOnly
                value={displayName}
                className="mt-1 w-full rounded-[var(--dash-radius)] border border-[var(--dash-border)] bg-[var(--dash-surface2)] px-2.5 py-1.5 text-xs text-[var(--dash-text)]"
              />
            </label>
            <label className="block text-[11px] text-[var(--dash-hint)]">
              Email address
              <input
                readOnly
                value={data.userEmail}
                className="mt-1 w-full rounded-[var(--dash-radius)] border border-[var(--dash-border)] bg-[var(--dash-surface2)] px-2.5 py-1.5 text-xs text-[var(--dash-text)]"
              />
            </label>
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--dash-border2)] bg-[var(--dash-surface3)] text-base font-semibold text-[var(--dash-muted)]">
                {data.userInitial}
              </span>
              <span className="text-[11px] text-[var(--dash-hint)]">
                Avatar is generated from your account name.
              </span>
            </div>
          </div>
        </Panel>

        <Panel>
          <PanelHead title="Account" />
          <div className="space-y-3 p-4">
            <p className="text-xs text-[var(--dash-muted)]">
              Plan: {data.billingSummary?.plan.name ?? "Free Trial"} ·{" "}
              {data.creditsRemaining.toLocaleString()} credits remaining
            </p>
            <Button variant="danger" onClick={() => void data.handleLogout()}>
              Sign out
            </Button>
          </div>
        </Panel>
      </div>
    </div>
  );
}
