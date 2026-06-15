"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useGenerationProgress } from "./useGenerationProgress";
import "../generation-pages.css";

type GenerationProgressOverlayProps = {
  active: boolean;
  mode: "website" | "media" | "pipeline";
  title: string;
  subtitle: string;
};

export function GenerationProgressOverlay({
  active,
  mode,
  title,
  subtitle,
}: GenerationProgressOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const { steps, stepIndex, progress } = useGenerationProgress(active, mode);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !active) return null;

  return createPortal(
    <div className="gen-progress-overlay gen-spec-page" role="status" aria-live="polite">
      <div className="gen-progress-card">
        <div className="gen-progress-spinner" aria-hidden />
        <div className="gen-progress-title">{title}</div>
        <div className="gen-progress-sub">{subtitle}</div>
        <div className="gen-progress-track">
          <div
            className="gen-progress-fill"
            data-pct={Math.min(100, Math.round(progress / 5) * 5)}
          />
        </div>
        <div className="gen-progress-steps">
          {steps.map((step, index) => {
            const state =
              index < stepIndex ? "done" : index === stepIndex ? "active" : "";
            return (
              <div key={step} className={`gen-progress-step ${state}`}>
                <span className="gen-progress-step-dot" aria-hidden>
                  {index < stepIndex ? "✓" : index + 1}
                </span>
                {step}
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    document.body,
  );
}
