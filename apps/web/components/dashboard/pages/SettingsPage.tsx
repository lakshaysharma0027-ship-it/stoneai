"use client";

import { useState } from "react";
import { LogOut, Save } from "lucide-react";
import type { DashboardDataContext } from "../hooks/useDashboardData";
import "../billing-settings.css";

export function SettingsPage({ data }: { data: DashboardDataContext }) {
  const defaultName = data.userName.includes("@")
    ? (data.userName.split("@")[0] ?? data.userName)
    : data.userName;
  const [displayName, setDisplayName] = useState(defaultName);

  const planName = data.billingSummary?.plan.name ?? "Free Trial";
  const subscriptionStatus = data.billingSummary?.subscription.status ?? "trialing";
  const workspaceId = data.userEmail ? data.userEmail.split("@")[0] : "workspace";

  return (
    <div className="bs-page">
      <header className="pg-header">
        <h1>Settings</h1>
        <p>Profile, workspace, and account</p>
      </header>

      <div className="settings-layout">
        <div className="section-card">
          <div className="card-header">
            <h2>Profile</h2>
          </div>
          <div className="settings-body">
            <div className="field-group">
              <div className="field-label">Display name</div>
              <input
                className="settings-input"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div className="field-group">
              <div className="field-label">Email address</div>
              <input className="settings-input" type="email" value={data.userEmail} readOnly />
            </div>
            <div className="field-group">
              <div className="field-label">Account status</div>
              <input
                className="settings-input"
                type="text"
                value={subscriptionStatus}
                readOnly
              />
            </div>
            <div className="avatar-row">
              <div className="avatar-lg">{data.userInitial}</div>
              <div className="avatar-note">Avatar is generated from your account name.</div>
            </div>
            <button type="button" className="save-btn" disabled>
              <Save size={13} />
              Save changes
            </button>
          </div>
        </div>

        <div>
          <div className="section-card">
            <div className="card-header">
              <h2>Account</h2>
            </div>
            <div className="account-body">
              <div className="account-plan-row">
                <span className="account-plan-label">Plan</span>
                <span className="plan-pill">{planName}</span>
                <span className="account-credits">
                  · {data.creditsRemaining.toLocaleString()} credits remaining
                </span>
              </div>
              <div className="account-plan-row">
                <button type="button" className="signout-btn" onClick={() => void data.handleLogout()}>
                  <LogOut size={13} />
                  Sign out
                </button>
              </div>
            </div>
          </div>

          <div className="danger-zone">
            <div className="danger-section">
              <div className="danger-header">
                <h2>Danger zone</h2>
              </div>
              <div className="danger-body">
                <p>
                  Permanently delete your account, workspace, and all associated data. This action
                  cannot be undone.
                </p>
                <button type="button" className="delete-btn" disabled>
                  Delete account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-sections">
        <div className="section-card">
          <div className="card-header">
            <h2>Workspace</h2>
          </div>
          <div className="settings-section-body">
            <div className="settings-row">
              <span className="settings-row-label">Workspace name</span>
              <span className="settings-row-value">{defaultName}&apos;s workspace</span>
            </div>
            <div className="settings-row">
              <span className="settings-row-label">Workspace ID</span>
              <span className="settings-row-value">{workspaceId}</span>
            </div>
            <div className="settings-row">
              <span className="settings-row-label">Current plan</span>
              <span className="settings-row-value">{planName}</span>
            </div>
            <div className="settings-row">
              <span className="settings-row-label">Credits</span>
              <span className="settings-row-value">
                {data.creditsRemaining.toLocaleString()} remaining
              </span>
            </div>
            <div className="settings-row">
              <span className="settings-row-label">Subscription</span>
              <span className="settings-row-value">{subscriptionStatus}</span>
            </div>
            <div className="settings-row">
              <span className="settings-row-label">Team status</span>
              <span className="coming-soon-badge">Coming soon</span>
            </div>
          </div>
        </div>

        <div className="section-card">
          <div className="card-header">
            <h2>Security</h2>
          </div>
          <div className="settings-section-body">
            <div className="settings-row">
              <span className="settings-row-label">Password</span>
              <span className="coming-soon-badge">Coming soon</span>
            </div>
            <div className="settings-row">
              <span className="settings-row-label">Google login</span>
              <span className="settings-row-value">Connected via Supabase</span>
            </div>
            <div className="settings-row">
              <span className="settings-row-label">Session</span>
              <span className="settings-row-value">Active</span>
            </div>
            <div className="settings-row">
              <span className="settings-row-label">Connected accounts</span>
              <span className="settings-row-value">{data.userEmail || "—"}</span>
            </div>
          </div>
        </div>

        <div className="section-card">
          <div className="card-header">
            <h2>Integrations</h2>
          </div>
          <div className="settings-section-body">
            {[
              { name: "OpenAI", status: "Connected", connected: true },
              { name: "Supabase", status: "Connected", connected: true },
              { name: "Resend", status: "Platform", connected: true },
              { name: "Dodo Payments", status: "Connected", connected: true },
              { name: "Claude", status: "Coming soon", connected: false },
              { name: "Veo", status: "Connected", connected: true },
              { name: "Nano Banana", status: "Connected", connected: true },
            ].map((item) => (
              <div key={item.name} className="integration-row">
                <span className="integration-name">{item.name}</span>
                <span
                  className={`integration-status ${item.connected ? "integration-status-connected" : ""}`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="section-card">
          <div className="card-header">
            <h2>API access</h2>
          </div>
          <div className="settings-section-body">
            <p className="avatar-note">
              Public API keys are not available yet. Use the dashboard for all generation and
              publishing workflows.
            </p>
            <span className="coming-soon-badge">Coming soon</span>
          </div>
        </div>

        <div className="section-card">
          <div className="card-header">
            <h2>Notifications</h2>
          </div>
          <div className="settings-section-body">
            {[
              "Email preferences",
              "Product updates",
              "Billing notifications",
              "Security alerts",
            ].map((item) => (
              <div key={item} className="settings-row">
                <span className="settings-row-label">{item}</span>
                <span className="coming-soon-badge">Coming soon</span>
              </div>
            ))}
          </div>
        </div>

        <div className="section-card">
          <div className="card-header">
            <h2>Data export</h2>
          </div>
          <div className="settings-section-body">
            <p className="avatar-note">Export your projects and workspace data.</p>
            <button type="button" className="delete-btn" disabled>
              Export data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
