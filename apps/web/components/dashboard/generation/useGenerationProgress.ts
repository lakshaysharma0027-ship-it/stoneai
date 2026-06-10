"use client";

import { useEffect, useState } from "react";

const WEBSITE_STEPS = [
  "Understanding prompt",
  "Building structure",
  "Writing content",
  "Generating assets",
  "Preparing editor",
  "Opening project",
] as const;

const MEDIA_STEPS = [
  "Understanding prompt",
  "Composing scene",
  "Rendering frames",
  "Finalizing output",
  "Saving to library",
] as const;

export function useGenerationProgress(active: boolean, mode: "website" | "media") {
  const steps = mode === "website" ? WEBSITE_STEPS : MEDIA_STEPS;
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!active) {
      setStepIndex(0);
      return;
    }

    setStepIndex(0);
    const interval = window.setInterval(() => {
      setStepIndex((current) => {
        if (current >= steps.length - 1) return current;
        return current + 1;
      });
    }, mode === "website" ? 4200 : 3500);

    return () => window.clearInterval(interval);
  }, [active, mode, steps.length]);

  const progress = active
    ? Math.min(((stepIndex + 1) / steps.length) * 100, 95)
    : 0;

  return { steps, stepIndex, progress };
}
