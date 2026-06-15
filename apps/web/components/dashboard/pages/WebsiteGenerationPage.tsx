"use client";

import { PipelineWizard } from "../pipeline/PipelineWizard";
import type { DashboardDataContext } from "../hooks/useDashboardData";

/** Pipeline-first website creation (replaces legacy single-form generation). */
export function WebsiteGenerationPage({ data }: { data: DashboardDataContext }) {
  return <PipelineWizard data={data} />;
}
