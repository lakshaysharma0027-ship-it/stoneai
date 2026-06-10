"use client";

import { ArrowUp, Receipt, Sparkles } from "lucide-react";
import type { DashboardDataContext } from "../hooks/useDashboardData";
import { PLAN_CARDS } from "../types";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { PageHeader } from "../ui/PageHeader";
import { Panel, PanelHead } from "../ui/Panel";
import { formatShortDate } from "../utils";

export function BillingPage({ data }: { data: DashboardDataContext }) {
  const usageTotal = Object.values(data.creditUsageByType).reduce((a, b) => a + b, 0);
  const usageMax = Math.max(usageTotal, 1);

  const paymentHistory = data.creditTransactions.filter((txn) => txn.amount > 0);

  return (
    <div className="dashboard-content-inner">
      <PageHeader title="Billing" subtitle="Plan, credits, and payment history" />

      <div className="mb-3.5 flex items-center gap-4 rounded-[var(--dash-radius-lg)] border border-[var(--dash-border)] bg-[var(--dash-surface)] p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--dash-radius)] border border-[var(--dash-border)] bg-[var(--dash-surface2)]">
          <Sparkles size={18} className="text-[var(--dash-muted)]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-[var(--dash-white)]">
            {data.billingSummary?.plan.name ?? "Free Trial"}
          </p>
          <p className="text-xs leading-relaxed text-[var(--dash-hint)]">
            {data.monthlyCredits} generation credits · {data.billingSummary?.plan.siteLimit ?? 1}{" "}
            published site{(data.billingSummary?.plan.siteLimit ?? 1) === 1 ? "" : "s"} ·{" "}
            {data.connectedDomains.length ? "Custom domains enabled" : "No custom domains"} ·
            Community support
          </p>
        </div>
        <Button variant="primary" onClick={() => void data.handleCheckout("basic_plus")}>
          <ArrowUp size={13} />
          Upgrade plan
        </Button>
      </div>

      <div className="grid gap-3.5 xl:grid-cols-[1fr_300px]">
        <div>
          <Panel>
            <PanelHead title="Credit usage this month" />
            <div className="px-4 py-3.5">
              <p className="text-[30px] font-semibold tracking-[-1.5px] text-[var(--dash-white)]">
                {data.creditsRemaining.toLocaleString()}
              </p>
              <p className="text-xs text-[var(--dash-hint)]">
                of {data.monthlyCredits.toLocaleString()} credits remaining
              </p>
              <div className="my-3 h-[3px] overflow-hidden rounded-sm bg-[var(--dash-border)]">
                <div
                  className="h-full rounded-sm bg-[var(--dash-white)]"
                  style={{ width: `${data.creditPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[var(--dash-hint)]">
                <span>
                  {data.creditsUsed} used ({Math.round(data.creditPercent)}%)
                </span>
                <span>
                  {data.billingSummary?.subscription.renewalDate
                    ? `Renews ${formatShortDate(data.billingSummary.subscription.renewalDate)}`
                    : "Resets on plan renewal"}
                </span>
              </div>

              <div className="mt-4 space-y-0">
                {[
                  ["Website generation", data.creditUsageByType.generate_website],
                  ["Image generation", data.creditUsageByType.media_image_generate],
                  ["Video generation", data.creditUsageByType.media_video_generate],
                  ["Other", data.creditUsageByType.other],
                ].map(([label, amount]) => (
                  <div
                    key={label as string}
                    className="flex items-center gap-2.5 border-b border-[var(--dash-border)] py-1.5 last:border-b-0"
                  >
                    <span className="w-[120px] shrink-0 text-xs text-[var(--dash-muted)]">
                      {label as string}
                    </span>
                    <div className="h-[3px] flex-1 overflow-hidden rounded-sm bg-[var(--dash-border)]">
                      <div
                        className="h-full rounded-sm bg-[var(--dash-white)]"
                        style={{
                          width: `${((amount as number) / usageMax) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="w-10 shrink-0 text-right text-[11px] text-[var(--dash-hint)]">
                      {amount as number} cr
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          <Panel className="mb-0">
            <PanelHead title="Transaction history" />
            {paymentHistory.length === 0 ? (
              <EmptyState
                icon={<Receipt size={22} />}
                title="No transactions yet"
                description="Your billing history and credit grants appear here after your first payment or usage."
              />
            ) : (
              <div>
                {data.creditTransactions.slice(0, 20).map((txn) => (
                  <div
                    key={txn.id}
                    className="flex items-center gap-3 border-b border-[var(--dash-border)] px-4 py-2.5 last:border-b-0"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-[var(--dash-text)]">
                        {txn.description ?? txn.type.replace(/_/g, " ")}
                      </p>
                      <p className="text-[11px] text-[var(--dash-hint)]">
                        {formatShortDate(txn.created_at)}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-[var(--dash-text)]">
                      {txn.amount > 0 ? "+" : ""}
                      {txn.amount} cr
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          {data.billingError ? (
            <p className="mt-2 text-[11px] text-[var(--dash-red)]">{data.billingError}</p>
          ) : null}
          {data.billingSummary?.subscription.subscriptionId ? (
            <Button
              className="mt-3"
              onClick={() => void data.handleCancelBilling()}
              disabled={data.billingAction === "cancel"}
            >
              {data.billingAction === "cancel" ? "Cancelling…" : "Cancel subscription"}
            </Button>
          ) : null}
        </div>

        <div className="flex flex-col gap-3.5">
          <Panel className="mb-0">
            <PanelHead title="Plan options" />
            <div className="space-y-2 p-4">
              {PLAN_CARDS.map((plan) => {
                const current = data.billingSummary?.plan.id === plan.id;
                return (
                  <div
                    key={plan.id}
                    className={`rounded-[var(--dash-radius)] border p-2.5 ${
                      current ? "border-[var(--dash-white)]" : "border-[var(--dash-border)]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[var(--dash-text)]">{plan.name}</span>
                      <span className="text-[11px] text-[var(--dash-hint)]">
                        {plan.credits.toLocaleString()} cr · {plan.sites} sites
                      </span>
                    </div>
                    <Button
                      variant={current ? "default" : "primary"}
                      fullWidth
                      className="mt-2"
                      onClick={() => void data.handleCheckout(plan.id)}
                      disabled={current || plan.id === "free_trial" || data.billingAction === plan.id}
                    >
                      {current
                        ? "Current"
                        : data.billingAction === plan.id
                          ? "Starting…"
                          : "Upgrade"}
                    </Button>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
