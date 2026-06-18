import type { CinematicExperience } from "@/lib/cinematic/types";
import {
  DEFAULT_FRAME_COUNT,
  DEFAULT_SCROLL_HEIGHT_VH,
} from "@/lib/cinematic/types";
import type { CinematicScenePlanResponse } from "@/lib/ai/structuredSchemas";
import { createWebsite, nowIso } from "@/lib/editor/websiteFactory";
import type { Website } from "@/lib/editor/schema";

export const buildCinematicExperience = (
  plan: CinematicScenePlanResponse,
  media: {
    frames: string[];
    frameSource: "video" | "interpolated" | "hero_only";
    heroImageUrl?: string | null;
    lastFrameImageUrl?: string | null;
    motionVideoUrl?: string | null;
  },
): CinematicExperience => ({
  mode: "cinematic_scroll",
  projectName: plan.projectName,
  story: plan.story,
  scenes: plan.scenes.map((scene) => ({
    id: scene.id,
    title: scene.title,
    subtitle: scene.subtitle,
    body: scene.body,
    scrollStart: scene.scrollStart,
    ctaLabel: scene.ctaLabel,
  })),
  frames: media.frames,
  frameCount: media.frames.length || DEFAULT_FRAME_COUNT,
  frameSource: media.frameSource,
  scrollHeightVh: DEFAULT_SCROLL_HEIGHT_VH,
  heroImageUrl: media.heroImageUrl ?? null,
  lastFrameImageUrl: media.lastFrameImageUrl ?? null,
  motionVideoUrl: media.motionVideoUrl ?? null,
  seo: plan.seo,
});

export const cinematicExperienceToWebsite = (
  projectId: string,
  experience: CinematicExperience,
): Website => {
  const website = createWebsite(projectId, {
    title: experience.seo.title,
    description: experience.seo.description,
  });

  return {
    ...website,
    meta: {
      ...website.meta,
      title: experience.seo.title,
      description: experience.seo.description,
      renderMode: "cinematic_scroll",
      cinematicExperience: experience,
    },
    globalStyles: {
      colors: {
        background: "#050505",
        foreground: "#f5f3ef",
        primary: "#c9a84c",
        secondary: "#1a1a1a",
        muted: "#888888",
      },
      typography: {
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        headingFontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        baseSize: "16px",
      },
      radius: "0px",
    },
    updatedAt: nowIso(),
  };
};
