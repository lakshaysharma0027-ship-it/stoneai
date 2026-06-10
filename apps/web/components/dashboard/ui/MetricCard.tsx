import type { ReactNode } from "react";

export function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  return (
    <div className="dash-sparkline" aria-hidden>
      {values.map((value, index) => (
        <div
          key={index}
          className={`dash-sparkline-bar ${value > 0 ? "active" : ""}`}
          style={{ height: `${Math.max((value / max) * 100, 8)}%` }}
        />
      ))}
    </div>
  );
}

export function MetricCard({
  icon,
  label,
  value,
  trend,
  trendTone,
  sparkline,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  trend?: ReactNode;
  trendTone?: "up" | "neutral";
  sparkline?: number[];
}) {
  return (
    <div className="dash-metric">
      <div className="dash-metric-icon">{icon}</div>
      <div className="dash-metric-label">{label}</div>
      <div className="dash-metric-value">{value}</div>
      {trend ? (
        <div className={`dash-metric-trend ${trendTone === "up" ? "up" : ""}`}>{trend}</div>
      ) : null}
      {sparkline ? <Sparkline values={sparkline} /> : null}
    </div>
  );
}

export function MetricsGrid({ children }: { children: ReactNode }) {
  return <div className="dash-metrics-grid">{children}</div>;
}
