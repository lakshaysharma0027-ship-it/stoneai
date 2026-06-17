"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  Cloud,
  Copy,
  Download,
  ExternalLink,
  ImageIcon,
  Link2,
  RefreshCw,
  Rocket,
  Sparkles,
  Video,
  Wand2,
  Globe,
} from "lucide-react";
import { planHasFeature } from "@/lib/billing/planFeatures";
import { normalizeBillingPlanId } from "@/lib/billing/plans";
import type { PipelineMetadata } from "@/lib/pipeline/types";
import type { TemplateSchema } from "@/lib/templateSchemas";
import type { DashboardDataContext } from "../hooks/useDashboardData";
import "../generation-pages.css";

export function WebsiteReadyPage({
  data,
  projectId,
  onNavigate,
}: {
  data: DashboardDataContext;
  projectId: string;
  onNavigate: (view: "generate-website" | "domains" | "billing") => void;
}) {
  const project = data.projects.find((item) => item.id === projectId);
  const [editPrompt, setEditPrompt] = useState("");
  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [schema, setSchema] = useState<TemplateSchema | null>(project?.websiteSchema ?? null);
  const [metadata, setMetadata] = useState<PipelineMetadata | null>(
    (project as { pipelineMetadata?: PipelineMetadata } | undefined)?.pipelineMetadata ?? null,
  );

  const planId = normalizeBillingPlanId(data.billingSummary?.subscription.plan);
  const canEdit = planHasFeature(planId, "ai_website_edit");
  const editsRemaining = metadata?.aiEditsRemaining ?? 0;
  const site = data.publishedSites.find((item) => item.project_id === projectId);
  const isPublished = site?.status === "published";
  const isCinematic = metadata?.renderMode === "cinematic_scroll";

  useEffect(() => {
    void data.refreshSites?.();
    void data.refreshProjects?.();
  }, [projectId, data.refreshSites, data.refreshProjects]);

  const previewSrc = useMemo(() => {
    if (isPublished && site?.public_url) {
      return site.public_url;
    }
    return `/preview/${projectId}`;
  }, [isPublished, site?.public_url, projectId]);

  const liveUrl = site?.public_url ?? null;
  const previewLabel = isPublished ? "Live website" : "Draft preview";

  const handleCopyUrl = async () => {
    const url = liveUrl ?? `${window.location.origin}/preview/${projectId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const handleExport = async () => {
    setExporting(true);
    setExportError(null);
    try {
      await data.handleExportProject(projectId, project?.name ?? "stoneai-site");
    } catch (error) {
      setExportError(error instanceof Error ? error.message : "Could not export website.");
    } finally {
      setExporting(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    setPublishError(null);
    try {
      const response = await fetch("/api/sites/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
      const payload = (await response.json()) as { error?: string; publicUrl?: string };
      if (!response.ok) throw new Error(payload.error ?? "Could not publish website.");
      await data.refreshSites?.();
    } catch (error) {
      setPublishError(error instanceof Error ? error.message : "Could not publish website.");
    } finally {
      setPublishing(false);
    }
  };

  const handleAiEdit = async () => {
    if (!editPrompt.trim()) return;
    setEditing(true);
    setEditError(null);
    try {
      const response = await fetch("/api/ai/pipeline/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          instruction: editPrompt.trim(),
        }),
      });
      const payload = (await response.json()) as {
        error?: string;
        websiteSchema?: TemplateSchema;
        pipelineMetadata?: PipelineMetadata;
      };
      if (!response.ok) throw new Error(payload.error ?? "Could not apply AI edit.");
      if (payload.websiteSchema) setSchema(payload.websiteSchema);
      if (payload.pipelineMetadata) setMetadata(payload.pipelineMetadata);
      setEditPrompt("");
      await data.refreshProjects?.();
    } catch (error) {
      setEditError(error instanceof Error ? error.message : "Could not apply AI edit.");
    } finally {
      setEditing(false);
    }
  };

  if (!project) {
    return (
      <div className="gen-spec-page">
        <div className="empty-state">
          <div className="empty-title">Website not found</div>
          <button type="button" className="btn btn-primary" onClick={() => onNavigate("generate-website")}>
            Create a new website
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="gen-spec-page website-ready website-ready-v2">
      <p className="website-ready-kicker">Website ready</p>
      <div className="wr-title-row">
        <h1>{project.name}</h1>
        {isPublished ? (
          <span className="wr-status-badge wr-status-live">
            <Check size={12} />
            Published
          </span>
        ) : (
          <span className="wr-status-badge wr-status-draft">Draft</span>
        )}
      </div>
      <p className="wr-subtitle">
        Your cinematic website pipeline is complete. Preview, publish, or refine with AI.
      </p>

      <div className="wr-hero-grid">
        <div className="wr-preview-wrap">
          <iframe
            key={previewSrc}
            title={`${project.name} preview`}
            className="wr-preview-frame"
            src={previewSrc}
            loading="lazy"
          />
          <a
            href={previewSrc}
            target="_blank"
            rel="noreferrer"
            className="wr-preview-open"
            aria-label="Open full preview"
          >
            <ExternalLink size={14} />
          </a>
          <span className="wr-preview-tag">{previewLabel}</span>
        </div>

        <div className="wr-action-list">
          <a
            href={`/preview/${projectId}`}
            target="_blank"
            rel="noreferrer"
            className="wr-action-row"
          >
            <ExternalLink size={16} />
            Live preview
            <ChevronRight size={14} className="wr-action-chev" />
          </a>
          <button
            type="button"
            className="wr-action-row"
            disabled={exporting || !isCinematic}
            onClick={() => void handleExport()}
          >
            <Download size={16} />
            {exporting ? "Exporting…" : "Download ZIP"}
            <ChevronRight size={14} className="wr-action-chev" />
          </button>
          <button
            type="button"
            className="wr-action-row"
            disabled={publishing || !isCinematic}
            onClick={() => void handlePublish()}
          >
            <Rocket size={16} />
            {publishing ? "Publishing…" : isPublished ? "Republish" : "Publish"}
            <ChevronRight size={14} className="wr-action-chev" />
          </button>
          <button type="button" className="wr-action-row" onClick={() => onNavigate("domains")}>
            <Link2 size={16} />
            Connect domain
            <ChevronRight size={14} className="wr-action-chev" />
          </button>
          <button type="button" className="wr-action-row" onClick={() => onNavigate("generate-website")}>
            <RefreshCw size={16} />
            Regenerate website
            <ChevronRight size={14} className="wr-action-chev" />
          </button>
        </div>
      </div>

      {(publishError || exportError) && (
        <p className="gen-error">{publishError ?? exportError}</p>
      )}

      <div className="wr-panel-grid">
        <div className="wr-panel">
          <p className="wr-panel-title">Pipeline output</p>
          <div className="wr-data-row">
            <span className="wr-data-label">
              <ImageIcon size={15} />
              Hero image
            </span>
            <span className="wr-pill-neutral">
              {metadata?.heroImageReady || metadata?.heroImageUrl ? "Generated" : "Preset"}
            </span>
          </div>
          <div className="wr-data-row">
            <span className="wr-data-label">
              <Video size={15} />
              Motion
            </span>
            <span className="wr-pill-neutral">
              {metadata?.motionVideoReady || metadata?.motionVideoUrl ? "Veo clip ready" : "Skipped"}
            </span>
          </div>
          <div className="wr-data-row">
            <span className="wr-data-label">
              <Cloud size={15} />
              Publish status
            </span>
            <span className={isPublished ? "wr-pill-success" : "wr-pill-neutral"}>
              {isPublished ? "Published" : "Draft"}
            </span>
          </div>
          <div className="wr-data-row wr-data-row-url">
            <span className="wr-data-label">
              <Globe size={15} />
              Live URL
            </span>
            <span className="wr-url-text" title={liveUrl ?? undefined}>
              {liveUrl
                ? liveUrl.replace(/^https?:\/\//, "")
                : "Publish to get a live URL"}
            </span>
            <button
              type="button"
              className="wr-copy-btn"
              aria-label="Copy URL"
              onClick={() => void handleCopyUrl()}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        <div className="wr-panel">
          <div className="wr-panel-head">
            <p className="wr-panel-title">Premium AI edits</p>
            {canEdit ? (
              <span className="wr-edits-left">{editsRemaining} edits left</span>
            ) : (
              <span className="wr-edits-left">Premium only</span>
            )}
          </div>
          {canEdit ? (
            <>
              <textarea
                className="wr-ai-textarea"
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder="Refine scene titles, deepen the story, adjust the journey tone…"
                disabled={editing || editsRemaining <= 0}
              />
              {editError ? <p className="gen-error">{editError}</p> : null}
              <button
                type="button"
                className="wr-btn-ai"
                disabled={editing || editsRemaining <= 0 || !editPrompt.trim()}
                onClick={() => void handleAiEdit()}
              >
                <Wand2 size={15} />
                {editing ? "Applying edit…" : "AI edit website"}
              </button>
            </>
          ) : (
            <div className="pipeline-locked">
              <Sparkles size={16} />
              <div>
                <strong>AI edits require Basic or above</strong>
                <p>Upgrade to edit your generated website with prompt-based AI changes.</p>
                <button type="button" className="pipeline-upgrade" onClick={() => onNavigate("billing")}>
                  Upgrade plan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
