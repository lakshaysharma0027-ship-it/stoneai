"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Ratio,
  Camera,
  Cpu,
  Drone,
  Film,
  Play,
  VideoOff,
  Waves,
} from "lucide-react";
import { CREDIT_COSTS } from "@/lib/billing/credits";
import { GenerationPageHeader } from "../generation/GenerationPageHeader";
import { GenerationProgressOverlay } from "../generation/GenerationProgressOverlay";
import { DURATION_OPTIONS, VIDEO_ASPECT_RATIO_OPTIONS } from "../generation/constants";
import type { DashboardDataContext } from "../hooks/useDashboardData";
import "../generation-pages.css";
import { formatShortDate } from "../utils";

const CAMERA_MOTIONS = [
  "Auto",
  "Static",
  "Slow pan left",
  "Slow pan right",
  "Zoom in",
  "Zoom out",
  "Orbit",
  "Drone aerial",
] as const;

const VIDEO_STYLES = [
  "Cinematic",
  "Documentary",
  "Product reveal",
  "Abstract motion",
  "Aerial",
] as const;

export function VideoGenerationPage({ data }: { data: DashboardDataContext }) {
  const cost = CREDIT_COSTS.media_video_generate;
  const videos = data.mediaHistory.filter((m) => m.media_type === "video");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [duration, setDuration] = useState<number>(8);
  const [cameraMotion, setCameraMotion] = useState<string>("Auto");
  const [visualStyle, setVisualStyle] = useState<string>("Cinematic");

  const canAfford = data.creditsRemaining >= cost;

  const buildPrompt = (base: string) => {
    let prompt = base;
    if (cameraMotion !== "Auto" && !prompt.toLowerCase().includes(cameraMotion.toLowerCase())) {
      prompt = `${prompt}, ${cameraMotion.toLowerCase()} camera`;
    }
    if (visualStyle && !prompt.toLowerCase().includes(visualStyle.toLowerCase())) {
      prompt = `${prompt}, ${visualStyle.toLowerCase()} style`;
    }
    return prompt;
  };

  const handleGenerate = async () => {
    data.setMediaMode("video");
    const base = data.mediaPrompt.trim();
    await data.handleGenerateMedia("video", {
      aspectRatio,
      durationSeconds: duration,
      prompt: base ? buildPrompt(base) : undefined,
    });
  };

  const statusClass = (status: string) => {
    if (status === "completed") return "hist-done";
    if (status === "failed") return "hist-failed";
    return "hist-pending";
  };

  return (
    <div className="gen-spec-page">
      <GenerationProgressOverlay
        active={data.mediaGenerating && data.mediaMode === "video"}
        mode="media"
        title="Generating your video"
        subtitle="Videos process in 2–5 minutes"
      />

      <GenerationPageHeader
        title="Video Generation"
        cost={cost}
        costLabel="per video"
        remaining={data.creditsRemaining}
      />

      <div className="gen-layout">
        <div>
          <div className="gen-card">
            <div className="gen-card-head">
              <span className="gen-card-title">Video prompt</span>
              <span className="gen-card-meta">
                <Ratio size={12} />
                {aspectRatio} · Hero video
              </span>
            </div>
            <div className="gen-card-body">
              <div className="model-badge">
                <Cpu size={11} className="model-badge-icon" />
                Powered by <span className="model-name">Veo</span> — Google&apos;s cinematic
                video model
              </div>

              <textarea
                className="prompt-area prompt-area--tall"
                value={data.mediaPrompt}
                onChange={(e) => data.setMediaPrompt(e.target.value)}
                placeholder="Describe the cinematic video you want — scene, motion, mood, camera movement, lighting. Example: A sleek product reveal of a dark laptop on a marble desk, slow camera pan from above, ambient studio lighting, soft purple bokeh in background, 4K cinematic."
                disabled={data.mediaGenerating}
              />

              <div className="field-block mt-16">
                <span className="field-label">Aspect ratio</span>
                <div className="ratio-pills">
                  {VIDEO_ASPECT_RATIO_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={`ratio-pill ${aspectRatio === option.id ? "active" : ""}`}
                      onClick={() => setAspectRatio(option.id)}
                      disabled={data.mediaGenerating}
                    >
                      <span className={`ratio-pill-preview ${option.preview}`} />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="field-block">
                <span className="field-label">Duration</span>
                <div className="dur-pills">
                  {DURATION_OPTIONS.map((seconds) => (
                    <button
                      key={seconds}
                      type="button"
                      className={`dur-pill ${duration === seconds ? "active" : ""}`}
                      onClick={() => setDuration(seconds)}
                      disabled={data.mediaGenerating}
                    >
                      {seconds}s
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-grid-2">
                <div>
                  <label className="field-label" htmlFor="camera-motion">
                    Camera motion
                  </label>
                  <select
                    id="camera-motion"
                    className="select"
                    value={cameraMotion}
                    onChange={(e) => setCameraMotion(e.target.value)}
                    disabled={data.mediaGenerating}
                  >
                    {CAMERA_MOTIONS.map((motion) => (
                      <option key={motion} value={motion}>
                        {motion}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="field-label" htmlFor="video-style">
                    Visual style
                  </label>
                  <select
                    id="video-style"
                    className="select"
                    value={visualStyle}
                    onChange={(e) => setVisualStyle(e.target.value)}
                    disabled={data.mediaGenerating}
                  >
                    {VIDEO_STYLES.map((style) => (
                      <option key={style} value={style}>
                        {style}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {!canAfford ? (
                <div className="credit-warning">
                  <AlertTriangle size={14} className="credit-warning-icon" />
                  <div className="credit-warning-text">
                    Video generation costs <strong>{cost} credits</strong> per video. You have{" "}
                    {data.creditsRemaining} credits remaining — upgrade to generate a video.
                  </div>
                </div>
              ) : null}

              {data.mediaError ? <p className="gen-error">{data.mediaError}</p> : null}

              <button
                type="button"
                className={`gen-btn-main gen-btn-main--spaced ${!canAfford || data.mediaGenerating ? "disabled" : ""}`}
                disabled={!canAfford || data.mediaGenerating}
                onClick={() => void handleGenerate()}
              >
                <Play size={15} />
                {data.mediaGenerating ? "Generating video…" : "Generate video"}
                <span className="cost">· {cost} credits</span>
              </button>
              <div className="gen-notice">
                {canAfford
                  ? "Videos process in 2–5 minutes · Download when complete"
                  : "Upgrade to Pro to unlock video generation · Videos process in 2–5 minutes"}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="aside-panel">
            <div className="aside-head">
              <span className="aside-head-title">Video queue</span>
              <span className="aside-head-count">{videos.length} total</span>
            </div>
            {videos.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <VideoOff size={18} />
                </div>
                <div className="empty-title">No videos generated yet</div>
                <div className="empty-sub">
                  Your generated videos appear here. Download or embed them in any project page.
                </div>
              </div>
            ) : (
              videos.slice(0, 8).map((item) => (
                <div key={item.id} className="hist-row">
                  <div className="hist-thumb">
                    <Play size={13} />
                  </div>
                  <div className="hist-info">
                    <div className="hist-name">{item.prompt}</div>
                    <div className="hist-time">
                      {formatShortDate(item.created_at)} · {item.credits_used} credits
                    </div>
                  </div>
                  <span className={`hist-status ${statusClass(item.status)}`}>
                    {item.status === "completed" ? "Done" : item.status}
                  </span>
                  {item.asset_url ? (
                    <div className="hist-actions">
                      <button
                        type="button"
                        className="hist-action-btn"
                        onClick={() => window.open(item.asset_url!, "_blank", "noopener,noreferrer")}
                      >
                        Open
                      </button>
                    </div>
                  ) : null}
                </div>
              ))
            )}
          </div>

          <div className="aside-panel">
            <div className="aside-head">
              <span className="aside-head-title">What Veo can do</span>
            </div>
            <div className="tip-list">
              <div className="tip-row">
                <Film size={15} className="tip-row-icon" />
                <div className="tip-text">
                  Photorealistic <strong>product reveals</strong> and showcase videos
                </div>
              </div>
              <div className="tip-row">
                <Drone size={15} className="tip-row-icon" />
                <div className="tip-text">
                  <strong>Aerial and drone-style</strong> flyover shots
                </div>
              </div>
              <div className="tip-row">
                <Waves size={15} className="tip-row-icon" />
                <div className="tip-text">
                  <strong>Abstract motion</strong> backgrounds for hero sections
                </div>
              </div>
              <div className="tip-row">
                <Camera size={15} className="tip-row-icon" />
                <div className="tip-text">
                  Smooth <strong>camera transitions</strong> — orbit, pan, zoom
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
