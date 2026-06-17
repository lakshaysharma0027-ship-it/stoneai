"use client";

import { useEffect, useState } from "react";
import type { PipelineMediaSlot } from "@/lib/media/pipelineMediaCapabilities";

type RecentMediaItem = {
  id: string;
  asset_url: string;
  prompt: string;
  created_at: string;
  thumbnail_url?: string | null;
};

export function RecentMediaSelect({
  slot,
  label,
  onSelect,
  disabled,
}: {
  slot: PipelineMediaSlot;
  label: string;
  onSelect: (assetUrl: string) => void;
  disabled?: boolean;
}) {
  const [items, setItems] = useState<RecentMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/media/recent?slot=${slot}`);
        const payload = (await response.json()) as {
          error?: string;
          media?: RecentMediaItem[];
        };
        if (!response.ok) throw new Error(payload.error ?? "Could not load recent media.");
        if (!cancelled) setItems(payload.media ?? []);
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Could not load recent media.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [slot]);

  if (loading) {
    return <p className="pipeline-copy">Loading recent {slot === "video" ? "videos" : "images"}…</p>;
  }

  if (error) {
    return <p className="gen-error">{error}</p>;
  }

  if (items.length === 0) {
    return (
      <p className="pipeline-copy">
        No recent {slot === "video" ? "videos" : "images"} from the last 48 hours.
      </p>
    );
  }

  return (
    <div className="pipeline-recent-media">
      <label className="field-label" htmlFor={`recent-${slot}`}>
        {label}
      </label>
      <select
        id={`recent-${slot}`}
        className="settings-input"
        disabled={disabled}
        defaultValue=""
        onChange={(event) => {
          const value = event.target.value;
          if (value) onSelect(value);
        }}
      >
        <option value="">Reuse a recent {slot === "video" ? "video" : "image"} (48h)</option>
        {items.map((item) => (
          <option key={item.id} value={item.asset_url}>
            {new Date(item.created_at).toLocaleString()} — {item.prompt.slice(0, 60)}
          </option>
        ))}
      </select>
    </div>
  );
}

async function recordUploadedMedia(
  mediaType: "image" | "video",
  capability: string,
  assetUrl: string,
  prompt: string,
) {
  await fetch("/api/media/recent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mediaType, capability, assetUrl, prompt }),
  });
}

export { recordUploadedMedia };