"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { DashboardView } from "../types";
import { normalizeView } from "../types";
import { hashToView } from "../utils";

const VALID_VIEWS: DashboardView[] = [
  "overview",
  "projects",
  "generate-website",
  "website-ready",
  "domains",
  "analytics",
  "billing",
  "settings",
  "generate",
  "media",
  "team",
];

const isDashboardView = (value: string | null): value is DashboardView =>
  value !== null && VALID_VIEWS.includes(value as DashboardView);

export function useDashboardNavigation(onTemplates?: () => void) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramView = searchParams.get("view");
  const [view, setViewState] = useState<DashboardView>(() =>
    isDashboardView(paramView) ? normalizeView(paramView) : "overview",
  );

  useEffect(() => {
    if (isDashboardView(paramView)) {
      setViewState(normalizeView(paramView));
      return;
    }

    if (typeof window !== "undefined" && window.location.hash) {
      const fromHash = hashToView(window.location.hash);
      if (fromHash && isDashboardView(fromHash)) {
        const normalized = normalizeView(fromHash);
        setViewState(normalized);
        router.replace(`/dashboard?view=${normalized}`, { scroll: false });
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
      const normalized = normalizeView(next);
      setViewState(normalized);
      router.replace(`/dashboard?view=${normalized}`, { scroll: false });
    },
    [router, onTemplates],
  );

  return { view, navigate };
}
