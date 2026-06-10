import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-base font-semibold text-[var(--dash-white)] tracking-[-0.4px]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-[var(--dash-muted)]">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
