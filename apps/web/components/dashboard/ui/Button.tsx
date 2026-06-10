import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "default" | "primary" | "danger";

export function Button({
  variant = "default",
  size = "default",
  fullWidth,
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: "default" | "sm";
  fullWidth?: boolean;
  children: ReactNode;
}) {
  const base =
    "inline-flex items-center justify-center gap-1.5 rounded-[var(--dash-radius)] text-xs font-medium cursor-pointer border transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs";
  const variants: Record<Variant, string> = {
    default:
      "border-[var(--dash-border2)] bg-[var(--dash-surface2)] text-[var(--dash-muted)] hover:border-[var(--dash-border2)] hover:text-[var(--dash-text)] hover:bg-[var(--dash-surface3)]",
    primary:
      "bg-[var(--dash-white)] text-black border-[var(--dash-white)] hover:opacity-88",
    danger:
      "bg-[var(--dash-red-bg)] text-[var(--dash-red)] border-[var(--dash-red-bd)] hover:opacity-85",
  };

  return (
    <button
      type="button"
      className={`${base} ${sizes} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
