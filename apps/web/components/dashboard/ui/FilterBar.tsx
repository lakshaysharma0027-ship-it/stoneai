"use client";

import type { ReactNode } from "react";

export function FilterBar({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 border-b border-[var(--dash-border)] px-4 py-2.5">
      {children}
    </div>
  );
}

export function FilterTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
}) {
  return (
    <div className="ml-auto flex flex-wrap gap-1">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={`rounded-[5px] border px-2.5 py-1 text-[11px] transition-all cursor-pointer ${
            active === tab
              ? "border-[var(--dash-border)] bg-[var(--dash-surface2)] text-[var(--dash-text)]"
              : "border-transparent text-[var(--dash-hint)] hover:bg-[var(--dash-surface2)] hover:text-[var(--dash-muted)]"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export function DashInput({
  value,
  onChange,
  placeholder,
  className = "",
  type = "text",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`rounded-[var(--dash-radius)] border border-[var(--dash-border)] bg-[var(--dash-surface2)] px-2.5 py-1.5 text-xs text-[var(--dash-text)] outline-none placeholder:text-[var(--dash-hint)] focus:border-[var(--dash-border2)] ${className}`}
    />
  );
}

export function DashTextarea({
  value,
  onChange,
  placeholder,
  rows = 4,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`w-full resize-y rounded-[var(--dash-radius)] border border-[var(--dash-border)] bg-[var(--dash-surface2)] px-2.5 py-2 text-xs text-[var(--dash-text)] outline-none placeholder:text-[var(--dash-hint)] focus:border-[var(--dash-border2)] leading-relaxed ${className}`}
    />
  );
}

export function DashSelect({
  value,
  onChange,
  children,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`rounded-[var(--dash-radius)] border border-[var(--dash-border)] bg-[var(--dash-surface2)] px-2.5 py-1.5 text-xs text-[var(--dash-text)] outline-none cursor-pointer focus:border-[var(--dash-border2)] ${className}`}
    >
      {children}
    </select>
  );
}
