import type { ReactNode } from "react";

export function Panel({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={`overflow-hidden rounded-[var(--dash-radius-lg)] border border-[var(--dash-border)] bg-[var(--dash-surface)] mb-3.5 ${className}`}
    >
      {children}
    </div>
  );
}

export function PanelHead({
  title,
  action,
}: {
  title: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--dash-border)] px-4 py-2.5">
      <span className="text-xs font-medium text-[var(--dash-text)]">{title}</span>
      {action}
    </div>
  );
}

export function PanelLink({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[11px] text-[var(--dash-hint)] hover:text-[var(--dash-muted)] transition-colors cursor-pointer bg-transparent border-0 p-0"
    >
      {children}
    </button>
  );
}
