"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { projectStorage, type StoredProject } from "@/lib/projects";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { getTemplateById } from "@/lib/templates";
import type { WebsiteIndustry, WebsiteStyle } from "@/lib/ai";
import { websiteGenerationService } from "@/services/ai/websiteGenerationService";

type PublishedSiteRow = {
  id: string;
  project_id: string;
  slug: string;
  status: "draft" | "published" | "unpublished";
  seo_title: string | null;
  updated_at: string;
  public_url: string;
  site_analytics?: Array<{
    page_views: number;
    unique_visitors: number;
    last_visit: string | null;
    publish_date: string | null;
  }>;
};

type BillingSummary = {
  subscription: {
    plan: "free_trial" | "basic" | "basic_plus" | "pro" | "premium";
    creditsRemaining: number;
    monthlyCredits: number;
    status: "active" | "trialing" | "past_due" | "canceled";
    subscriptionId: string | null;
    renewalDate: string | null;
    billingCycle: "monthly" | "yearly";
    cancelAtPeriodEnd: boolean;
  };
  plan: {
    id: "free_trial" | "basic" | "basic_plus" | "pro" | "premium";
    name: string;
    monthlyCredits: number;
    siteLimit: number;
  };
};

type MediaGenerationRow = {
  id: string;
  media_type: "image" | "video";
  capability: string;
  prompt: string;
  status: "pending" | "processing" | "completed" | "failed";
  credits_used: number;
  asset_url: string | null;
  error_message: string | null;
  created_at: string;
};

type CustomDomainRow = {
  id: string;
  siteId: string | null;
  domain: string;
  status: "pending" | "verified" | "active" | "failed";
  verificationToken: string;
  verificationType: "txt" | "cname";
  verificationHost: string;
  verificationValue: string;
  verifiedAt: string | null;
  lastCheckedAt: string | null;
  failureReason: string | null;
  createdAt: string;
};

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start: number | null = null;

    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setValue(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [target, duration]);

  return value;
}

const formatUpdatedAt = (timestamp: number) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));

