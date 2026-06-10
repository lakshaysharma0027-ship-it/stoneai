"use client";

import { Download, Play } from "lucide-react";
import { CREDIT_COSTS } from "@/lib/billing/credits";
import type { DashboardDataContext } from "../hooks/useDashboardData";
import { chipClassForStatus, formatShortDate } from "../utils";

export function VideoGenerationPage({ data }: { data: DashboardDataContext }) {
  const cost = CREDIT_COSTS.media_video_generate;
  const videos = data.mediaHistory.filter((m) => m.media_type === "video");

  return (
    <div className="dashboard-content-inner">
      <header className="mb-4">
        <h1 className="text-[18px] font-semibold tracking-[-0.03em] text-white">
          Video Generation
        </h1>
        <p className="mt-0.5 text-[12px] text-[var(--dash-muted)]">
          Powered by Veo · {cost} credits per video · {data.creditsRemaining.toLocaleString()}{" "}
          remaining
        </p>
      </header>

      <div className="grid gap-3 lg:grid-cols-[1fr_1fr]">
        <div className="dash-card">
          <div className="dash-card-header">
            <span className="dash-card-title">Video prompt</span>
            <span className="text-[11px] text-[var(--dash-muted)]">16:9 · Hero video</span>
          </div>
          <div className="dash-card-body space-y-3">
            <textarea
              value={data.mediaPrompt}
              onChange={(e) => data.setMediaPrompt(e.target.value)}
              rows={5}
              placeholder="Describe the cinematic video you want — scene, motion, mood…"
              className="dash-input resize-y leading-relaxed"
            />
            <div className="rounded-[8px] border border-[var(--dash-border)] bg-[var(--dash-surface2)] px-3 py-2 text-[11px] text-[var(--dash-muted)]">
              Duration and resolution are determined by the generation pipeline. Estimated cost:{" "}
              {cost} credits.
            </div>
            {data.mediaError ? (
              <p className="text-[11px] text-[var(--dash-red)]">{data.mediaError}</p>
            ) : null}
            <button
              type="button"
              onClick={() => {
                data.setMediaMode("video");
                void data.handleGenerateMedia("video");
              }}
              disabled={data.mediaGenerating || data.creditsRemaining < cost}
              className="dash-btn dash-btn-primary w-full py-2.5"
            >
              {data.mediaGenerating ? "Generating…" : `Generate video · ${cost} credits`}
            </button>
          </div>
        </div>

        <div className="dash-card overflow-hidden">
          <div className="dash-card-header">
            <span className="dash-card-title">Video queue</span>
          </div>
          {videos.length === 0 ? (
            <div className="px-4 py-10 text-center text-[12px] text-[var(--dash-muted)]">
              No videos generated yet
            </div>
          ) : (
            <div className="space-y-2 p-3">
              {videos.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-[8px] border border-[var(--dash-border)] bg-[var(--dash-surface2)] p-2.5"
                >
                  <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-[6px] border border-[var(--dash-border)] bg-[var(--dash-surface3)]">
                    <Play size={16} className="text-[var(--dash-muted)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-medium text-[var(--dash-text)]">
                      {item.prompt}
                    </p>
                    <p className="text-[11px] text-[var(--dash-muted)]">
                      {formatShortDate(item.created_at)} · {item.credits_used} cr
                    </p>
                  </div>
                  <span className={`dash-chip shrink-0 ${chipClassForStatus(item.status)}`}>
                    {item.status}
                  </span>
                  {item.asset_url ? (
                    <button
                      type="button"
                      onClick={() => window.open(item.asset_url!, "_blank")}
                      className="dash-btn px-2"
                    >
                      <Download size={12} />
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
