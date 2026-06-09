"use client";

import { useEffect, useState } from "react";
import { getTemplateById } from "@/lib/templates";
import { useEditorStore } from "./store";
import type { DeviceMode } from "./types";
import { Icon } from "./ui/Icon";
import { LogoMark } from "./ui/primitives";

function ToolButton({
  icon,
  title,
  active,
  disabled,
  onClick,
}: {
  icon: string;
  title: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-6 w-[26px] items-center justify-center rounded-[4px] border text-[var(--text-ghost)] transition-colors duration-75 hover:bg-[var(--bg-panel)] hover:text-[var(--text-muted)] disabled:cursor-not-allowed disabled:opacity-30 ${
        active
          ? "border-[var(--border-strong)] bg-[var(--bg-active)] text-[var(--text-primary)]"
          : "border-transparent bg-transparent"
      }`}
      type="button"
    >
      <Icon name={icon} size={14} />
    </button>
  );
}

export default function Toolbar() {
  const device = useEditorStore((state) => state.device);
  const website = useEditorStore((state) => state.website);
  const editorMode = useEditorStore((state) => state.editorMode);
  const isDirty = useEditorStore((state) => state.isDirty);
  const isSaving = useEditorStore((state) => state.isSaving);
  const canUndo = useEditorStore((state) => state.past.length > 0);
  const canRedo = useEditorStore((state) => state.future.length > 0);
  const setDevice = useEditorStore((state) => state.setDevice);
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);
  const saveDraft = useEditorStore((state) => state.saveDraft);
  const updateWebsiteSettings = useEditorStore((state) => state.updateWebsiteSettings);
  const [copied, setCopied] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishUrl, setPublishUrl] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [siteName, setSiteName] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [openGraphImageUrl, setOpenGraphImageUrl] = useState("");
  const [slug, setSlug] = useState("");
  const template = getTemplateById(website?.meta.templateId);

  useEffect(() => {
    if (!website) return;
    setSiteName(website.name);
    setSeoTitle(website.meta.title);
    setSeoDescription(website.meta.description);
    setFaviconUrl(website.meta.favicon ?? "");
    setOpenGraphImageUrl(website.meta.socialImage ?? "");
    setSlug(website.slug);
  }, [website]);

  const handleShare = async () => {
    if (typeof window === "undefined" || !navigator.clipboard) return;
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  const handlePreview = async () => {
    if (!website || typeof window === "undefined") return;
    await saveDraft();
    window.open(`/preview/${website.projectId}`, "_blank", "noopener,noreferrer");
  };

  const handleSaveSettings = () => {
    updateWebsiteSettings({
      name: siteName,
      seoTitle,
      seoDescription,
      faviconUrl,
      openGraphImageUrl,
      slug,
    });
    setSettingsOpen(false);
  };

  const handlePublish = async () => {
    if (!website) return;
    setPublishing(true);
    setPublishError(null);
    setPublishUrl(null);

    try {
      await saveDraft();
      const latestWebsite = useEditorStore.getState().website ?? website;
      const response = await fetch("/api/sites/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          website: latestWebsite,
          settings: {
            siteName: latestWebsite.name,
            seoTitle: latestWebsite.meta.title,
            seoDescription: latestWebsite.meta.description,
            faviconUrl: latestWebsite.meta.favicon,
            openGraphImageUrl: latestWebsite.meta.socialImage,
            slug: latestWebsite.slug,
          },
        }),
      });
      const payload = (await response.json()) as { publicUrl?: string; error?: string };

      if (!response.ok || !payload.publicUrl) {
        throw new Error(payload.error ?? "Could not publish site.");
      }

      setPublishUrl(payload.publicUrl);
      if (navigator.clipboard) await navigator.clipboard.writeText(payload.publicUrl);
    } catch (error) {
      setPublishError(error instanceof Error ? error.message : "Could not publish site.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <header className="no-select z-50 flex h-[38px] flex-shrink-0 items-center gap-2 border-b border-[var(--border-subtle)] bg-[var(--bg-base)] px-2.5">
      <div className="flex h-6 w-6 items-center justify-center rounded-[3px] border border-[var(--border-default)] bg-[var(--bg-panel)]">
        <LogoMark size={14} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="inline-flex max-w-full items-center rounded-[3px] border border-[var(--border-default)] bg-[var(--bg-panel)] px-1.5 py-0.5 text-[10px] text-[var(--text-faint)]">
          {website?.name ?? "Untitled Project"}
        </div>
        <div className="mt-0.5 truncate text-[11px] text-[var(--text-faint)]">
          Projects <span className="text-[#222]">/</span> Homepage{" "}
          <span className="text-[#222]">/</span>{" "}
          <span className="text-[var(--text-muted)]">Editor</span>
          {template && (
            <>
              {" "}
              <span className="text-[#222]">/</span>{" "}
              <span className="text-[var(--text-muted)]">
                Current Template: {template.name}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <ToolButton
          icon="undo"
          title="Undo (Ctrl+Z)"
          onClick={undo}
          disabled={!canUndo}
        />
        <ToolButton
          icon="redo"
          title="Redo (Ctrl+Shift+Z)"
          onClick={redo}
          disabled={!canRedo}
        />
      </div>

      <div className="flex items-center gap-1">
        {(["desktop", "tablet", "mobile"] as DeviceMode[]).map((mode) => (
          <ToolButton
            key={mode}
            icon={mode}
            title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} viewport`}
            active={device === mode}
            onClick={() => setDevice(mode)}
          />
        ))}
      </div>

      <div className="flex items-center gap-1">
        <ToolButton
          icon="eye"
          title="Open live preview"
          active={editorMode === "preview"}
          onClick={() => {
            void handlePreview();
          }}
        />
        <ToolButton
          icon="gear"
          title="Site settings"
          active={settingsOpen}
          onClick={() => setSettingsOpen(true)}
        />
        <ToolButton
          icon="share"
          title={copied ? "Copied link" : "Copy editor link"}
          onClick={() => {
            void handleShare();
          }}
        />
        <ToolButton
          icon="upload"
          title={isSaving ? "Saving" : isDirty ? "Save" : "Saved"}
          onClick={() => {
            void saveDraft();
          }}
          disabled={!isDirty || isSaving}
        />
        <button
          type="button"
          onClick={() => {
            void handlePublish();
          }}
          disabled={!website || publishing || isSaving}
          className="ml-1 h-6 rounded-[4px] border border-[var(--border-strong)] bg-[var(--bg-active)] px-2 text-[10px] font-medium text-[var(--text-primary)] transition-colors duration-75 hover:bg-[var(--bg-panel)] disabled:cursor-not-allowed disabled:opacity-40"
          title="Publish site"
        >
          {publishing ? "Publishing" : "Publish"}
        </button>
      </div>

      {(settingsOpen || publishUrl || publishError) && (
        <div className="absolute right-2 top-10 z-[80] w-80 rounded-[6px] border border-[var(--border-default)] bg-[var(--bg-base)] p-3 shadow-2xl">
          {settingsOpen ? (
            <div className="space-y-2">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-medium text-[var(--text-primary)]">Site Settings</span>
                <button className="text-[11px] text-[var(--text-faint)]" type="button" onClick={() => setSettingsOpen(false)}>Close</button>
              </div>
              {[
                ["Site Name", siteName, setSiteName],
                ["SEO Title", seoTitle, setSeoTitle],
                ["SEO Description", seoDescription, setSeoDescription],
                ["Favicon", faviconUrl, setFaviconUrl],
                ["Open Graph Image", openGraphImageUrl, setOpenGraphImageUrl],
                ["Slug", slug, setSlug],
              ].map(([label, value, setter]) => (
                <label key={label as string} className="block">
                  <span className="mb-1 block text-[10px] uppercase tracking-wide text-[var(--text-faint)]">{label as string}</span>
                  <input
                    value={value as string}
                    onChange={(event) => (setter as (next: string) => void)(event.target.value)}
                    className="h-8 w-full rounded-[4px] border border-[var(--border-default)] bg-[var(--bg-panel)] px-2 text-[11px] text-[var(--text-primary)] outline-none"
                  />
                </label>
              ))}
              <button
                type="button"
                onClick={handleSaveSettings}
                className="mt-1 h-8 w-full rounded-[4px] border border-[var(--border-strong)] bg-[var(--bg-active)] text-[11px] text-[var(--text-primary)]"
              >
                Save Settings
              </button>
            </div>
          ) : null}
          {publishUrl ? (
            <div className="mt-2 text-[11px] text-[var(--text-muted)]">
              Published:{" "}
              <a href={publishUrl} target="_blank" rel="noreferrer" className="text-[var(--text-primary)] underline">
                {publishUrl}
              </a>
            </div>
          ) : null}
          {publishError ? <div className="mt-2 text-[11px] text-red-300">{publishError}</div> : null}
        </div>
      )}
    </header>
  );
}
