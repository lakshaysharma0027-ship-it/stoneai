"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import type { CinematicExperience, CinematicScene } from "@/lib/cinematic/types";
import { MOBILE_FRAME_STEP } from "@/lib/cinematic/types";
import "./cinematic-scroll.css";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  experience: CinematicExperience;
};

const activeSceneAt = (scenes: CinematicScene[], progress: number) => {
  let active = scenes[0];
  for (const scene of scenes) {
    if (progress >= scene.scrollStart) active = scene;
  }
  return active;
};

const subsampleFrames = (frames: string[], step: number) => {
  if (step <= 1 || frames.length <= 2) return frames;
  const sampled = frames.filter((_, index) => index % step === 0 || index === frames.length - 1);
  return sampled.length > 0 ? sampled : frames;
};

export default function CinematicScrollExperience({ experience }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const depthRef = useRef<HTMLDivElement>(null);
  const [activeScene, setActiveScene] = useState(experience.scenes[0]);
  const [loadedFrames, setLoadedFrames] = useState<HTMLImageElement[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const frameSources = useMemo(() => {
    if (typeof window === "undefined") return experience.frames;
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    return mobile ? subsampleFrames(experience.frames, MOBILE_FRAME_STEP) : experience.frames;
  }, [experience.frames]);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 768px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setIsMobile(mobileQuery.matches);
      setReducedMotion(motionQuery.matches);
    };
    sync();
    mobileQuery.addEventListener("change", sync);
    motionQuery.addEventListener("change", sync);
    return () => {
      mobileQuery.removeEventListener("change", sync);
      motionQuery.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (frameSources.length === 0) return;
      const images = await Promise.all(
        frameSources.map(
          (src) =>
            new Promise<HTMLImageElement>((resolve, reject) => {
              const img = new Image();
              img.crossOrigin = "anonymous";
              img.onload = () => resolve(img);
              img.onerror = reject;
              img.src = src;
            }),
        ),
      );
      if (!cancelled) setLoadedFrames(images);
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [frameSources]);

  useEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    if (!root || !pin) return;

    if (reducedMotion) {
      const canvas = canvasRef.current;
      if (canvas && loadedFrames.length > 0) {
        const ctx = canvas.getContext("2d");
        const img = loadedFrames[loadedFrames.length - 1];
        if (ctx && img) {
          canvas.width = img.naturalWidth || 1920;
          canvas.height = img.naturalHeight || 1080;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
      }
      return;
    }

    const lenis = new Lenis({ lerp: isMobile ? 0.12 : 0.08, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    const useVideoScrub =
      loadedFrames.length <= 1 &&
      Boolean(experience.motionVideoUrl?.startsWith("data:") || experience.motionVideoUrl?.startsWith("http"));
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    const depth = depthRef.current;
    const progressBar = progressBarRef.current;

    const drawFrame = (index: number) => {
      if (!canvas || loadedFrames.length === 0) return;
      const ctx = canvas.getContext("2d");
      const img = loadedFrames[Math.min(loadedFrames.length - 1, Math.max(0, index))];
      if (!ctx || !img) return;
      if (canvas.width !== (img.naturalWidth || 1920)) {
        canvas.width = img.naturalWidth || 1920;
        canvas.height = img.naturalHeight || 1080;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: `+=${experience.scrollHeightVh}%`,
        scrub: true,
        pin: pin,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          setActiveScene(activeSceneAt(experience.scenes, progress));

          if (progressBar) {
            progressBar.style.transform = `scaleY(${progress})`;
          }

          if (overlay) {
            gsap.set(overlay, { y: progress * (isMobile ? 20 : 40) });
          }
          if (depth) {
            gsap.set(depth, { scale: 1 + progress * 0.04, opacity: 0.35 + progress * 0.25 });
          }

          if (useVideoScrub && video && video.duration) {
            video.currentTime = progress * video.duration;
          } else if (loadedFrames.length > 0) {
            const frameIndex = Math.round(progress * (loadedFrames.length - 1));
            drawFrame(frameIndex);
          }
        },
      },
    });

    timeline.to({}, { duration: 1 });

    if (loadedFrames.length > 0) {
      drawFrame(0);
    }

    return () => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [experience, loadedFrames, isMobile, reducedMotion]);

  const finalScene = experience.scenes[experience.scenes.length - 1];

  if (reducedMotion) {
    return (
      <div className="cinematic-root cinematic-reduced">
        <div className="cinematic-pin cinematic-pin-static">
          <div className="cinematic-media">
            <canvas ref={canvasRef} className="cinematic-canvas" />
            <div className="cinematic-vignette" />
          </div>
          <div className="cinematic-overlay">
            <p className="cinematic-eyebrow">{experience.projectName}</p>
            <h1 className="cinematic-title">{experience.scenes[0]?.title}</h1>
            <p className="cinematic-body">{experience.story}</p>
          </div>
        </div>
        <section className="cinematic-scenes-list">
          {experience.scenes.map((scene) => (
            <article key={scene.id} className="cinematic-scene-card">
              <h2>{scene.title}</h2>
              {scene.subtitle ? <p className="cinematic-subtitle">{scene.subtitle}</p> : null}
              {scene.body ? <p className="cinematic-body">{scene.body}</p> : null}
            </article>
          ))}
        </section>
        <section className="cinematic-cta">
          <p className="cinematic-eyebrow">{finalScene?.title ?? "Experience"}</p>
          <h2>{finalScene?.ctaLabel ?? "Begin your journey"}</h2>
          <p>{experience.story}</p>
        </section>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="cinematic-root">
      <div ref={pinRef} className="cinematic-pin">
        <div className="cinematic-media">
          <canvas ref={canvasRef} className="cinematic-canvas" />
          {experience.motionVideoUrl ? (
            <video
              ref={videoRef}
              className="cinematic-video"
              src={experience.motionVideoUrl}
              muted
              playsInline
              preload="auto"
            />
          ) : null}
          <div ref={depthRef} className="cinematic-depth-layer" aria-hidden />
          <div className="cinematic-vignette" />
        </div>

        <div ref={overlayRef} className="cinematic-overlay">
          <p className="cinematic-eyebrow">{experience.projectName}</p>
          <h1 className="cinematic-title">{activeScene?.title}</h1>
          {activeScene?.subtitle ? (
            <p className="cinematic-subtitle">{activeScene.subtitle}</p>
          ) : null}
          {activeScene?.body ? <p className="cinematic-body">{activeScene.body}</p> : null}
        </div>

        <div className="cinematic-progress">
          <span>Scroll to journey</span>
          <div className="cinematic-progress-track">
            <div ref={progressBarRef} className="cinematic-progress-bar" />
          </div>
        </div>
      </div>

      <section className="cinematic-cta">
        <p className="cinematic-eyebrow">{finalScene?.title ?? "Experience"}</p>
        <h2>{finalScene?.ctaLabel ?? "Begin your journey"}</h2>
        <p>{experience.story}</p>
      </section>
    </div>
  );
}
