"use client";

import { Mail, UserPlus } from "lucide-react";
import type { DashboardDataContext } from "../hooks/useDashboardData";
import { Button } from "../ui/Button";
import { Chip } from "../ui/Chip";
import { EmptyState } from "../ui/EmptyState";
import { PageHeader } from "../ui/PageHeader";
import { Panel, PanelHead } from "../ui/Panel";

const roles = [
  { name: "Owner", desc: "Full access — billing, settings, delete workspace" },
  { name: "Admin", desc: "Manage projects, domains, and members — no billing access" },
  { name: "Editor", desc: "Create and edit projects — cannot publish or manage domains" },
  { name: "Viewer", desc: "View-only access to all projects in the workspace" },
];

export function TeamPage({ data }: { data: DashboardDataContext }) {
  const isFree = data.billingSummary?.plan.id === "free_trial";

  return (
    <>
      <PageHeader
        title="Team"
        subtitle={`1 member${isFree ? " · Upgrade to invite teammates" : ""}`}
        action={
          <Button
            variant="primary"
            disabled={isFree}
            onClick={() => void data.handleCheckout("pro")}
          >
            <UserPlus size={13} />
            Invite member
          </Button>
        }
      />

      <Panel>
        <PanelHead title="Members" />
        <div className="flex items-center gap-3 px-4 py-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--dash-border2)] bg-[var(--dash-surface3)] text-[13px] font-semibold text-[var(--dash-muted)]">
            {data.userInitial}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-[var(--dash-text)]">
              {data.userEmail || data.userName}
            </p>
            <p className="text-[11px] text-[var(--dash-hint)]">You</p>
          </div>
          <Chip variant="owner">Owner</Chip>
        </div>
      </Panel>

      <Panel>
        <PanelHead title="Pending invitations" />
        <EmptyState
          compact
          icon={<Mail size={20} />}
          title="No pending invitations"
          description={
            isFree
              ? "Invite team members to collaborate on projects. Requires a paid plan."
              : "Team invitations are not enabled yet."
          }
        />
      </Panel>

      <Panel className="mb-0">
        <PanelHead title="Roles and permissions" />
        {roles.map((role) => (
          <div
            key={role.name}
            className="border-b border-[var(--dash-border)] px-4 py-2.5 last:border-b-0"
          >
            <p className="text-xs font-medium text-[var(--dash-text)]">{role.name}</p>
            <p className="text-[11px] text-[var(--dash-hint)]">{role.desc}</p>
          </div>
        ))}
      </Panel>
    </>
  );
}
