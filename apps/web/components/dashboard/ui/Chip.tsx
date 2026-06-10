import type { ReactNode } from "react";

type ChipVariant = "live" | "draft" | "build" | "error" | "owner" | "member" | "pending";

const styles: Record<ChipVariant, string> = {
  live: "bg-[var(--dash-green-bg)] text-[var(--dash-green)] border-[var(--dash-green-bd)]",
  draft: "bg-[var(--dash-surface2)] text-[var(--dash-hint)] border-[var(--dash-border)]",
  build: "bg-[var(--dash-amber-bg)] text-[var(--dash-amber)] border-[var(--dash-amber-bd)]",
  error: "bg-[var(--dash-red-bg)] text-[var(--dash-red)] border-[var(--dash-red-bd)]",
  owner: "bg-[var(--dash-surface3)] text-[var(--dash-text)] border-[var(--dash-border2)]",
  member: "bg-[var(--dash-surface2)] text-[var(--dash-hint)] border-[var(--dash-border)]",
  pending: "bg-[var(--dash-amber-bg)] text-[var(--dash-amber)] border-[var(--dash-amber-bd)]",
};

export function Chip({ variant, children }: { variant: ChipVariant; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium capitalize border ${styles[variant]}`}
    >
      {children}
    </span>
  );
}

export function statusToChip(status: string): ChipVariant {
  const normalized = status.toLowerCase();
  if (normalized === "published" || normalized === "live" || normalized === "completed" || normalized === "active" || normalized === "verified") {
    return "live";
  }
  if (normalized === "building" || normalized === "processing" || normalized === "pending") {
    return "build";
  }
  if (normalized === "failed" || normalized === "error" || normalized === "canceled") {
    return "error";
  }
  return "draft";
}
