import { Camera, Globe, Play } from "lucide-react";
import { chipClassForStatus } from "../utils";

export type ActivityItem = {
  id: string;
  type: "website" | "image" | "video";
  prompt: string;
  time: string;
  credits: number;
  status: string;
};

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return (
      <div className="px-4 py-10 text-center">
        <p className="text-[13px] text-[var(--dash-text-secondary)]">No activity yet</p>
        <p className="mt-1 text-xs text-[var(--dash-muted)]">
          Generate a website, image, or video to see history here.
        </p>
      </div>
    );
  }

  return (
    <div>
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-start gap-3 border-b border-[var(--dash-border)] px-3.5 py-3 last:border-b-0 transition-colors hover:bg-[var(--dash-surface2)]"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--dash-radius-sm)] border border-[var(--dash-border)] bg-[var(--dash-surface2)] text-[var(--dash-muted)]">
            {item.type === "website" ? (
              <Globe size={14} />
            ) : item.type === "image" ? (
              <Camera size={14} />
            ) : (
              <Play size={14} />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-[var(--dash-text)]">
              {item.prompt}
            </p>
            <p className="mt-0.5 text-[11px] text-[var(--dash-muted)]">
              {item.time} · {item.credits} credits
            </p>
          </div>
          <span className={`dash-chip shrink-0 ${chipClassForStatus(item.status)}`}>
            {item.status === "completed" ? "Done" : item.status}
          </span>
        </div>
      ))}
    </div>
  );
}
