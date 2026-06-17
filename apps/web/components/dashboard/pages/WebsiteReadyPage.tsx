"use client";

import { useState } from "react";
import {
  ExternalLink,
  Globe,
  Link2,
  RefreshCw,
  Rocket,
  Sparkles,
  Wand2,
} from "lucide-react";
import { templateSchemaToWebsite } from "@/lib/editor/applyTemplateSchema";
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
  const [schema, setSchema] = useState<TemplateSchema | null>(project?.websiteSchema ?? null);
  const [metadata, setMetadata] = useState<PipelineMetadata | null>(
    (project as { pipelineMetadata?: PipelineMetadata } | undefined)?.pipelineMetadata ?? null,
  );

  const planId = normalizeBillingPlanId(data.billingSummary?.subscription.plan);
  const canEdit = planHasFeature(planId, "ai_website_edit");
  const editsRemaining = metadata?.aiEditsRemaining ?? 0;
  const site = data.publishedSites.find((item) => item.project_id === projectId);

  const handlePublish = async () => {
    if (!schema) return;
    setPublishing(true);
    setPublishError(null);
    try {
      const website = templateSchemaToWebsite(projectId, project?.name ?? "Generated Website", schema);
      const response = await fetch("/api/sites/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website }),
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
    if (!schema || !editPrompt.trim()) return;
    setEditing(true);
    setEditError(null);
    try {
      const response = await fetch("/api/ai/pipeline/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          instruction: editPrompt.trim(),
          websiteSchema: schema,
        }),
      });
      const payload = (await response.json()) as {
        error?: string;
        websiteSchema?: TemplateSchema;
        pipelineMetadata?: PipelineMetadata;
        aiEditsRemaining?: number;
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
    <div className="gen-spec-page website-ready">
      <div className="website-ready-hero">
        <div>
          <p className="website-ready-kicker">Website Ready</p>
          <h1>{project.name}</h1>
          <p>Your cinematic website pipeline is complete. Preview, publish, or refine with AI.</p>
        </div>
        <div className="website-ready-actions">
          <a href={`/preview/${projectId}`} className="btn btn-primary" target="_blank" rel="noreferrer">
            <ExternalLink size={14} />
            Live Preview
          </a>
          <button type="button" className="btn btn-primary" disabled={publishing || !schema} onClick={() => void handlePublish()}>
            <Rocket size={14} />
            {publishing ? "Publishing…" : site?.status === "published" ? "Republish" : "Publish"}
          </button>
          <button type="button" className="btn" onClick={() => onNavigate("domains")}>
            <Link2 size={14} />
            Connect Domain
          </button>
          <button type="button" className="btn" onClick={() => onNavigate("generate-website")}>
            <RefreshCw size={14} />
            Regenerate Website
          </button>
        </div>
        {publishError ? <p className="gen-error">{publishError}</p> : null}
      </div>

      <div className="website-ready-grid">
        <div className="gen-card">
          <div className="gen-card-head">
            <span className="gen-card-title">Pipeline output</span>
          </div>
          <div className="gen-card-body pipeline-review">
            <div><span>Hero image</span><strong>{metadata?.heroImageReady || metadata?.heroImageUrl ? "Generated" : "Preset"}</strong></div>
            <div><span>Motion</span><strong>{metadata?.motionVideoReady || metadata?.motionVideoUrl ? "Veo clip ready" : "Skipped"}</strong></div>
            <div><span>Publish status</span><strong>{site?.status === "published" ? "Published" : "Draft"}</strong></div>
            {site?.public_url ? (
              <div>
                <span>Live URL</span>
                <a href={site.public_url} target="_blank" rel="noreferrer">
                  <Globe size={12} /> {site.public_url}
                </a>
              </div>
            ) : null}
          </div>
        </div>

        <div className="gen-card">
          <div className="gen-card-head">
            <span className="gen-card-title">Premium AI edits</span>
            {canEdit ? (
              <span className="gen-card-meta">AI Edits Remaining: {editsRemaining}</span>
            ) : (
              <span className="gen-card-meta">Premium only</span>
            )}
          </div>
          <div className="gen-card-body">
            {canEdit ? (
              <>
                <textarea
                  className="prompt-area"
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  placeholder="Make the website more premium, add testimonials, add pricing, change palette…"
                  disabled={editing || editsRemaining <= 0}
                />
                {editError ? <p className="gen-error">{editError}</p> : null}
                <button
                  type="button"
                  className="gen-btn-main"
                  disabled={editing || editsRemaining <= 0 || !editPrompt.trim()}
                  onClick={() => void handleAiEdit()}
                >
                  <Wand2 size={15} />
                  {editing ? "Applying edit…" : "AI Edit Website"}
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
    </div>
  );
}
