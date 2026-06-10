"use client";

import { useState } from "react";
import {
  Ratio,
  Copy,
  ImageOff,
  Sparkles,
} from "lucide-react";
import { CREDIT_COSTS } from "@/lib/billing/credits";
import { GenerationPageHeader } from "../generation/GenerationPageHeader";
import { GenerationProgressOverlay } from "../generation/GenerationProgressOverlay";
import {
  ASPECT_RATIO_OPTIONS,
  IMAGE_PROMPT_IDEAS,
  IMAGE_STYLE_TILES,
} from "../generation/constants";
import type { DashboardDataContext } from "../hooks/useDashboardData";
import "../generation-pages.css";
import { formatShortDate } from "../utils";

const STYLE_SUFFIX: Record<string, string> = {
  dark: "dark cinematic style",
  minimal: "clean minimal style",
  neon: "neon glow style",
  warm: "warm natural lighting",
};

export function ImageGenerationPage({ data }: { data: DashboardDataContext }) {
  const cost = CREDIT_COSTS.media_image_generate;
  const images = data.mediaHistory.filter((m) => m.media_type === "image");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [imageStyle, setImageStyle] = useState("dark");
  const [quality, setQuality] = useState("Standard");
  const [negativePrompt, setNegativePrompt] = useState("");

  const possibleCount = cost > 0 ? Math.floor(data.creditsRemaining / cost) : 0;

  const buildPrompt = (base: string) => {
    let prompt = base;
    const styleSuffix = STYLE_SUFFIX[imageStyle];
    if (styleSuffix && !prompt.toLowerCase().includes(styleSuffix)) {
      prompt = `${prompt}, ${styleSuffix}`;
    }
    if (quality === "HD") prompt = `${prompt}, high detail`;
    if (quality === "Ultra (4K)") prompt = `${prompt}, ultra sharp 4K`;
    if (negativePrompt.trim()) {
      prompt = `${prompt}. Avoid: ${negativePrompt.trim()}`;
    }
    return prompt;
  };

  const handleGenerate = async () => {
    data.setMediaMode("image");
    const base = data.mediaPrompt.trim();
    await data.handleGenerateMedia("image", {
      aspectRatio,
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
        active={data.mediaGenerating && data.mediaMode === "image"}
        mode="media"
        title="Generating your image"
        subtitle="Rendering with StoneAI media pipeline"
      />

      <GenerationPageHeader
        title="Image Generation"
        cost={cost}
        costLabel="per image"
        remaining={data.creditsRemaining}
        extra={`${possibleCount} image${possibleCount === 1 ? "" : "s"} possible`}
      />

      <div className="gen-layout">
        <div>
          <div className="gen-card">
            <div className="gen-card-head">
              <span className="gen-card-title">Image prompt</span>
              <span className="gen-card-meta">
                <Ratio size={12} />
                {aspectRatio} · Hero image
              </span>
            </div>
            <div className="gen-card-body">
              <textarea
                className="prompt-area"
                value={data.mediaPrompt}
                onChange={(e) => data.setMediaPrompt(e.target.value)}
                placeholder="Describe the image you want to generate. Example: A minimal dark UI dashboard with glowing charts, floating panels, soft purple ambient light, cinematic depth of field, 8K ultra-sharp."
                disabled={data.mediaGenerating}
              />

              <div className="field-block mt-16">
                <span className="field-label">Aspect ratio</span>
                <div className="ratio-pills">
                  {ASPECT_RATIO_OPTIONS.map((option) => (
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

              <div className="field-block mt-16">
                <span className="field-label">Visual style</span>
                <div className="style-tiles">
                  {IMAGE_STYLE_TILES.map((tile) => (
                    <button
                      key={tile.id}
                      type="button"
                      className={`style-tile ${imageStyle === tile.id ? "active" : ""}`}
                      onClick={() => setImageStyle(tile.id)}
                      disabled={data.mediaGenerating}
                    >
                      <div className={`style-tile-thumb ${tile.className}`}>{tile.emoji}</div>
                      <div className="style-tile-label">{tile.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-grid-2">
                <div>
                  <label className="field-label" htmlFor="image-quality">
                    Quality
                  </label>
                  <select
                    id="image-quality"
                    className="select"
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                    disabled={data.mediaGenerating}
                  >
                    <option>Standard</option>
                    <option>HD</option>
                    <option>Ultra (4K)</option>
                  </select>
                </div>
                <div>
                  <label className="field-label" htmlFor="negative-prompt">
                    Negative prompt <span className="field-label-optional">(optional)</span>
                  </label>
                  <input
                    id="negative-prompt"
                    className="input"
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder="blurry, watermark, text…"
                    disabled={data.mediaGenerating}
                  />
                </div>
              </div>

              {data.mediaError ? <p className="gen-error">{data.mediaError}</p> : null}

              <button
                type="button"
                className={`gen-btn-main ${data.mediaGenerating || data.creditsRemaining < cost ? "disabled" : ""}`}
                disabled={data.mediaGenerating || data.creditsRemaining < cost}
                onClick={() => void handleGenerate()}
              >
                <Sparkles size={15} />
                {data.mediaGenerating ? "Generating image…" : "Generate image"}
                <span className="cost">· {cost} credits</span>
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="aside-panel">
            <div className="aside-head">
              <span className="aside-head-title">Recent images</span>
              <span className="aside-head-count">{images.length} total</span>
            </div>
            {images.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <ImageOff size={18} />
                </div>
                <div className="empty-title">No images generated yet</div>
                <div className="empty-sub">
                  Your generated images appear here. Download or insert them into any project.
                </div>
              </div>
            ) : (
              images.slice(0, 8).map((item) => (
                <div key={item.id} className="hist-row">
                  <div className="hist-thumb">
                    {item.asset_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.asset_url} alt="" />
                    ) : (
                      <Sparkles size={13} />
                    )}
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
              <span className="aside-head-title">Prompt ideas</span>
            </div>
            <div className="prompt-idea-list">
              {IMAGE_PROMPT_IDEAS.map((idea) => (
                <div
                  key={idea}
                  className="prompt-idea-row"
                  onClick={() => data.setMediaPrompt(idea)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") data.setMediaPrompt(idea);
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="prompt-idea-text">{idea}</div>
                  <Copy size={12} className="prompt-idea-copy" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
