"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { projectStorage, type StoredProject } from "@/lib/projects";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { websiteGenerationService } from "@/services/ai/websiteGenerationService";
import type {
  AiHistoryRow,
  BillingPlanId,
  BillingSummary,
  CreditTransactionRow,
  CustomDomainRow,
  GenerateFormState,
  MediaGenerationRow,
  PublishedSiteRow,
} from "../types";

const defaultGenerateForm = (): GenerateFormState => ({
  businessName: "",
  prompt: "",
  description: "",
  industry: "Auto",
  style: "Premium",
  colorPreference: "Monochrome premium",
  websiteType: "Landing page",
});

export function useDashboardData() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [importing, setImporting] = useState(false);
  const [localProjectCount, setLocalProjectCount] = useState(0);
  const [userInitial, setUserInitial] = useState("A");
  const [userName, setUserName] = useState("Account");
  const [userEmail, setUserEmail] = useState("");
  const [projects, setProjects] = useState<StoredProject[]>([]);
  const [publishedSites, setPublishedSites] = useState<PublishedSiteRow[]>([]);
  const [billingSummary, setBillingSummary] = useState<BillingSummary | null>(null);
  const [billingAction, setBillingAction] = useState<string | null>(null);
  const [billingError, setBillingError] = useState<string | null>(null);
  const [connectedDomains, setConnectedDomains] = useState<CustomDomainRow[]>([]);
  const [mediaPrompt, setMediaPrompt] = useState("");
  const [mediaMode, setMediaMode] = useState<"image" | "video">("image");
  const [mediaGenerating, setMediaGenerating] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [mediaHistory, setMediaHistory] = useState<MediaGenerationRow[]>([]);
  const [aiHistory, setAiHistory] = useState<AiHistoryRow[]>([]);
  const [creditTransactions, setCreditTransactions] = useState<CreditTransactionRow[]>([]);
  const [domainHost, setDomainHost] = useState("");
  const [domainSiteId, setDomainSiteId] = useState("");
  const [domainVerificationType, setDomainVerificationType] = useState<"txt" | "cname">("txt");
  const [domainActionId, setDomainActionId] = useState<string | null>(null);
  const [domainSubmitting, setDomainSubmitting] = useState(false);
  const [domainError, setDomainError] = useState<string | null>(null);
  const [generateForm, setGenerateForm] = useState<GenerateFormState>(defaultGenerateForm);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [showGenerateDetails, setShowGenerateDetails] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

  const creditsRemaining = billingSummary?.subscription.creditsRemaining ?? 0;
  const monthlyCredits = billingSummary?.subscription.monthlyCredits ?? 100;
  const creditsUsed = Math.max(monthlyCredits - creditsRemaining, 0);
  const creditPercent = monthlyCredits > 0 ? Math.min((creditsUsed / monthlyCredits) * 100, 100) : 0;
  const totalViews = publishedSites.reduce(
    (sum, site) => sum + (site.site_analytics?.[0]?.page_views ?? 0),
    0,
  );
  const totalVisitors = publishedSites.reduce(
    (sum, site) => sum + (site.site_analytics?.[0]?.unique_visitors ?? 0),
    0,
  );
  const liveSiteCount = publishedSites.filter((site) => site.status === "published").length;
  const draftProjectCount = projects.filter(
    (project) => !publishedSites.some((s) => s.project_id === project.id && s.status === "published"),
  ).length;

  const refreshSites = useCallback(async () => {
    const response = await fetch("/api/sites");
    if (response.ok) {
      setPublishedSites(((await response.json()) as { sites?: PublishedSiteRow[] }).sites ?? []);
    }
  }, []);

  const refreshDomains = useCallback(async () => {
    const response = await fetch("/api/domains");
    if (response.ok) {
      setConnectedDomains(((await response.json()) as { domains?: CustomDomainRow[] }).domains ?? []);
    }
  }, []);

  const refreshBilling = useCallback(async () => {
    const response = await fetch("/api/billing/summary");
    if (response.ok) setBillingSummary((await response.json()) as BillingSummary);
  }, []);

  const refreshMediaHistory = useCallback(async () => {
    const response = await fetch("/api/media/history");
    if (response.ok) {
      setMediaHistory(((await response.json()) as { media?: MediaGenerationRow[] }).media ?? []);
    }
  }, []);

  const refreshAiHistory = useCallback(async () => {
    const response = await fetch("/api/ai/history");
    if (response.ok) {
      setAiHistory(((await response.json()) as { history?: AiHistoryRow[] }).history ?? []);
    }
  }, []);

  const refreshCreditTransactions = useCallback(async () => {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("credit_transactions")
      .select("id, amount, type, description, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error && data) setCreditTransactions(data as CreditTransactionRow[]);
  }, []);

  const refreshProjects = useCallback(async () => {
    setProjects(await projectStorage.listRemote());
  }, []);

  useEffect(() => {
    setMounted(true);
    setLocalProjectCount(projectStorage.local.list().length);

    const loadDashboard = async () => {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const displayName = (user.user_metadata.full_name as string | undefined) ?? user.email ?? "Account";
      setUserName(displayName);
      setUserEmail(user.email ?? "");
      setUserInitial(displayName.charAt(0).toUpperCase());
      setProjects(await projectStorage.listRemote());

      await Promise.all([
        refreshSites(),
        refreshBilling(),
        refreshMediaHistory(),
        refreshDomains(),
        refreshAiHistory(),
        refreshCreditTransactions(),
      ]);
    };

    void loadDashboard();
  }, [router, refreshSites, refreshBilling, refreshMediaHistory, refreshDomains, refreshAiHistory, refreshCreditTransactions]);

  const handleLogout = async () => {
    await createSupabaseBrowserClient().auth.signOut();
    router.replace("/login");
    router.refresh();
  };

  const handleImportLocalProjects = async () => {
    setImporting(true);
    await projectStorage.importLocalProjects();
    await refreshProjects();
    setLocalProjectCount(0);
    setImporting(false);
  };

  const handleCheckout = async (plan: BillingPlanId) => {
    setBillingAction(plan);
    setBillingError(null);
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const payload = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !payload.url) throw new Error(payload.error ?? "Could not start checkout.");
      window.location.href = payload.url;
    } catch (error) {
      setBillingError(error instanceof Error ? error.message : "Could not start checkout.");
      setBillingAction(null);
    }
  };

  const handleCancelBilling = async () => {
    setBillingAction("cancel");
    setBillingError(null);
    try {
      const response = await fetch("/api/billing/cancel", { method: "POST" });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Could not cancel subscription.");
      await refreshBilling();
    } catch (error) {
      setBillingError(error instanceof Error ? error.message : "Could not cancel subscription.");
    } finally {
      setBillingAction(null);
    }
  };

  const handleGenerateMedia = async (
    mode?: "image" | "video",
    options?: { aspectRatio?: string; durationSeconds?: number; prompt?: string },
  ) => {
    const prompt = (options?.prompt ?? mediaPrompt).trim();
    if (!prompt) {
      setMediaError("Enter a prompt first.");
      return;
    }

    const selectedMode = mode ?? mediaMode;
    setMediaGenerating(true);
    setMediaError(null);
    try {
      const response = await fetch(selectedMode === "image" ? "/api/media/images" : "/api/media/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          capability: selectedMode === "image" ? "hero_image" : "hero_video",
          aspectRatio: options?.aspectRatio ?? "16:9",
          durationSeconds: options?.durationSeconds,
        }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Could not generate media.");
      setMediaPrompt("");
      await Promise.all([refreshMediaHistory(), refreshBilling(), refreshCreditTransactions()]);
    } catch (error) {
      setMediaError(error instanceof Error ? error.message : "Could not generate media.");
    } finally {
      setMediaGenerating(false);
    }
  };

  const handleConnectDomain = async (event: React.FormEvent) => {
    event.preventDefault();
    const domain = domainHost.trim();
    if (!domain) {
      setDomainError("Enter a domain first.");
      return;
    }
    setDomainSubmitting(true);
    setDomainError(null);
    try {
      const response = await fetch("/api/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain,
          siteId: domainSiteId || publishedSites[0]?.id || null,
          verificationType: domainVerificationType,
        }),
      });
      const payload = (await response.json()) as { domain?: CustomDomainRow; error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Could not connect domain.");
      if (payload.domain) setConnectedDomains((current) => [payload.domain!, ...current]);
      setDomainHost("");
    } catch (error) {
      setDomainError(error instanceof Error ? error.message : "Could not connect domain.");
    } finally {
      setDomainSubmitting(false);
    }
  };

  const handleVerifyDomain = async (domainId: string) => {
    setDomainActionId(domainId);
    setDomainError(null);
    try {
      const response = await fetch(`/api/domains/${domainId}/verify`, { method: "POST" });
      const payload = (await response.json()) as { domain?: CustomDomainRow; error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Could not verify domain.");
      if (payload.domain) {
        setConnectedDomains((current) =>
          current.map((domain) => (domain.id === domainId ? payload.domain! : domain)),
        );
      }
    } catch (error) {
      setDomainError(error instanceof Error ? error.message : "Could not verify domain.");
    } finally {
      setDomainActionId(null);
    }
  };

  const handleRemoveDomain = async (domainId: string) => {
    setDomainActionId(domainId);
    setDomainError(null);
    try {
      const response = await fetch(`/api/domains/${domainId}`, { method: "DELETE" });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Could not remove domain.");
      setConnectedDomains((current) => current.filter((domain) => domain.id !== domainId));
    } catch (error) {
      setDomainError(error instanceof Error ? error.message : "Could not remove domain.");
    } finally {
      setDomainActionId(null);
    }
  };

  const handleUnpublishSite = async (siteId: string) => {
    await fetch(`/api/sites/${siteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "unpublished" }),
    });
    await refreshSites();
    await refreshDomains();
  };

  const handleDeleteSite = async (siteId: string) => {
    await fetch(`/api/sites/${siteId}`, { method: "DELETE" });
    await refreshSites();
  };

  const handleDeleteProject = async (projectId: string) => {
    setDeletingProjectId(projectId);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.from("projects").delete().eq("id", projectId);
      if (error) throw error;
      setProjects((current) => current.filter((project) => project.id !== projectId));
    } catch {
      // silent — user can retry
    } finally {
      setDeletingProjectId(null);
    }
  };

  const updateGenerateForm = <K extends keyof GenerateFormState>(key: K, value: GenerateFormState[K]) => {
    setGenerateForm((current) => ({ ...current, [key]: value }));
  };

  const handleGenerateProject = async (event?: React.FormEvent) => {
    event?.preventDefault();
    const businessName = generateForm.businessName.trim();
    const prompt = generateForm.prompt.trim();
    const description = generateForm.description.trim();

    if (!businessName || !description || !prompt) {
      setGenerateError("Enter a business name, description, and prompt first.");
      return;
    }
    if (creditsRemaining <= 0) {
      setGenerateError("You are out of credits. Upgrade your plan to generate more websites.");
      return;
    }

    setGenerating(true);
    setGenerateError(null);
    try {
      const { project } = await websiteGenerationService.generate({
        prompt,
        businessName,
        description,
        industry: generateForm.industry,
        style: generateForm.style,
        colorPreference: generateForm.colorPreference.trim() || undefined,
        websiteType: generateForm.websiteType.trim() || undefined,
      });
      setProjects((current) => [project, ...current.filter((item) => item.id !== project.id)]);
      router.push(`/editor/${project.id}`);
    } catch (error) {
      setGenerateError(error instanceof Error ? error.message : "Could not create project.");
      setGenerating(false);
    }
  };

  const creditUsageByType = useMemo(() => {
    const usage: Record<string, number> = {
      generate_website: 0,
      media_image_generate: 0,
      media_video_generate: 0,
      other: 0,
    };

    for (const txn of creditTransactions) {
      if (txn.amount >= 0) continue;
      const spent = Math.abs(txn.amount);
      if (txn.type === "generate_website") {
        usage.generate_website = (usage.generate_website ?? 0) + spent;
      } else if (txn.type === "media_image_generate" || txn.type === "media_image_edit") {
        usage.media_image_generate = (usage.media_image_generate ?? 0) + spent;
      } else if (txn.type === "media_video_generate") {
        usage.media_video_generate = (usage.media_video_generate ?? 0) + spent;
      } else {
        usage.other = (usage.other ?? 0) + spent;
      }
    }

    return usage;
  }, [creditTransactions]);

  return {
    mounted,
    userInitial,
    userName,
    userEmail,
    projects,
    publishedSites,
    billingSummary,
    connectedDomains,
    mediaHistory,
    aiHistory,
    creditTransactions,
    localProjectCount,
    importing,
    billingAction,
    billingError,
    mediaPrompt,
    setMediaPrompt,
    mediaMode,
    setMediaMode,
    mediaGenerating,
    mediaError,
    domainHost,
    setDomainHost,
    domainSiteId,
    setDomainSiteId,
    domainVerificationType,
    setDomainVerificationType,
    domainActionId,
    domainSubmitting,
    domainError,
    generateForm,
    updateGenerateForm,
    generating,
    generateError,
    showGenerateDetails,
    setShowGenerateDetails,
    deletingProjectId,
    creditsRemaining,
    monthlyCredits,
    creditsUsed,
    creditPercent,
    totalViews,
    totalVisitors,
    liveSiteCount,
    draftProjectCount,
    creditUsageByType,
    handleLogout,
    handleImportLocalProjects,
    handleCheckout,
    handleCancelBilling,
    handleGenerateMedia,
    handleConnectDomain,
    handleVerifyDomain,
    handleRemoveDomain,
    handleUnpublishSite,
    handleDeleteSite,
    handleDeleteProject,
    handleGenerateProject,
    router,
  };
}

export type DashboardDataContext = ReturnType<typeof useDashboardData>;
