export type CinematicScene = {
  id: string;
  title: string;
  subtitle?: string;
  body?: string;
  /** 0–1 scroll progress where this scene fades in */
  scrollStart: number;
  ctaLabel?: string;
};

export type CinematicExperience = {
  mode: "cinematic_scroll";
  projectName: string;
  story: string;
  scenes: CinematicScene[];
  /** Scroll-scrub frame sequence (JPEG data URLs or HTTPS) */
  frames: string[];
  frameCount: number;
  /** How frames were produced */
  frameSource?: "video" | "interpolated" | "hero_only";
  /** Total scroll height as viewport multiples */
  scrollHeightVh: number;
  heroImageUrl?: string | null;
  lastFrameImageUrl?: string | null;
  motionVideoUrl?: string | null;
  seo: {
    title: string;
    description: string;
  };
};

export const DEFAULT_FRAME_COUNT = 80;
export const DEFAULT_SCROLL_HEIGHT_VH = 800;
/** On mobile, use every Nth frame to reduce memory and load time. */
export const MOBILE_FRAME_STEP = 2;
