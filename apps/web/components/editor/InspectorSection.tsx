"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Icon } from "./ui/Icon";

type InspectorSectionProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export default function InspectorSection({
  title,
  children,
  defaultOpen = true,
}: InspectorSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[#0D0D0D]">
      <button
        className="flex w-full items-center justify-between px-3 py-2.5 text-[10px] text-[#3D3D3D] transition-colors duration-75 hover:text-[#9CA3AF]"
        onClick={() => setOpen(!open)}
        type="button"
      >
        <span className="font-medium uppercase tracking-widest">{title}</span>
        <Icon name={open ? "chevronDown" : "chevron"} size={10} />
      </button>
      {open && <div className="px-3 pb-3">{children}</div>}
    </div>
  );
}
