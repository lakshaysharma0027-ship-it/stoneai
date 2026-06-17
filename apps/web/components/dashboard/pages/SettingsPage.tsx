"use client";

import { useState } from "react";
import { LogOut, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import type { DashboardDataContext } from "../hooks/useDashboardData";
import "../billing-settings.css";

export function SettingsPage({ data }: { data: DashboardDataContext }) {
  const router = useRouter();
  const defaultName = data.userName.includes("@")
    ? (data.userName.split("@")[0] ?? data.userName)
    : data.userName;
  const [displayName, setDisplayName] = useState(defaultName);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const planName = data.billingSummary?.plan.name ?? "Free Trial";
  const subscriptionStatus = data.billingSummary?.subscription.status ?? "trialing";
  const workspaceId = data.userEmail ? data.userEmail.split("@")[0] : "workspace";

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveMessage(null);
    try {
      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: displayName.trim() }),
      });
      const payload = (await response.json()) as { error?: string; displayName?: string };
      if (!response.ok) throw new Error(payload.error ?? "Could not save profile.");
      setSaveMessage("Profile saved.");
      if (payload.displayName) {
        data.setUserDisplayName(payload.displayName);
      }
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Could not save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Delete your account permanently? All projects, websites, and billing data will be removed.",
    );
    if (!confirmed) return;

    setDeleting(true);
    setDeleteError(null);
    try {
      const response = await fetch("/api/account/delete", { method: "DELETE" });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Could not delete account.");
      router.replace("/login");
      router.refresh();
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "Could not delete account.");
    } finally {
      setDeleting(false);
    }
  };

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
            {saveError ? <p className="gen-error">{saveError}</p> : null}
            {saveMessage ? <p className="pipeline-copy">{saveMessage}</p> : null}
            <button
              type="button"
              className="save-btn"
              disabled={saving || displayName.trim().length < 2}
              onClick={() => void handleSaveProfile()}
            >
              <Save size={13} />
              {saving ? "Saving…" : "Save changes"}
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

          <div className="section-card" style={{ marginTop: 16 }}>
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
                {deleteError ? <p className="gen-error">{deleteError}</p> : null}
                <button
                  type="button"
                  className="delete-btn"
                  disabled={deleting}
                  onClick={() => void handleDeleteAccount()}
                >
                  {deleting ? "Deleting…" : "Delete account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
