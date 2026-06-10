"use client";

import { Bolt } from "lucide-react";

export function GenerationPageHeader({
  title,
  cost,
  costLabel,
  remaining,
  extra,
}: {
  title: string;
  cost: number;
  costLabel: string;
  remaining: number;
  extra?: string;
}) {
  return (
    <>
      <div className="page-h1">{title}</div>
      <div className="page-sub">
        <span className="credit-pill">
          <Bolt size={11} />
          {cost} credits {costLabel}
        </span>
        <span className="sep">·</span>
        <span>
          {remaining.toLocaleString()} remaining{extra ? ` · ${extra}` : ""}
        </span>
      </div>
    </>
  );
}
