import type { ReactNode } from "react";

export function StatGrid({ children }: { children: ReactNode }) {
  return (
    <div className="mb-5 grid grid-cols-2 gap-2 xl:grid-cols-4">{children}</div>
  );
}

export function StatCard({
  label,
  value,
  delta,
  deltaTone,
  barPercent,
  barTone,
}: {
  label: string;
  value: ReactNode;
  delta?: ReactNode;
  deltaTone?: "up" | "down" | "neutral";
  barPercent?: number;
  barTone?: "default" | "warn" | "danger";
}) {
  const deltaColor =
    deltaTone === "up"
      ? "text-[var(--dash-green)]"
      : deltaTone === "down"
        ? "text-[var(--dash-red)]"
        : "text-[var(--dash-muted)]";

  const barColor =
    barTone === "warn"
      ? "bg-[var(--dash-amber)]"
      : barTone === "danger"
        ? "bg-[var(--dash-red)]"
        : "bg-[var(--dash-white)]";

  return (
    <div className="rounded-[var(--dash-radius-lg)] border border-[var(--dash-border)] bg-[var(--dash-surface)] px-4 py-3.5">
      <p className="mb-2 text-[11px] text-[var(--dash-hint)] tracking-wide">{label}</p>
      <p className="text-2xl font-semibold text-[var(--dash-white)] tracking-[-1px]">{value}</p>
      {delta ? (
        <p className={`mt-1 flex items-center gap-1 text-[11px] ${deltaColor}`}>{delta}</p>
      ) : null}
      {barPercent !== undefined ? (
        <div className="mt-3 h-0.5 overflow-hidden rounded-sm bg-[var(--dash-border)]">
          <div
            className={`h-full rounded-sm transition-all duration-1000 ${barColor}`}
            style={{ width: `${barPercent}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}
