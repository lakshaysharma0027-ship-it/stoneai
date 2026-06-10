"use client";

import { Download, Image } from "lucide-react";
import { CREDIT_COSTS } from "@/lib/billing/credits";
import type { DashboardDataContext } from "../hooks/useDashboardData";
import { chipClassForStatus, formatShortDate } from "../utils";

export function ImageGenerationPage({ data }: { data: DashboardDataContext }) {
  const cost = CREDIT_COSTS.media_image_generate;
  const images = data.mediaHistory.filter((m) => m.media_type === "image");

  return (
    <div className="dashboard-content-inner">
      <header className="mb-4">
        <h1 className="text-[18px] font-semibold tracking-[-0.03em] text-white">
          Image Generation
        </h1>
        <p className="mt-0.5 text-[12px] text-[var(--dash-muted)]">
          {data.creditsRemaining.toLocaleString()} credits · {cost} per image
        </p>
      </header>

      <div className="grid gap-3 lg:grid-cols-[1fr_1fr]">
        <div className="dash-card">
          <div className="dash-card-header">
            <span className="dash-card-title">Prompt</span>
            <span className="text-[11px] text-[var(--dash-muted)]">16:9 · Hero image</span>
          </div>
          <div className="dash-card-body space-y-3">
            <textarea
              value={data.mediaPrompt}
              onChange={(e) => data.setMediaPrompt(e.target.value)}
              rows={5}
              placeholder="Describe the image you want to generate…"
              className="dash-input resize-y leading-relaxed"
            />
            {data.mediaError ? (
              <p className="text-[11px] text-[var(--dash-red)]">{data.mediaError}</p>
            ) : null}
            <button
              type="button"
              onClick={() => {
                data.setMediaMode("image");
                void data.handleGenerateMedia("image");
              }}
              disabled={data.mediaGenerating || data.creditsRemaining < cost}
              className="dash-btn dash-btn-primary w-full py-2.5"
            >
              {data.mediaGenerating ? "Generating…" : `Generate image · ${cost} credits`}
            </button>
          </div>
        </div>

        <div className="dash-card overflow-hidden">
          <div className="dash-card-header">
            <span className="dash-card-title">Recent images</span>
            <span className="text-[11px] text-[var(--dash-muted)]">{images.length} total</span>
          </div>
          {images.length === 0 ? (
            <div className="px-4 py-10 text-center text-[12px] text-[var(--dash-muted)]">
              No images generated yet
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 p-3">
              {images.slice(0, 8).map((item) => (
                <div
                  key={item.id}
                  className="group relative aspect-[4/3] overflow-hidden rounded-[8px] border border-[var(--dash-border)] bg-[var(--dash-surface2)]"
                >
                  {item.asset_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.asset_url} alt={item.prompt} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[var(--dash-muted)]">
                      <Image size={20} />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <p className="truncate text-[10px] text-white/90">{item.prompt}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className={`dash-chip text-[9px] ${chipClassForStatus(item.status)}`}>
                        {item.status}
                      </span>
                      {item.asset_url ? (
                        <button
                          type="button"
                          onClick={() => window.open(item.asset_url!, "_blank")}
                          className="text-white/80 hover:text-white"
                        >
                          <Download size={12} />
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="dash-card mt-3 overflow-hidden">
        <div className="dash-card-header">
          <span className="dash-card-title">History</span>
        </div>
        {images.length === 0 ? null : (
          <table className="dash-table">
            <thead>
              <tr>
                <th>Prompt</th>
                <th>Date</th>
                <th>Credits</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {images.map((item) => (
                <tr key={item.id}>
                  <td className="max-w-[280px] truncate text-[var(--dash-text)]">{item.prompt}</td>
                  <td>{formatShortDate(item.created_at)}</td>
                  <td className="tabular-nums">{item.credits_used}</td>
                  <td>
                    <span className={`dash-chip ${chipClassForStatus(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
