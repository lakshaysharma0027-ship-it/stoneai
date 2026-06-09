import type { ReactNode } from "react";

type BadgeColor = "default" | "green" | "blue";

export function Kbd({ children }: { children: string }) {
  return (
    <kbd className="rounded-[4px] border border-[#161616] bg-[#050505] px-1.5 py-0.5 font-mono text-[10px] text-[#4B5563]">
      {children}
    </kbd>
  );
}

export function Divider({ className = "" }: { className?: string }) {
  return <div className={`h-px bg-[#0D0D0D] ${className}`} />;
}

export function Badge({
  children,
  color = "default",
}: {
  children: string;
  color?: BadgeColor;
}) {
  const colors: Record<BadgeColor, string> = {
    default: "text-[#666] bg-[#1a1a1a]",
    green: "text-emerald-400 bg-emerald-400/10",
    blue: "text-blue-400 bg-blue-400/10",
  };

  return (
    <span
      className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${colors[color]}`}
    >
      {children}
    </span>
  );
}

export function Switch({
  on,
  onChange,
}: {
  on: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={`relative h-4 w-8 rounded-full transition-colors duration-75 ${
        on ? "bg-white" : "bg-[#2a2a2a]"
      }`}
      type="button"
    >
      <span
        className={`absolute top-0.5 h-3 w-3 rounded-full transition-transform duration-75 ${
          on ? "translate-x-4 bg-[#060606]" : "translate-x-0.5 bg-[#555]"
        }`}
      />
    </button>
  );
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div
      className="relative h-[3px] cursor-pointer rounded-full bg-[#161616]"
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        onChange(
          Math.round(((event.clientX - rect.left) / rect.width) * (max - min) + min),
        );
      }}
    >
      <div
        className="absolute h-full rounded-full bg-white"
        style={{ width: `${percentage}%` }}
      />
      <div
        className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-white shadow"
        style={{ left: `calc(${percentage}% - 4px)` }}
      />
    </div>
  );
}

export function InspectorInput({
  label,
  value,
  unit,
  width = "full",
}: {
  label: string;
  value: string | number;
  unit?: string;
  width?: "full" | "half";
}) {
  return (
    <div
      className={`flex flex-col gap-1 ${
        width === "half" ? "w-[calc(50%-4px)]" : "w-full"
      }`}
    >
      <span className="text-[10px] font-medium uppercase tracking-wider text-[#3D3D3D]">
        {label}
      </span>
      <div className="flex h-8 items-center gap-1.5 rounded-[5px] border border-[#161616] bg-[#050505] px-2 transition-colors duration-75 hover:border-[#1E1E1E]">
        <span className="flex-1 font-mono text-[12px] text-white">{value}</span>
        {unit && <span className="text-[10px] text-[#444]">{unit}</span>}
      </div>
    </div>
  );
}

export function ColorSwatch({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <div className="group flex cursor-pointer items-center rounded-[5px] px-2 py-1.5 hover:bg-[#0D0D0D]">
      <div
        className="h-4 w-4 rounded-[4px] border border-[#161616]"
        style={{ background: color }}
      />
      <span className="ml-2 flex-1 text-[11px] text-[#9CA3AF] transition-colors duration-75 group-hover:text-white">
        {label}
      </span>
      <span className="font-mono text-[10px] text-[#444]">{color}</span>
    </div>
  );
}

export function LogoMark({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
      <polygon
        points="12,2 22,7 22,17 12,22 2,17 2,7"
        stroke="white"
        strokeWidth="1.2"
        fill="none"
      />
      <polygon
        points="12,7 17,9.5 17,14.5 12,17 7,14.5 7,9.5"
        fill="white"
        fillOpacity="0.15"
        stroke="white"
        strokeWidth="0.8"
      />
      <circle cx="12" cy="12" r="2" fill="white" />
    </svg>
  );
}

export function AssistantMark({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size}>
      <polygon
        points="10,1 19,5.5 19,14.5 10,19 1,14.5 1,5.5"
        stroke="white"
        strokeWidth="1"
        fill="none"
        strokeOpacity="0.6"
      />
      <circle cx="10" cy="10" r="2.5" fill="white" fillOpacity="0.9" />
    </svg>
  );
}

export function AssistantAvatar({ size = 12 }: { size?: number }) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size}>
      <polygon
        points="10,2 18,6 18,14 10,18 2,14 2,6"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
        strokeOpacity="0.7"
      />
      <circle cx="10" cy="10" r="2" fill="white" fillOpacity="0.8" />
    </svg>
  );
}

export function PanelSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <>
      <div className="px-3 py-2">
        <span className="text-[10px] uppercase tracking-widest text-[#444]">
          {title}
        </span>
      </div>
      {children}
    </>
  );
}
