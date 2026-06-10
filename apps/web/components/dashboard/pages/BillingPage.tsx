"use client";

import {
  ArrowUp,
  CreditCard,
  FileText,
  Receipt,
  Star,
} from "lucide-react";
import type { BillingPlanId } from "../types";
import type { DashboardDataContext } from "../hooks/useDashboardData";
import {
  formatPlanPrice,
  PLAN_CATALOG,
  PLAN_FEATURE_ROWS,
} from "../billing/planCatalog";
import "../billing-settings.css";
import { formatShortDate } from "../utils";

const roundBarWidth = (value: number, max: number) => {
  if (max <= 0 || value <= 0) return 0;
  return Math.min(100, Math.round((value / max) * 100 / 5) * 5);
};

export function BillingPage({ data }: { data: DashboardDataContext }) {
  const usageTotal = Object.values(data.creditUsageByType).reduce((a, b) => a + b, 0);
  const usageMax = Math.max(usageTotal, 1);
  const currentPlanId = data.billingSummary?.plan.id ?? "free_trial";
  const planName = data.billingSummary?.plan.name ?? "Free Trial";
  const siteLimit = data.billingSummary?.plan.siteLimit ?? 1;
  const hasCustomDomains = data.connectedDomains.length > 0 || siteLimit > 1;
  const subscriptionStatus = data.billingSummary?.subscription.status ?? "trialing";
  const renewalLabel = data.billingSummary?.subscription.renewalDate
    ? `Renews ${formatShortDate(data.billingSummary.subscription.renewalDate)}`
    : "Resets on plan renewal";

  const paymentGrants = data.creditTransactions.filter(
    (txn) => txn.amount > 0 && txn.type.includes("subscription"),
  );
  const allTransactions = data.creditTransactions.slice(0, 20);

  const handleUpgrade = (planId: BillingPlanId) => {
    if (planId === "free_trial") return;
    void data.handleCheckout(planId);
  };

  const renderFeatureCell = (value: string | boolean) => {
    if (value === true) {
      return <span className="compare-mark compare-mark-yes">✓</span>;
    }
    if (value === false) {
      return <span className="compare-mark compare-mark-no">—</span>;
    }
    return <span className="compare-text">{value}</span>;
  };

  return (
    <div className="bs-page">
      <header className="pg-header">
        <h1>Billing</h1>
        <p>Plan, credits, and payment history</p>
      </header>

      <div className="billing-layout">
        <div>
          <div className="section-card">
            <div className="plan-banner">
              <div className="plan-icon">
                <Star size={18} />
              </div>
              <div>
                <div className="plan-name">{planName}</div>
                <div className="plan-features">
                  {data.monthlyCredits.toLocaleString()} generation credits · {siteLimit}{" "}
                  published site{siteLimit === 1 ? "" : "s"} ·{" "}
                  {hasCustomDomains ? "Custom domains" : "No custom domains"} · Community
                  support
                </div>
                <div className="plan-status">Status: {subscriptionStatus}</div>
              </div>
              <button
                type="button"
                className="upgrade-plan-btn"
                onClick={() => handleUpgrade("basic_plus")}
              >
                <ArrowUp size={13} />
                Upgrade plan
              </button>
            </div>

            <div className="credit-body">
              <div className="credit-section-label">Credit usage this month</div>
              <div className="credit-number">{data.creditsRemaining.toLocaleString()}</div>
              <div className="credit-sub credit-sub-spaced">
                of {data.monthlyCredits.toLocaleString()} credits remaining
              </div>
              <div className="credit-track">
                <div
                  className="credit-track-fill"
                  data-pct={Math.min(100, Math.round(data.creditPercent / 5) * 5)}
                />
              </div>
              <div className="credit-meta">
                <span>
                  {data.creditsUsed} used ({Math.round(data.creditPercent)}%)
                </span>
                <span>{renewalLabel}</span>
              </div>
            </div>

            <div className="usage-rows">
              {[
                ["Website generation", data.creditUsageByType.generate_website],
                ["Image generation", data.creditUsageByType.media_image_generate],
                ["Video generation", data.creditUsageByType.media_video_generate],
                ["Other", data.creditUsageByType.other],
              ].map(([label, amount]) => (
                <div key={label as string} className="usage-row">
                  <span className="usage-name">{label as string}</span>
                  <div className="usage-bar-wrap">
                    <div
                      className="usage-bar"
                      data-w={roundBarWidth(amount as number, usageMax)}
                    />
                  </div>
                  <span className="usage-val">{amount as number} cr</span>
                </div>
              ))}
            </div>
          </div>

          <div className="section-card">
            <div className="card-header">
              <h2>Transaction history</h2>
            </div>
            {allTransactions.length === 0 ? (
              <div className="tx-empty">
                <div className="empty-icon">
                  <Receipt size={20} />
                </div>
                <div className="tx-empty-title">No transactions yet</div>
                <p>
                  Your billing history and credit grants appear here after your first payment or
                  usage.
                </p>
              </div>
            ) : (
              allTransactions.map((txn) => (
                <div key={txn.id} className="tx-row">
                  <div className="tx-info">
                    <div className="tx-title">
                      {txn.description ?? txn.type.replaceAll("_", " ")}
                    </div>
                    <div className="tx-meta">{formatShortDate(txn.created_at)}</div>
                  </div>
                  <div className="tx-amount">
                    {txn.amount > 0 ? "+" : ""}
                    {txn.amount} cr
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="section-card">
            <div className="card-header">
              <h2>Invoices</h2>
            </div>
            {paymentGrants.length === 0 ? (
              <div className="tx-empty">
                <div className="empty-icon">
                  <FileText size={20} />
                </div>
                <div className="tx-empty-title">No invoices yet</div>
                <p>Invoices from Dodo Payments will appear here after your first subscription.</p>
              </div>
            ) : (
              paymentGrants.map((txn) => (
                <div key={txn.id} className="tx-row">
                  <div className="tx-info">
                    <div className="tx-title">{txn.description ?? "Subscription payment"}</div>
                    <div className="tx-meta">{formatShortDate(txn.created_at)}</div>
                  </div>
                  <div className="tx-amount">+{txn.amount} cr</div>
                </div>
              ))
            )}
          </div>

          <div className="section-card">
            <div className="card-header">
              <h2>Payment method</h2>
            </div>
            <div className="payment-empty">
              <div className="empty-icon">
                <CreditCard size={20} />
              </div>
              {data.billingSummary?.subscription.subscriptionId ? (
                <p>Payment method is managed securely through Dodo Payments.</p>
              ) : (
                <p>Add a payment method when you upgrade to a paid plan.</p>
              )}
              <button
                type="button"
                className="plan-upgrade-btn"
                onClick={() => handleUpgrade("basic")}
                disabled={Boolean(data.billingSummary?.subscription.subscriptionId)}
              >
                {data.billingSummary?.subscription.subscriptionId
                  ? "Managed via Dodo"
                  : "Add payment method"}
              </button>
            </div>
          </div>

          {data.billingError ? <p className="billing-error">{data.billingError}</p> : null}
          {data.billingSummary?.subscription.subscriptionId ? (
            <button
              type="button"
              className="cancel-btn"
              onClick={() => void data.handleCancelBilling()}
              disabled={data.billingAction === "cancel"}
            >
              {data.billingAction === "cancel" ? "Cancelling…" : "Cancel subscription"}
            </button>
          ) : null}
        </div>

        <div className="section-card plan-options-sticky">
          <div className="card-header">
            <h2>Plan options</h2>
          </div>
          {PLAN_CATALOG.map((plan) => {
            const current = currentPlanId === plan.id;
            return (
              <div key={plan.id} className="plan-option">
                <div className="plan-option-header">
                  <span className="plan-option-name">{plan.name}</span>
                  {current ? (
                    <span className="plan-current-badge">Current</span>
                  ) : (
                    <span className="plan-option-meta">
                      {plan.credits.toLocaleString()} cr · {plan.sites} site
                      {plan.sites === 1 ? "" : "s"}
                    </span>
                  )}
                </div>
                {!current ? (
                  <>
                    <div className="plan-option-price">{formatPlanPrice(plan.monthlyPrice)}</div>
                    <button
                      type="button"
                      className="plan-upgrade-btn"
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={
                        plan.id === "free_trial" ||
                        data.billingAction === plan.id ||
                        current
                      }
                    >
                      {data.billingAction === plan.id ? "Starting…" : "Upgrade"}
                    </button>
                  </>
                ) : (
                  <div className="plan-option-meta">
                    {plan.credits.toLocaleString()} cr · {plan.sites} site
                    {plan.sites === 1 ? "" : "s"}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="section-card">
        <div className="card-header">
          <h2>Plan comparison</h2>
          <small>StoneAI pricing · monthly billing</small>
        </div>
        <div className="compare-wrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th>Feature</th>
                {PLAN_CATALOG.map((plan) => (
                  <th key={plan.id}>
                    {plan.name}
                    <br />
                    <small>{formatPlanPrice(plan.monthlyPrice)}</small>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PLAN_FEATURE_ROWS.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  {PLAN_CATALOG.map((plan) => (
                    <td key={plan.id}>{renderFeatureCell(row.values[plan.id])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
