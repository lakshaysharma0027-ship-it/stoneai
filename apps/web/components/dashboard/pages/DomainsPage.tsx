"use client";

import { useState } from "react";
import { Globe, Plus } from "lucide-react";
import type { DashboardDataContext } from "../hooks/useDashboardData";
import "../domains-analytics.css";
import {
  copyToClipboard,
  domainStatusClass,
  getDomainDisplayStatus,
} from "../domains/domainUtils";

export function DomainsPage({ data }: { data: DashboardDataContext }) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const canConnectDomains =
    data.billingSummary?.plan.id !== "free_trial" &&
    data.billingSummary?.subscription.status !== "pending";

  const scrollToAdd = () => {
    document.getElementById("da-add-domain")?.scrollIntoView({ behavior: "smooth" });
    document.getElementById("domain-host")?.focus();
  };

  const handleCopy = async (key: string, value: string) => {
    await copyToClipboard(value);
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey(null), 2000);
  };

  const getSiteLabel = (siteId: string | null) => {
    if (!siteId) return "First published site";
    const site = data.publishedSites.find((item) => item.id === siteId);
    return site?.seo_title ?? site?.slug ?? "Published site";
  };

  const headerMeta =
    data.connectedDomains.length === 0 && !canConnectDomains
      ? "0 connected · Upgrade to connect custom domains"
      : `${data.connectedDomains.length} connected`;

  return (
    <div className="da-page">
      <header className="pg-header">
        <h1>Domains</h1>
        <p>Connect custom domains to your published sites</p>
      </header>

      <div className="section-card">
        <div className="card-header">
          <h2>Connected domains</h2>
          <small>{headerMeta}</small>
        </div>

        {data.connectedDomains.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Globe size={20} />
            </div>
            <h3>No domains connected yet</h3>
            <p>
              Connect a custom domain and point it to one of your published sites. Supports apex
              domains and subdomains.
            </p>
            <button type="button" className="add-domain-link" onClick={scrollToAdd}>
              <Plus size={12} />
              Add domain
            </button>
          </div>
        ) : (
          <div className="domain-list">
            {data.connectedDomains.map((domain) => {
              const isVerifying = data.domainActionId === domain.id;
              const displayStatus = getDomainDisplayStatus(domain, isVerifying);
              return (
                <div key={domain.id} className="domain-row">
                  <div className="domain-row-top">
                    <div>
                      <div className="domain-name">{domain.domain}</div>
                      <div className="domain-site">Connected to {getSiteLabel(domain.siteId)}</div>
                    </div>
                    <div className="domain-actions">
                      <span className={`tag ${domainStatusClass(displayStatus)}`}>
                        {displayStatus}
                      </span>
                      <button
                        type="button"
                        className="domain-action-btn"
                        onClick={() => void data.handleVerifyDomain(domain.id)}
                        disabled={isVerifying}
                      >
                        {isVerifying ? "Checking…" : "Verify"}
                      </button>
                      <button
                        type="button"
                        className="domain-action-btn danger"
                        onClick={() => void data.handleRemoveDomain(domain.id)}
                        disabled={isVerifying}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="dns-card">
                    <div className="dns-card-title">DNS verification</div>
                    <div className="dns-record">
                      <span className="dns-record-label">Type</span>
                      <span className="dns-record-value">{domain.verificationType.toUpperCase()}</span>
                    </div>
                    <div className="dns-record">
                      <span className="dns-record-label">Host</span>
                      <span className="dns-record-value">{domain.verificationHost}</span>
                      <button
                        type="button"
                        className="copy-btn"
                        onClick={() => void handleCopy(`${domain.id}-host`, domain.verificationHost)}
                      >
                        {copiedKey === `${domain.id}-host` ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <div className="dns-record">
                      <span className="dns-record-label">Value</span>
                      <span className="dns-record-value">{domain.verificationValue}</span>
                      <button
                        type="button"
                        className="copy-btn"
                        onClick={() =>
                          void handleCopy(`${domain.id}-value`, domain.verificationValue)
                        }
                      >
                        {copiedKey === `${domain.id}-value` ? "Copied" : "Copy"}
                      </button>
                    </div>
                    {domain.failureReason ? (
                      <p className="domain-error-inline">{domain.failureReason}</p>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="section-card" id="da-add-domain">
        <div className="card-header">
          <h2>Add domain</h2>
        </div>
        <div className="add-domain-section">
          <form onSubmit={data.handleConnectDomain}>
            <div className="domain-input-row">
              <input
                id="domain-host"
                value={data.domainHost}
                onChange={(e) => data.setDomainHost(e.target.value)}
                placeholder="www.clientdomain.com"
                disabled={data.domainSubmitting}
              />
              <select
                className="select-styled"
                value={data.domainSiteId}
                onChange={(e) => data.setDomainSiteId(e.target.value)}
                disabled={data.domainSubmitting}
              >
                <option value="">First published site</option>
                {data.publishedSites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.seo_title ?? site.slug}
                  </option>
                ))}
              </select>
              <select
                className="select-styled select-styled--sm"
                value={data.domainVerificationType}
                onChange={(e) =>
                  data.setDomainVerificationType(e.target.value as "txt" | "cname")
                }
                disabled={data.domainSubmitting}
              >
                <option value="txt">TXT</option>
                <option value="cname">CNAME</option>
              </select>
              <button
                type="submit"
                className="connect-btn"
                disabled={data.domainSubmitting || data.publishedSites.length === 0}
              >
                {data.domainSubmitting ? "Connecting…" : "Connect"}
              </button>
            </div>
          </form>

          {data.domainError ? <p className="domain-error">{data.domainError}</p> : null}

          <div className="how-to-list">
            <h4>How to connect a domain</h4>
            <div className="step-item">
              <div className="step-num">1</div>
              <div className="step-text">
                Enter your domain above and select which published site to point it to.
              </div>
            </div>
            <div className="step-item">
              <div className="step-num">2</div>
              <div className="step-text">
                Copy the CNAME or TXT record shown and add it in your DNS provider&apos;s control
                panel.
              </div>
            </div>
            <div className="step-item">
              <div className="step-num">3</div>
              <div className="step-text">
                StoneAI automatically provisions an SSL certificate. DNS propagation takes up to 48
                hours.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
