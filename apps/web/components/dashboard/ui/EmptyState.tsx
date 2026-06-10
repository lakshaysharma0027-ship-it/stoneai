import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
  compact,
}: {
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={`text-center ${compact ? "px-4 py-6" : "px-5 py-9"}`}>
      {icon ? (
        <div className="mb-2.5 flex justify-center text-[var(--dash-hint)]">{icon}</div>
      ) : null}
      {title ? <p className="text-[13px] text-[var(--dash-muted)]">{title}</p> : null}
      {description ? (
        <p className="mt-1 text-xs text-[var(--dash-hint)] leading-relaxed">{description}</p>
      ) : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}
