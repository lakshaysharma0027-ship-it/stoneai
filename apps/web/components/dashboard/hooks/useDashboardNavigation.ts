"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { DashboardView } from "../types";
import { hashToView } from "../utils";

const VALID_VIEWS: DashboardView[] = [
  "overview",
  "projects",
  "generate",
  "templates",
  "media",
  "domains",
  "analytics",
  "billing",
  "team",
  "settings",
];

const isDashboardView = (value: string | null): value is DashboardView =>
  value !== null && VALID_VIEWS.includes(value as DashboardView);

export function useDashboardNavigation(onTemplates?: () => void) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramView = searchParams.get("view");
  const [view, setViewState] = useState<DashboardView>(
    isDashboardView(paramView) ? paramView : "overview",
  );

  useEffect(() => {
    if (isDashboardView(paramView)) {
      setViewState(paramView);
      return;
    }

    if (typeof window !== "undefined" && window.location.hash) {
      const fromHash = hashToView(window.location.hash);
      if (fromHash && isDashboardView(fromHash)) {
        setViewState(fromHash);
        router.replace(`/dashboard?view=${fromHash}`, { scroll: false });
      }
    }
  }, [paramView, router]);

  const navigate = useCallback(
    (next: DashboardView) => {
      if (next === "templates") {
        onTemplates?.();
        router.push("/templates");
        return;
      }
      setViewState(next);
      router.replace(`/dashboard?view=${next}`, { scroll: false });
    },
    [router, onTemplates],
  );

  return { view, navigate };
}
