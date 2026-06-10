"use client";

import { Suspense } from "react";
import { DashboardApp } from "@/components/dashboard/DashboardApp";

function DashboardFallback() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#0a0a0a] text-[#888]">
      <p className="text-sm">Loading dashboard…</p>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardApp />
    </Suspense>
  );
}
