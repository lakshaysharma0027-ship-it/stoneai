"use client";

import { Globe, Plus } from "lucide-react";
import type { DashboardDataContext } from "../hooks/useDashboardData";
import { Button } from "../ui/Button";
import { Chip, statusToChip } from "../ui/Chip";
import { DashSelect } from "../ui/FilterBar";
import { EmptyState } from "../ui/EmptyState";
import { PageHeader } from "../ui/PageHeader";
import { Panel, PanelHead } from "../ui/Panel";

export function DomainsPage({ data }: { data: DashboardDataContext }) {
  const canConnectDomains = (data.billingSummary?.plan.siteLimit ?? 1) > 1 || data.billingSummary?.plan.id !== "free_trial";

  return (
    <div className="dashboard-content-inner">
      <PageHeader
        title="Domains"
        subtitle={`${data.connectedDomains.length} connected${!canConnectDomains && data.connectedDomains.length === 0 ? " · Upgrade to connect custom domains" : ""}`}
        action={
          <Button
            variant="primary"
            onClick={() => document.getElementById("domain-form")?.scrollIntoView({ behavior: "smooth" })}
          >
            <Plus size={13} />
            Add domain
          </Button>
        }
      />

      <Panel>
        <PanelHead title="Connected domains" />
        {data.connectedDomains.length === 0 ? (
          <EmptyState
            icon={<Globe size={22} />}
            title="No domains connected yet"
            description="Connect a custom domain and point it to one of your published sites. Supports apex domains and subdomains."
            action={
              <Button size="sm" onClick={() => document.getElementById("domain-host")?.focus()}>
                <Plus size={12} />
                Add domain
              </Button>
            }
          />
        ) : (
          <div>
            {data.connectedDomains.map((domain) => (
              <div
                key={domain.id}
                className="flex flex-wrap items-center gap-3 border-b border-[var(--dash-border)] px-4 py-2.5 last:border-b-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-xs text-[var(--dash-text)]">{domain.domain}</p>
                  <p className="mt-0.5 truncate text-[11px] text-[var(--dash-hint)]">
                    Add {domain.verificationType.toUpperCase()} {domain.verificationHost} ={" "}
                    {domain.verificationValue}
                  </p>
                </div>
                <Chip variant={statusToChip(domain.status)}>{domain.status}</Chip>
                <Button
                  size="sm"
                  onClick={() => void data.handleVerifyDomain(domain.id)}
                  disabled={data.domainActionId === domain.id}
                >
                  {data.domainActionId === domain.id ? "Checking…" : "Verify"}
                </Button>
                <Button
                  size="sm"
                  onClick={() => void data.handleRemoveDomain(domain.id)}
                  disabled={data.domainActionId === domain.id}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Panel id="domain-form" className="mb-0">
        <PanelHead title="Add domain" />
        <form onSubmit={data.handleConnectDomain} className="grid gap-3 p-4 lg:grid-cols-[1fr_220px_150px_auto]">
          <input
            id="domain-host"
            value={data.domainHost}
            onChange={(e) => data.setDomainHost(e.target.value)}
            placeholder="www.clientdomain.com"
            className="rounded-[var(--dash-radius)] border border-[var(--dash-border)] bg-[var(--dash-surface2)] px-2.5 py-2 text-xs text-[var(--dash-text)] outline-none focus:border-[var(--dash-border2)]"
          />
          <DashSelect value={data.domainSiteId} onChange={data.setDomainSiteId}>
            <option value="">First published site</option>
            {data.publishedSites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.slug}
              </option>
            ))}
          </DashSelect>
          <DashSelect
            value={data.domainVerificationType}
            onChange={(v) => data.setDomainVerificationType(v as "txt" | "cname")}
          >
            <option value="txt">TXT</option>
            <option value="cname">CNAME</option>
          </DashSelect>
          <Button
            type="submit"
            variant="primary"
            disabled={data.domainSubmitting || data.publishedSites.length === 0}
          >
            {data.domainSubmitting ? "Connecting…" : "Connect"}
          </Button>
        </form>
        {data.domainError ? (
          <p className="px-4 pb-4 text-[11px] text-[var(--dash-red)]">{data.domainError}</p>
        ) : null}
      </Panel>

      <Panel className="mb-0 mt-3.5">
        <PanelHead title="How to connect a domain" />
        <div className="space-y-2 p-4">
          {[
            "Enter your domain above and select which published site to point it to.",
            "Copy the CNAME or TXT record shown and add it in your DNS provider's control panel.",
            "StoneAI automatically provisions an SSL certificate. DNS propagation takes up to 48 hours.",
          ].map((text, index) => (
            <div key={text} className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[var(--dash-border)] bg-[var(--dash-surface2)] text-[10px] font-semibold text-[var(--dash-hint)]">
                {index + 1}
              </span>
              <p className="text-xs leading-relaxed text-[var(--dash-muted)]">{text}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