export default function StoneAIDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeNav, setActiveNav] = useState("Projects");
  const [hovered, setHovered] = useState<string | null>(null);
  const [newProjectHover, setNewProjectHover] = useState(false);
  const [generateHover, setGenerateHover] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [generateBusinessName, setGenerateBusinessName] = useState("");
  const [generatePrompt, setGeneratePrompt] = useState("");
  const [generateDescription, setGenerateDescription] = useState("");
  const [generateIndustry, setGenerateIndustry] = useState<WebsiteIndustry | "Auto">("Auto");
  const [generateStyle, setGenerateStyle] = useState<WebsiteStyle>("Premium");
  const [generateColorPreference, setGenerateColorPreference] = useState("Monochrome premium");
  const [generateWebsiteType, setGenerateWebsiteType] = useState("Landing page");
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [localProjectCount, setLocalProjectCount] = useState(0);
  const [userInitial, setUserInitial] = useState("A");
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
  const [domainHost, setDomainHost] = useState("");
  const [domainSiteId, setDomainSiteId] = useState("");
  const [domainVerificationType, setDomainVerificationType] = useState<"txt" | "cname">("txt");
  const [domainActionId, setDomainActionId] = useState<string | null>(null);
  const [domainSubmitting, setDomainSubmitting] = useState(false);
  const [domainError, setDomainError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const projectCount = useCountUp(mounted ? projects.length : 0);
  const creditCount = useCountUp(mounted ? billingSummary?.subscription.creditsRemaining ?? 0 : 0);
  const deployCount = useCountUp(mounted ? publishedSites.length : 0);
  const domainCount = useCountUp(mounted ? connectedDomains.length : 0);
  const creditsRemaining = billingSummary?.subscription.creditsRemaining ?? 0;
  const recentProjects = useMemo(() => projects.slice(0, 6), [projects]);

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

      setUserInitial((user.user_metadata.full_name ?? user.email ?? "A").charAt(0).toUpperCase());
      const remoteProjects = await projectStorage.listRemote();
      setProjects(remoteProjects);
      const sitesResponse = await fetch("/api/sites");
      if (sitesResponse.ok) {
        const sitesPayload = (await sitesResponse.json()) as { sites?: PublishedSiteRow[] };
        setPublishedSites(sitesPayload.sites ?? []);
      }
      const billingResponse = await fetch("/api/billing/summary");
      if (billingResponse.ok) {
        const billingPayload = (await billingResponse.json()) as BillingSummary;
        setBillingSummary(billingPayload);
      }
      const mediaResponse = await fetch("/api/media/history");
      if (mediaResponse.ok) {
        const mediaPayload = (await mediaResponse.json()) as { media?: MediaGenerationRow[] };
        setMediaHistory(mediaPayload.media ?? []);
      }
      const domainsResponse = await fetch("/api/domains");
      if (domainsResponse.ok) {
        const domainsPayload = (await domainsResponse.json()) as { domains?: CustomDomainRow[] };
        setConnectedDomains(domainsPayload.domains ?? []);
      }
    };

    void loadDashboard();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  };

  const handleImportLocalProjects = async () => {
    setImporting(true);
    await projectStorage.importLocalProjects();
    setProjects(await projectStorage.listRemote());
    setLocalProjectCount(0);
    setImporting(false);
  };

  const refreshSites = async () => {
    const response = await fetch("/api/sites");
    if (!response.ok) return;
    const payload = (await response.json()) as { sites?: PublishedSiteRow[] };
    setPublishedSites(payload.sites ?? []);
  };

  const refreshDomains = async () => {
    const response = await fetch("/api/domains");
    if (!response.ok) return;
    const payload = (await response.json()) as { domains?: CustomDomainRow[] };
    setConnectedDomains(payload.domains ?? []);
  };

  const refreshBilling = async () => {
    const response = await fetch("/api/billing/summary");
    if (!response.ok) return;
    const payload = (await response.json()) as BillingSummary;
    setBillingSummary(payload);
  };

  const refreshMediaHistory = async () => {
    const response = await fetch("/api/media/history");
    if (!response.ok) return;
    const payload = (await response.json()) as { media?: MediaGenerationRow[] };
    setMediaHistory(payload.media ?? []);
  };

  const handleCheckout = async (plan: BillingSummary["plan"]["id"]) => {
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
    } finally {
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

  const handleGenerateMedia = async () => {
    const prompt = mediaPrompt.trim();
    if (!prompt) {
      setMediaError("Enter a prompt first.");
      return;
    }

    setMediaGenerating(true);
    setMediaError(null);
    try {
      const response = await fetch(mediaMode === "image" ? "/api/media/images" : "/api/media/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          capability: mediaMode === "image" ? "hero_image" : "hero_video",
          aspectRatio: "16:9",
        }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Could not generate media.");
      setMediaPrompt("");
      await Promise.all([refreshMediaHistory(), refreshBilling()]);
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

  const handleGenerateProject = async (event: React.FormEvent) => {
    event.preventDefault();
    const businessName = generateBusinessName.trim();
    const prompt = generatePrompt.trim();
    const description = generateDescription.trim();
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
        industry: generateIndustry,
        style: generateStyle,
        colorPreference: generateColorPreference.trim() || undefined,
        websiteType: generateWebsiteType.trim() || undefined,
      });
      setProjects((current) => [project, ...current.filter((item) => item.id !== project.id)]);
      router.push(`/editor/${project.id}`);
    } catch (error) {
      console.error("[StoneAI AI generator] project creation failed", error);
      setGenerateError(
        error instanceof Error ? error.message : "Could not create project.",
      );
      setGenerating(false);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 256;
    canvas.height = 256;
    const imageData = ctx.createImageData(256, 256);

    for (let i = 0; i < imageData.data.length; i += 4) {
      const v = Math.random() * 255;
      imageData.data[i] = v;
      imageData.data[i + 1] = v;
      imageData.data[i + 2] = v;
      imageData.data[i + 3] = 18;
    }

    ctx.putImageData(imageData, 0, 0);
  }, []);

  const navItems = ["Projects", "Published Sites", "Media", "Billing", "Credits", "Deployments", "Settings"];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0A0A0A",
        color: "#FAFAFA",
        fontFamily:
          "'DM Sans', 'Helvetica Neue', system-ui, -apple-system, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 50,
          opacity: 0.4,
          mixBlendMode: "overlay",
        }}
      />

      <div
        style={{
          position: "fixed",
          top: "-20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "900px",
          height: "500px",
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.03) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          borderBottom: "1px solid #1A1A1A",
          backgroundColor: "rgba(10,10,10,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 32px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                background: "#FAFAFA",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="0" y="0" width="6" height="6" rx="1.5" fill="#0A0A0A" />
                <rect x="8" y="0" width="6" height="6" rx="1.5" fill="#0A0A0A" />
                <rect x="0" y="8" width="6" height="6" rx="1.5" fill="#0A0A0A" />
                <rect
                  x="8"
                  y="8"
                  width="6"
                  height="6"
                  rx="1.5"
                  fill="#0A0A0A"
                  opacity="0.4"
                />
              </svg>
            </div>
            <span
              style={{
                fontSize: "15px",
                fontWeight: "600",
                letterSpacing: "-0.02em",
                color: "#FAFAFA",
              }}
            >
              StoneAI
            </span>
          </div>

          <nav style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => setActiveNav(item)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  fontSize: "13.5px",
                  fontWeight: "500",
                  color: activeNav === item ? "#FAFAFA" : "#52525B",
                  backgroundColor:
                    activeNav === item ? "#18181B" : "transparent",
                  transition: "all 200ms ease-out",
                  letterSpacing: "-0.01em",
                }}
              >
                {item}
              </button>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                background: "transparent",
                border: "1px solid #27272A",
                borderRadius: 8,
                color: "#A1A1AA",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                padding: "7px 12px",
              }}
            >
              Logout
            </button>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "#18181B",
                border: "1px solid #27272A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "600",
                color: "#A1A1AA",
                cursor: "pointer",
              }}
            >
              {userInitial}
            </div>
          </div>
        </div>
      </header>

      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "100px 32px 64px",
          position: "relative",
          zIndex: 1,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 600ms ease-out, transform 600ms ease-out",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "48px",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "12px",
                fontWeight: "500",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#3F3F46",
                marginBottom: "10px",
              }}
            >
              Dashboard
            </p>
            <h1
              style={{
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: "700",
                letterSpacing: "-0.04em",
                lineHeight: "1.1",
                color: "#FAFAFA",
                margin: 0,
              }}
            >
              Build cinematic
              <br />
              <span style={{ color: "#3F3F46" }}>websites with AI.</span>
            </h1>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setGenerateOpen(true)}
              onMouseEnter={() => setGenerateHover(true)}
              onMouseLeave={() => setGenerateHover(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 22px",
                borderRadius: "12px",
                border: "1px solid",
                borderColor: generateHover ? "#FAFAFA" : "#3F3F46",
                background: generateHover ? "#FAFAFA" : "#111111",
                color: generateHover ? "#0A0A0A" : "#FAFAFA",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 200ms ease-out",
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
              }}
              type="button"
            >
              Generate With AI
            </button>
            <button
              onClick={() => router.push("/templates")}
              onMouseEnter={() => setNewProjectHover(true)}
              onMouseLeave={() => setNewProjectHover(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 22px",
                borderRadius: "12px",
                border: "1px solid",
                borderColor: newProjectHover ? "#3F3F46" : "#27272A",
                background: newProjectHover ? "#111111" : "transparent",
                color: "#FAFAFA",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 200ms ease-out",
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
              }}
              type="button"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                style={{
                  transform: newProjectHover ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 300ms ease-out",
                }}
              >
                <path
                  d="M7.5 1v13M1 7.5h13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              New Project
            </button>
          </div>
        </div>

        {localProjectCount > 0 ? (
          <div
            style={{
              alignItems: "center",
              background: "#111111",
              border: "1px solid #27272A",
              borderRadius: "16px",
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "28px",
              padding: "16px 18px",
            }}
          >
            <div>
              <p style={{ color: "#FAFAFA", fontSize: 14, fontWeight: 600, margin: 0 }}>
                Import Local Projects
              </p>
              <p style={{ color: "#52525B", fontSize: 12, margin: "4px 0 0" }}>
                Move {localProjectCount} local project{localProjectCount === 1 ? "" : "s"} into your account.
              </p>
            </div>
            <button
              type="button"
              onClick={handleImportLocalProjects}
              disabled={importing}
              style={{
                background: "#FAFAFA",
                border: 0,
                borderRadius: 8,
                color: "#0A0A0A",
                cursor: importing ? "wait" : "pointer",
                fontSize: 12,
                fontWeight: 700,
                padding: "10px 14px",
              }}
            >
              {importing ? "Importing..." : "Import"}
            </button>
          </div>
        ) : null}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
            marginBottom: "48px",
          }}
        >
          {[
            { label: "Projects", value: projectCount },
            { label: "Credits Remaining", value: creditCount },
            { label: "Published Sites", value: deployCount },
            { label: "Connected Domains", value: domainCount },
          ].map((stat, i) => (
            <div
              key={stat.label}
              style={{
                padding: "20px 24px",
                background: "#111111",
                border: "1px solid #18181B",
                borderRadius: "16px",
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(8px)",
                transition: `opacity 600ms ease-out ${i * 80}ms, transform 600ms ease-out ${i * 80}ms`,
              }}
            >
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "#3F3F46",
                  margin: "0 0 8px",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {stat.label}
              </p>
              <p
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  color: "#FAFAFA",
                  margin: 0,
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                }}
              >
                {stat.value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            alignItems: "center",
            background: "#111111",
            border: "1px solid #18181B",
            borderRadius: "16px",
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "48px",
            padding: "18px 22px",
          }}
        >
          <div>
            <p style={{ color: "#3F3F46", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", margin: "0 0 8px", textTransform: "uppercase" }}>
              Current Plan
            </p>
            <p style={{ color: "#FAFAFA", fontSize: 18, fontWeight: 700, margin: 0 }}>
              {billingSummary?.plan.name ?? "Free"}
            </p>
          </div>
          <p style={{ color: "#71717A", fontSize: 13, margin: 0 }}>
            {billingSummary?.subscription.creditsRemaining ?? 0} / {billingSummary?.subscription.monthlyCredits ?? 100} credits
          </p>
        </div>

        {activeNav === "Billing" ? (
          <section style={{ marginBottom: 48 }}>
            <div style={{ marginBottom: 18, textAlign: "center" }}>
              <p style={{ color: "#52525B", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", margin: "0 0 10px", textTransform: "uppercase" }}>
                StoneAI Plans
              </p>
              <h2 style={{ color: "#FAFAFA", fontSize: 34, letterSpacing: "-0.05em", lineHeight: 1.05, margin: 0 }}>
                Scale credits, sites, and AI media.
              </h2>
            </div>
            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
              {[
                { id: "free_trial", name: "Free Trial", credits: 100, sites: 1 },
                { id: "basic", name: "Basic", credits: 1500, sites: 2 },
                { id: "basic_plus", name: "Basic Plus", credits: 2500, sites: 4 },
                { id: "pro", name: "Pro", credits: 6000, sites: 7 },
                { id: "premium", name: "Premium", credits: 25000, sites: 30 },
              ].map((plan) => {
                const current = billingSummary?.plan.id === plan.id;
                return (
                  <div
                    key={plan.id}
                    style={{
                      background: current ? "#18181B" : "#111111",
                      border: `1px solid ${current ? "#FAFAFA" : "#27272A"}`,
                      borderRadius: 16,
                      padding: 18,
                    }}
                  >
                    <p style={{ color: current ? "#FAFAFA" : "#71717A", fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", margin: "0 0 8px", textTransform: "uppercase" }}>
                      {plan.name}
                    </p>
                    <p style={{ color: "#FAFAFA", fontSize: 30, fontWeight: 800, letterSpacing: "-0.05em", margin: "0 0 4px" }}>
                      {plan.credits.toLocaleString()}
                    </p>
                    <p style={{ color: "#52525B", fontSize: 12, margin: "0 0 14px" }}>
                      credits/month - {plan.sites} published site{plan.sites === 1 ? "" : "s"}
                    </p>
                    <button
                      type="button"
                      disabled={current || plan.id === "free_trial" || billingAction === plan.id}
                      onClick={() => void handleCheckout(plan.id as BillingSummary["plan"]["id"])}
                      style={{
                        background: current ? "#27272A" : "#FAFAFA",
                        border: 0,
                        borderRadius: 10,
                        color: current ? "#A1A1AA" : "#09090B",
                        cursor: current || plan.id === "free_trial" || billingAction === plan.id ? "not-allowed" : "pointer",
                        fontSize: 12,
                        fontWeight: 800,
                        padding: "10px 12px",
                        width: "100%",
                      }}
                    >
                      {current ? "Current Plan" : billingAction === plan.id ? "Starting..." : "Upgrade"}
                    </button>
                  </div>
                );
              })}
            </div>
            {billingError ? <p style={{ color: "#FCA5A5", fontSize: 12, margin: "14px 0 0" }}>{billingError}</p> : null}
            {billingSummary?.subscription.subscriptionId ? (
              <button
                type="button"
                onClick={() => void handleCancelBilling()}
                disabled={billingAction === "cancel"}
                style={{
                  background: "transparent",
                  border: "1px solid #3F1D1D",
                  borderRadius: 10,
                  color: "#FCA5A5",
                  cursor: billingAction === "cancel" ? "wait" : "pointer",
                  fontSize: 12,
                  fontWeight: 700,
                  marginTop: 14,
                  padding: "10px 12px",
                }}
              >
                {billingAction === "cancel" ? "Cancelling..." : "Cancel Subscription"}
              </button>
            ) : null}
          </section>
        ) : null}

        {activeNav === "Media" ? (
          <section style={{ marginBottom: 48 }}>
            <div style={{ background: "#111111", border: "1px solid #18181B", borderRadius: 16, padding: 18 }}>
              <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
                <div>
                  <p style={{ color: "#52525B", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", margin: "0 0 8px", textTransform: "uppercase" }}>
                    Media Studio
                  </p>
                  <h2 style={{ color: "#FAFAFA", fontSize: 24, letterSpacing: "-0.04em", margin: 0 }}>
                    Generate image and video assets.
                  </h2>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {(["image", "video"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setMediaMode(mode)}
                      style={{
                        background: mediaMode === mode ? "#FAFAFA" : "#080808",
                        border: "1px solid #27272A",
                        borderRadius: 8,
                        color: mediaMode === mode ? "#09090B" : "#A1A1AA",
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 800,
                        padding: "8px 10px",
                        textTransform: "capitalize",
                      }}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={mediaPrompt}
                onChange={(event) => setMediaPrompt(event.target.value)}
                placeholder="A cinematic dark minimalist SaaS hero image with glass panels and soft monochrome lighting..."
                rows={3}
                style={{
                  background: "#050505",
                  border: "1px solid #27272A",
                  borderRadius: 10,
                  color: "#FAFAFA",
                  fontSize: 14,
                  outline: "none",
                  padding: 12,
                  resize: "vertical",
                  width: "100%",
                }}
              />
              <button
                type="button"
                onClick={() => void handleGenerateMedia()}
                disabled={mediaGenerating}
                style={{
                  background: "#FAFAFA",
                  border: 0,
                  borderRadius: 10,
                  color: "#09090B",
                  cursor: mediaGenerating ? "wait" : "pointer",
                  fontSize: 13,
                  fontWeight: 800,
                  marginTop: 12,
                  padding: "11px 14px",
                }}
              >
                {mediaGenerating ? "Generating..." : `Generate ${mediaMode}`}
              </button>
              {mediaError ? <p style={{ color: "#FCA5A5", fontSize: 12, margin: "12px 0 0" }}>{mediaError}</p> : null}
            </div>
            <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
              {mediaHistory.length === 0 ? (
                <div style={{ border: "1px dashed #1E1E21", borderRadius: 16, color: "#3F3F46", fontSize: 13, padding: 22, textAlign: "center" }}>
                  No media generations yet.
                </div>
              ) : (
                mediaHistory.map((item) => (
                  <div key={item.id} style={{ alignItems: "center", background: "#111111", border: "1px solid #18181B", borderRadius: 16, display: "flex", gap: 12, padding: 14 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: "#FAFAFA", fontSize: 14, fontWeight: 700, margin: 0 }}>
                        {item.media_type} - {item.capability}
                      </p>
                      <p style={{ color: "#52525B", fontSize: 12, margin: "3px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.prompt}
                      </p>
                    </div>
                    <span style={{ color: "#A1A1AA", fontSize: 12, fontWeight: 700 }}>{item.credits_used} credits</span>
                    <span style={{ color: item.status === "failed" ? "#FCA5A5" : "#A1A1AA", fontSize: 12, fontWeight: 700, textTransform: "capitalize" }}>
                      {item.status}
                    </span>
                    {item.asset_url ? (
                      <button
                        type="button"
                        onClick={() => window.open(item.asset_url!, "_blank", "noopener,noreferrer")}
                        style={{ background: "transparent", border: "1px solid #27272A", borderRadius: 8, color: "#A1A1AA", cursor: "pointer", fontSize: 12, fontWeight: 700, padding: "8px 10px" }}
                      >
                        Download
                      </button>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </section>
        ) : null}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              fontWeight: "500",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#3F3F46",
              margin: 0,
            }}
          >
            Recent Projects
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
          {recentProjects.map((project, i) => {
            const template = getTemplateById(project.templateId);
            const isHovered = hovered === project.id;
            const initial = project.name.charAt(0).toUpperCase();

            return (
              <button
                key={project.id}
                onClick={() => router.push(`/editor/${project.id}`)}
                onMouseEnter={() => setHovered(project.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "16px 20px",
                  background: isHovered ? "#111111" : "transparent",
                  border: "1px solid",
                  borderColor: isHovered ? "#27272A" : "#111111",
                  borderRadius: "16px",
                  cursor: "pointer",
                  transition: "all 200ms ease-out",
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateX(0)" : "translateX(-8px)",
                  transitionDelay: `${i * 60 + 200}ms`,
                  textAlign: "left",
                  width: "100%",
                }}
                type="button"
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "#18181B",
                    border: "1px solid #27272A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: "700",
                    color: "#FAFAFA",
                    flexShrink: 0,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {initial}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "14.5px",
                      fontWeight: "600",
                      color: "#FAFAFA",
                      letterSpacing: "-0.02em",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {project.name}
                  </p>
                  <p
                    style={{
                      margin: "2px 0 0",
                      fontSize: "12.5px",
                      color: "#3F3F46",
                      fontWeight: "400",
                    }}
                  >
                    Template {template?.name ?? "Unknown"} - Updated{" "}
                    {formatUpdatedAt(project.updatedAt)}
                  </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
            marginTop: "48px",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              fontWeight: "500",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#3F3F46",
              margin: 0,
            }}
          >
            Connected Domains
          </p>
        </div>

        <form
          onSubmit={handleConnectDomain}
          style={{
            background: "#111111",
            border: "1px solid #18181B",
            borderRadius: 16,
            display: "grid",
            gap: 12,
            marginBottom: 14,
            padding: 16,
          }}
        >
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
            <input
              value={domainHost}
              onChange={(event) => setDomainHost(event.target.value)}
              placeholder="www.clientdomain.com"
              style={{
                background: "#080808",
                border: "1px solid #27272A",
                borderRadius: 10,
                color: "#FAFAFA",
                fontSize: 13,
                outline: "none",
                padding: "11px 12px",
              }}
            />
            <select
              value={domainSiteId}
              onChange={(event) => setDomainSiteId(event.target.value)}
              style={{
                background: "#080808",
                border: "1px solid #27272A",
                borderRadius: 10,
                color: "#FAFAFA",
                fontSize: 13,
                outline: "none",
                padding: "11px 12px",
              }}
            >
              <option value="">First published site</option>
              {publishedSites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.slug}
                </option>
              ))}
            </select>
          </div>
          <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 8 }}>
              {(["txt", "cname"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setDomainVerificationType(type)}
                  style={{
                    background: domainVerificationType === type ? "#FAFAFA" : "#080808",
                    border: "1px solid #27272A",
                    borderRadius: 8,
                    color: domainVerificationType === type ? "#09090B" : "#A1A1AA",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "8px 10px",
                    textTransform: "uppercase",
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
            <button
              type="submit"
              disabled={domainSubmitting || publishedSites.length === 0}
              style={{
                background: "#FAFAFA",
                border: 0,
                borderRadius: 10,
                color: "#09090B",
                cursor: domainSubmitting || publishedSites.length === 0 ? "not-allowed" : "pointer",
                fontSize: 13,
                fontWeight: 700,
                opacity: domainSubmitting || publishedSites.length === 0 ? 0.55 : 1,
                padding: "10px 14px",
              }}
            >
              {domainSubmitting ? "Connecting..." : "Connect Domain"}
            </button>
          </div>
          {domainError ? (
            <p style={{ color: "#F87171", fontSize: 12, margin: 0 }}>{domainError}</p>
          ) : null}
        </form>

        <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
          {connectedDomains.length === 0 ? (
            <div
              style={{
                border: "1px dashed #1E1E21",
                borderRadius: "16px",
                color: "#3F3F46",
                fontSize: 13,
                padding: 24,
                textAlign: "center",
              }}
            >
              No connected domains yet.
            </div>
          ) : (
            connectedDomains.map((domain) => (
              <div
                key={domain.id}
                style={{
                  alignItems: "center",
                  background: "#111111",
                  border: "1px solid #18181B",
                  borderRadius: "16px",
                  display: "flex",
                  gap: 14,
                  padding: "16px 20px",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: "#FAFAFA", fontSize: 14.5, fontWeight: 600, margin: 0 }}>
                    {domain.domain}
                  </p>
                  <p style={{ color: "#3F3F46", fontSize: 12.5, margin: "3px 0 0" }}>
                    {domain.status} - Add {domain.verificationType.toUpperCase()} {domain.verificationHost} = {domain.verificationValue}
                  </p>
                  {domain.failureReason ? (
                    <p style={{ color: "#F87171", fontSize: 12, margin: "5px 0 0" }}>
                      {domain.failureReason}
                    </p>
                  ) : null}
                </div>
                <div
                  style={{
                    border: "1px solid #27272A",
                    borderRadius: 8,
                    color: "#A1A1AA",
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "8px 10px",
                    textTransform: "capitalize",
                  }}
                >
                  {domain.status}
                </div>
                <button
                  type="button"
                  onClick={() => void handleVerifyDomain(domain.id)}
                  disabled={domainActionId === domain.id}
                  style={{
                    background: "#FAFAFA",
                    border: 0,
                    borderRadius: 8,
                    color: "#09090B",
                    cursor: domainActionId === domain.id ? "not-allowed" : "pointer",
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "8px 10px",
                  }}
                >
                  {domainActionId === domain.id ? "Checking..." : "Verify"}
                </button>
                <button
                  type="button"
                  onClick={() => void handleRemoveDomain(domain.id)}
                  disabled={domainActionId === domain.id}
                  style={{
                    background: "transparent",
                    border: "1px solid #27272A",
                    borderRadius: 8,
                    color: "#A1A1AA",
                    cursor: domainActionId === domain.id ? "not-allowed" : "pointer",
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "8px 10px",
                  }}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        <div
          style={{
                    padding: "4px 10px",
                    borderRadius: "6px",
                    backgroundColor: "rgba(161,161,170,0.08)",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: "11.5px",
                      fontWeight: "600",
                      color: "#A1A1AA",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {template?.category ?? "Template"}
                  </span>
                </div>

                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  style={{
                    flexShrink: 0,
                    color: "#27272A",
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered
                      ? "translateX(0)"
                      : "translateX(-4px)",
                    transition: "all 200ms ease-out",
                  }}
                >
                  <path
                    d="M2 7h10M8 3l4 4-4 4"
                    stroke="#A1A1AA"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => router.push("/templates")}
          style={{
            marginTop: "12px",
            padding: "24px",
            border: "1px dashed #1E1E21",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            cursor: "pointer",
            opacity: mounted ? 1 : 0,
            transition: "opacity 600ms ease-out 500ms",
            width: "100%",
            background: "transparent",
          }}
          type="button"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 1v12M1 7h12"
              stroke="#27272A"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span
            style={{
              fontSize: "13px",
              fontWeight: "500",
              color: "#27272A",
              letterSpacing: "-0.01em",
            }}
          >
            Start a new project
          </span>
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
            marginTop: "48px",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              fontWeight: "500",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#3F3F46",
              margin: 0,
            }}
          >
            Published Sites
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
          {publishedSites.length === 0 ? (
            <div
              style={{
                border: "1px dashed #1E1E21",
                borderRadius: "16px",
                color: "#3F3F46",
                fontSize: 13,
                padding: 24,
                textAlign: "center",
              }}
            >
              No published sites yet.
            </div>
          ) : (
            publishedSites.map((site) => {
              const analytics = site.site_analytics?.[0];
              return (
                <div
                  key={site.id}
                  style={{
                    alignItems: "center",
                    background: "#111111",
                    border: "1px solid #18181B",
                    borderRadius: "16px",
                    display: "flex",
                    gap: 14,
                    padding: "16px 20px",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: "#FAFAFA", fontSize: 14.5, fontWeight: 600, margin: 0 }}>
                      {site.seo_title ?? site.slug}
                    </p>
                    <p style={{ color: "#3F3F46", fontSize: 12.5, margin: "3px 0 0" }}>
                      {site.status} - Published {formatUpdatedAt(new Date(site.updated_at).getTime())} - {analytics?.page_views ?? 0} views
                    </p>
                    <p style={{ color: "#52525B", fontSize: 12, margin: "3px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {site.public_url}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => window.open(site.public_url, "_blank", "noopener,noreferrer")}
                    style={{ background: "transparent", border: "1px solid #27272A", borderRadius: 8, color: "#A1A1AA", cursor: "pointer", fontSize: 12, fontWeight: 600, padding: "8px 10px" }}
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push(`/editor/${site.project_id}`)}
                    style={{ background: "transparent", border: "1px solid #27272A", borderRadius: 8, color: "#A1A1AA", cursor: "pointer", fontSize: 12, fontWeight: 600, padding: "8px 10px" }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleUnpublishSite(site.id)}
                    style={{ background: "transparent", border: "1px solid #27272A", borderRadius: 8, color: "#A1A1AA", cursor: "pointer", fontSize: 12, fontWeight: 600, padding: "8px 10px" }}
                  >
                    Unpublish
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDeleteSite(site.id)}
                    style={{ background: "transparent", border: "1px solid #3F1D1D", borderRadius: 8, color: "#FCA5A5", cursor: "pointer", fontSize: 12, fontWeight: 600, padding: "8px 10px" }}
                  >
                    Delete
                  </button>
                </div>
              );
            })
          )}
        </div>
      </main>

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, #18181B 30%, #18181B 70%, transparent)",
          zIndex: 40,
        }}
      />

      {generateOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => {
            if (!generating) setGenerateOpen(false);
          }}
          style={{
            alignItems: "center",
            background: "rgba(0,0,0,0.72)",
            display: "flex",
            inset: 0,
            justifyContent: "center",
            padding: 24,
            position: "fixed",
            zIndex: 80,
          }}
        >
          <form
            onSubmit={handleGenerateProject}
            onClick={(event) => event.stopPropagation()}
            style={{
              background: "#0A0A0A",
              border: "1px solid #1A1A1A",
              borderRadius: 16,
              maxWidth: 520,
              padding: 24,
              width: "100%",
            }}
          >
            <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
              <div>
                <p style={{ color: "#3F3F46", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", margin: "0 0 8px", textTransform: "uppercase" }}>
                  Schema Generator
                </p>
                <h2 style={{ color: "#FAFAFA", fontSize: 22, letterSpacing: "-0.04em", margin: 0 }}>
                  Generate With AI
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setGenerateOpen(false)}
                disabled={generating}
                style={{
                  background: "transparent",
                  border: "1px solid #27272A",
                  borderRadius: 8,
                  color: "#A1A1AA",
                  cursor: generating ? "wait" : "pointer",
                  height: 32,
                  width: 32,
                }}
              >
                X
              </button>
            </div>
            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ color: "#71717A", display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 8, textTransform: "uppercase" }}>
                Business Name
              </span>
              <input
                value={generateBusinessName}
                onChange={(event) => setGenerateBusinessName(event.target.value)}
                placeholder="StoneAI"
                style={{
                  background: "#050505",
                  border: "1px solid #242427",
                  borderRadius: 8,
                  color: "#FAFAFA",
                  fontSize: 14,
                  outline: "none",
                  padding: 12,
                  width: "100%",
                }}
              />
            </label>
            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ color: "#71717A", display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 8, textTransform: "uppercase" }}>
                Description
              </span>
              <textarea
                value={generateDescription}
                onChange={(event) => setGenerateDescription(event.target.value)}
                placeholder="What the business does, who it serves, and what makes it different."
                rows={3}
                style={{
                  background: "#050505",
                  border: "1px solid #242427",
                  borderRadius: 8,
                  color: "#FAFAFA",
                  fontSize: 14,
                  outline: "none",
                  padding: 12,
                  resize: "vertical",
                  width: "100%",
                }}
              />
            </label>
            <label style={{ display: "block", marginBottom: 14 }}>
              <span style={{ color: "#71717A", display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 8, textTransform: "uppercase" }}>
                Prompt
              </span>
              <textarea
                value={generatePrompt}
                onChange={(event) => setGeneratePrompt(event.target.value)}
                placeholder="AI startup for automating customer support..."
                rows={4}
                style={{
                  background: "#050505",
                  border: "1px solid #242427",
                  borderRadius: 8,
                  color: "#FAFAFA",
                  fontSize: 14,
                  outline: "none",
                  padding: 12,
                  resize: "vertical",
                  width: "100%",
                }}
              />
            </label>
            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr", marginBottom: 14 }}>
              <label>
                <span style={{ color: "#71717A", display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 8, textTransform: "uppercase" }}>
                  Industry
                </span>
                <select
                  value={generateIndustry}
                  onChange={(event) => setGenerateIndustry(event.target.value as WebsiteIndustry | "Auto")}
                  style={{ background: "#050505", border: "1px solid #242427", borderRadius: 8, color: "#FAFAFA", fontSize: 13, padding: 11, width: "100%" }}
                >
                  {["Auto", "AI", "Startup", "Agency", "Portfolio", "SaaS", "Ecommerce"].map((industry) => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </label>
              <label>
                <span style={{ color: "#71717A", display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 8, textTransform: "uppercase" }}>
                  Style
                </span>
                <select
                  value={generateStyle}
                  onChange={(event) => setGenerateStyle(event.target.value as WebsiteStyle)}
                  style={{ background: "#050505", border: "1px solid #242427", borderRadius: 8, color: "#FAFAFA", fontSize: 13, padding: 11, width: "100%" }}
                >
                  {["Premium", "Minimal", "Bold", "Editorial", "Technical"].map((style) => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </label>
            </div>
            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr", marginBottom: 14 }}>
              <label>
                <span style={{ color: "#71717A", display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 8, textTransform: "uppercase" }}>
                  Color Preference
                </span>
                <input
                  value={generateColorPreference}
                  onChange={(event) => setGenerateColorPreference(event.target.value)}
                  placeholder="Dark monochrome"
                  style={{ background: "#050505", border: "1px solid #242427", borderRadius: 8, color: "#FAFAFA", fontSize: 13, outline: "none", padding: 11, width: "100%" }}
                />
              </label>
              <label>
                <span style={{ color: "#71717A", display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 8, textTransform: "uppercase" }}>
                  Website Type
                </span>
                <input
                  value={generateWebsiteType}
                  onChange={(event) => setGenerateWebsiteType(event.target.value)}
                  placeholder="Landing page"
                  style={{ background: "#050505", border: "1px solid #242427", borderRadius: 8, color: "#FAFAFA", fontSize: 13, outline: "none", padding: 11, width: "100%" }}
                />
              </label>
            </div>
            {generateError ? (
              <p style={{ color: "#FCA5A5", fontSize: 12, lineHeight: 1.5, margin: "0 0 14px" }}>
                {generateError}
              </p>
            ) : creditsRemaining <= 0 ? (
              <p style={{ color: "#FCA5A5", fontSize: 12, lineHeight: 1.5, margin: "0 0 14px" }}>
                You are out of credits. Upgrade your plan to generate more websites.
              </p>
            ) : null}
            <button
              disabled={generating || creditsRemaining <= 0}
              type="submit"
              style={{
                background: "#FAFAFA",
                border: 0,
                borderRadius: 8,
                color: "#0A0A0A",
                cursor: generating ? "wait" : "pointer",
                fontSize: 13,
                fontWeight: 700,
                padding: "12px 16px",
                width: "100%",
              }}
            >
              {generating ? "Generating..." : "Generate project"}
            </button>
          </form>
        </div>
      ) : null}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; }
        button:focus-visible { outline: 2px solid #52525B; outline-offset: 2px; }
      `}</style>
    </div>
  );
}
