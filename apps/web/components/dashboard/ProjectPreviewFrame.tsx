"use client";

import { useEffect, useState } from "react";
import type { Website } from "@/lib/editor/schema";
import { WebsiteRenderer } from "@/components/sites/WebsiteRenderer";
import { TemplateHtmlFrame } from "@/components/sites/TemplateHtmlFrame";

export function ProjectPreviewFrame({
  projectId,
  className,
  compact = false,
}: {
  projectId: string;
  className?: string;
  compact?: boolean;
}) {
  const [website, setWebsite] = useState<Website | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/projects/${projectId}/preview-website`, {
          credentials: "same-origin",
          cache: "no-store",
        });
        const payload = (await response.json()) as { website?: Website; error?: string };
        if (!response.ok) {
          throw new Error(payload.error ?? "Preview unavailable.");
        }
        if (!payload.website) {
          throw new Error("Preview unavailable.");
        }
        if (!cancelled) setWebsite(payload.website);
      } catch (loadError) {
        if (!cancelled) {
          setWebsite(null);
          setError(loadError instanceof Error ? loadError.message : "Preview unavailable.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  if (loading) {
    return (
      <div className={`project-preview-frame project-preview-loading ${className ?? ""}`}>
        <span>Loading preview…</span>
      </div>
    );
  }

  if (error || !website) {
    return (
      <div className={`project-preview-frame project-preview-error ${className ?? ""}`}>
        <span>{error ?? "Preview unavailable"}</span>
      </div>
    );
  }

  if (website.meta.renderMode === "template_html" && website.meta.templateId) {
    return (
      <div
        className={`project-preview-frame${compact ? " project-preview-frame-compact" : ""} ${className ?? ""}`}
      >
        <TemplateHtmlFrame
          src={`/api/projects/${projectId}/template-html`}
          title={website.meta.title || website.name}
        />
      </div>
    );
  }

  return (
    <div
      className={`project-preview-frame${compact ? " project-preview-frame-compact" : ""} ${className ?? ""}`}
    >
      <div className="project-preview-scaler">
        <WebsiteRenderer website={website} />
      </div>
    </div>
  );
}
