"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TemplateGallery } from "@/components/templates/TemplateGallery";
import { templates } from "@/app/templates/lib/templates";
import type { Template } from "@/app/templates/lib/templates";
import type { DashboardDataContext } from "../hooks/useDashboardData";

export function DashboardTemplatesPage({ data: _data }: { data: DashboardDataContext }) {
  const router = useRouter();
  const [creatingTemplateId, setCreatingTemplateId] = useState<string | null>(null);

  const createProjectFromTemplate = (template: Template) => {
    setCreatingTemplateId(template.id);
    window.setTimeout(() => {
      setCreatingTemplateId(null);
      router.push(`/dashboard?view=generate-website&templateId=${template.id}`);
    }, 300);
  };

  return (
    <div className="spec-page">
      <div className="page-header">
        <div>
          <div className="page-h1">Template Library</div>
          <div className="page-sub">
            Full access to every StoneAI template — search, filter, and launch your next site.
          </div>
        </div>
      </div>

      <div className="panel" style={{ padding: 24 }}>
        <TemplateGallery
          templates={templates}
          mode="dashboard"
          onUseTemplate={createProjectFromTemplate}
          creatingTemplateId={creatingTemplateId}
        />
      </div>
    </div>
  );
}
