"use client";

import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Film,
  ImageIcon,
  LayoutGrid,
  Lock,
  Sparkles,
  Wand2,
} from "lucide-react";
import { CREDIT_COSTS } from "@/lib/billing/credits";
import { getUpgradeHint, planHasFeature } from "@/lib/billing/planFeatures";
import { normalizeBillingPlanId } from "@/lib/billing/plans";
import { nanoBananaGallery, templateCatalog } from "@/lib/template-catalog";
import {
  PIPELINE_UPLOAD_LIMITS,
  uploadPipelineMedia,
  type PipelineMediaKind,
} from "@/lib/cinematic/clientMediaUpload";
import { RecentMediaSelect } from "./RecentMediaSelect";
import type { DashboardDataContext } from "../hooks/useDashboardData";
import { GenerationPageHeader } from "../generation/GenerationPageHeader";
import { GenerationProgressOverlay } from "../generation/GenerationProgressOverlay";
import type { PipelineFormState } from "../types";
import "../generation-pages.css";

const STEP_LABELS = [
  "Template",
  "Website Prompt",
  "First Image",
  "Last Image",
  "Video",
  "Generate",
] as const;

const PROMPT_EXAMPLES = [
  "Luxury real estate agency with cinematic property showcases",
  "AI startup landing page with dark premium SaaS styling",
  "3D gaming website with immersive hero and community sections",
  "Fine dining restaurant with reservation flow and tasting menu",
];

function MediaUploadField({
  label,
  accept,
  value,
  onChange,
  hint,
  kind,
  maxBytes,
}: {
  label: string;
  accept: string;
  value: string;
  onChange: (value: string) => void;
  hint: string;
  kind: PipelineMediaKind;
  maxBytes: number;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  return (
    <div className="pipeline-upload">
      <label className="field-label">{label}</label>
      <p className="pipeline-copy">{hint}</p>
      <input
        type="file"
        accept={accept}
        disabled={uploading}
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          setUploadError(null);
          if (file.size > maxBytes) {
            setUploadError(`File must be ${Math.round(maxBytes / (1024 * 1024))} MB or smaller.`);
            return;
          }
          setUploading(true);
          try {
            const url = await uploadPipelineMedia(file, kind);
            onChange(url);
          } catch (error) {
            setUploadError(error instanceof Error ? error.message : "Upload failed.");
          } finally {
            setUploading(false);
            event.target.value = "";
          }
        }}
      />
      {uploading ? <p className="pipeline-copy">Uploading to storage…</p> : null}
      {uploadError ? <p className="gen-error">{uploadError}</p> : null}
      {value ? (
        <>
          <p className="pipeline-copy">{value.startsWith("http") ? "Uploaded" : "Ready"}</p>
          <button type="button" className="pipeline-link" onClick={() => onChange("")}>
            Remove upload
          </button>
        </>
      ) : null}
    </div>
  );
}

export function PipelineWizard({ data }: { data: DashboardDataContext }) {
  const planId = normalizeBillingPlanId(data.billingSummary?.subscription.plan);
  const [step, setStep] = useState(0);
  const form = data.pipelineForm;
  const setForm = data.updatePipelineForm;

  const canNano = planHasFeature(planId, "first_image_prompt");
  const canLast = planHasFeature(planId, "last_image_prompt");
  const canVeo = planHasFeature(planId, "veo");
  const canPreset = planHasFeature(planId, "preset_gallery");

  const canUpload = planHasFeature(planId, "media_upload");

  const estimatedCost = useMemo(() => {
    let total = CREDIT_COSTS.generate_website;
    if (canNano && form.firstImagePrompt.trim() && !form.heroImageUpload.trim()) {
      total += CREDIT_COSTS.media_image_generate;
    }
    if (canLast && form.lastImagePrompt.trim() && !form.lastFrameImageUpload.trim()) {
      total += CREDIT_COSTS.media_image_generate;
    }
    if (canVeo && form.veoPrompt.trim() && !form.motionVideoUpload.trim()) {
      total += CREDIT_COSTS.media_video_generate;
    }
    return total;
  }, [canLast, canNano, canVeo, form]);

  const goNext = () => setStep((value) => Math.min(value + 1, STEP_LABELS.length - 1));
  const goBack = () => setStep((value) => Math.max(value - 1, 0));

  const renderLocked = (feature: "first_image_prompt" | "last_image_prompt" | "veo") => {
    const hint = getUpgradeHint(feature === "veo" ? "veo" : feature);
    return (
      <div className="pipeline-locked">
        <div className="pipeline-locked-icon">
          <Lock size={16} />
        </div>
        <div>
          <strong>Locked on your plan</strong>
          <p>
            {feature === "veo"
              ? "Veo cinematic motion is available on Basic and above."
              : "Custom Nano Banana prompts are available on Basic and above."}
          </p>
          {hint ? (
            <button type="button" className="pipeline-upgrade" onClick={() => data.router.push("/dashboard?view=billing")}>
              {hint.label}
            </button>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div className="gen-spec-page pipeline-wizard">
      <GenerationProgressOverlay
        active={data.generating}
        mode="pipeline"
        title="Building your cinematic website"
        subtitle="Describe it. Visualize it. Animate it. Publish it."
      />

      <GenerationPageHeader
        title="Create Website"
        cost={estimatedCost}
        costLabel="estimated"
        remaining={data.creditsRemaining}
      />

      <div className="pipeline-stepper">
        {STEP_LABELS.map((label, index) => (
          <button
            key={label}
            type="button"
            className={`pipeline-step-pill ${index === step ? "active" : index < step ? "done" : ""}`}
            onClick={() => setStep(index)}
          >
            <span>{index + 1}</span>
            {label}
          </button>
        ))}
      </div>

      <div className="gen-layout">
        <div className="gen-card">
          <div className="gen-card-head">
            <span className="gen-card-title">{STEP_LABELS[step]}</span>
            <span className="gen-card-meta">
              <Sparkles size={12} />
              Pipeline step {step + 1} of {STEP_LABELS.length}
            </span>
          </div>

          <div className="gen-card-body">
            {step === 0 ? (
              <>
                <p className="pipeline-copy">
                  Start from a StoneAI template or skip and let the pipeline design from your prompt.
                </p>
                <div className="pipeline-template-grid">
                  <button
                    type="button"
                    className={`pipeline-template-card ${!form.templateId ? "active" : ""}`}
                    onClick={() => setForm("templateId", null)}
                  >
                    <strong>Skip template</strong>
                    <span>Generate from prompt only</span>
                  </button>
                  {templateCatalog.slice(0, 6).map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      className={`pipeline-template-card ${form.templateId === template.id ? "active" : ""}`}
                      onClick={() => setForm("templateId", template.id)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={template.previewImage} alt="" />
                      <strong>{template.name}</strong>
                      <span>{template.category}</span>
                    </button>
                  ))}
                </div>
                <button type="button" className="pipeline-link" onClick={() => data.router.push("/templates")}>
                  <LayoutGrid size={14} />
                  Browse all templates
                </button>
              </>
            ) : null}

            {step === 1 ? (
              <>
                <label className="field-label" htmlFor="business-name">Business name</label>
                <input
                  id="business-name"
                  className="input mb-12"
                  value={form.businessName}
                  onChange={(e) => setForm("businessName", e.target.value)}
                  placeholder="StoneAI"
                />
                <label className="field-label" htmlFor="website-prompt">Website prompt</label>
                <textarea
                  id="website-prompt"
                  className="prompt-area"
                  value={form.websitePrompt}
                  onChange={(e) => setForm("websitePrompt", e.target.value)}
                  placeholder="Describe the website you want — industry, audience, mood, and sections."
                />
                <div className="pipeline-examples">
                  {PROMPT_EXAMPLES.map((example) => (
                    <button key={example} type="button" onClick={() => setForm("websitePrompt", example)}>
                      {example}
                    </button>
                  ))}
                </div>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <RecentMediaSelect
                  slot="first"
                  label="Reuse recent first-frame image (last 48h)"
                  onSelect={(url) => {
                    setForm("heroImageUpload", url);
                    setForm("firstImagePrompt", "");
                  }}
                  disabled={data.generating}
                />
                {canUpload ? (
                  <MediaUploadField
                    accept="image/*"
                    hint="Upload your own hero image instead of generating with Nano Banana. Files upload to storage (not sent as base64)."
                    label="Upload hero image (optional)"
                    kind="hero"
                    maxBytes={PIPELINE_UPLOAD_LIMITS.imageBytes}
                    onChange={(value) => setForm("heroImageUpload", value)}
                    value={form.heroImageUpload}
                  />
                ) : null}
                {canNano && !form.heroImageUpload ? (
                  <>
                    <label className="field-label" htmlFor="first-image-prompt">Or generate with Nano Banana</label>
                    <textarea
                      id="first-image-prompt"
                      className="prompt-area"
                      value={form.firstImagePrompt}
                      onChange={(e) => setForm("firstImagePrompt", e.target.value)}
                      placeholder="Cinematic hero image for a luxury real estate brand, dark studio lighting, premium minimal composition"
                    />
                  </>
                ) : null}
                {!canNano && canPreset && !form.heroImageUpload ? (
                  <>
                    <p className="pipeline-copy">Or choose a preset hero image from the StoneAI gallery.</p>
                    <div className="pipeline-preset-grid">
                      {nanoBananaGallery.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className={`pipeline-preset-card ${form.presetHeroImageId === item.id ? "active" : ""}`}
                          onClick={() => setForm("presetHeroImageId", item.id)}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.src} alt={item.alt} />
                          <span>{item.prompt}</span>
                        </button>
                      ))}
                    </div>
                  </>
                ) : null}
                {!canNano && !canPreset && !form.heroImageUpload ? renderLocked("first_image_prompt") : null}
              </>
            ) : null}

            {step === 3 ? (
              <>
                <RecentMediaSelect
                  slot="last"
                  label="Reuse recent last-frame image (last 48h)"
                  onSelect={(url) => {
                    setForm("lastFrameImageUpload", url);
                    setForm("lastImagePrompt", "");
                  }}
                  disabled={data.generating}
                />
                {canUpload ? (
                  <MediaUploadField
                    accept="image/*"
                    hint="Upload a last-frame image instead of generating with Nano Banana."
                    kind="last-frame"
                    maxBytes={PIPELINE_UPLOAD_LIMITS.imageBytes}
                    label="Upload last image (optional)"
                    onChange={(value) => setForm("lastFrameImageUpload", value)}
                    value={form.lastFrameImageUpload}
                  />
                ) : null}
                {canLast && !form.lastFrameImageUpload ? (
                  <>
                    <label className="field-label" htmlFor="last-image-prompt">
                      Or generate last image <span className="field-label-optional">(optional)</span>
                    </label>
                    <textarea
                      id="last-image-prompt"
                      className="prompt-area"
                      value={form.lastImagePrompt}
                      onChange={(e) => setForm("lastImagePrompt", e.target.value)}
                      placeholder="Ending frame for motion — wide architectural reveal at golden hour"
                    />
                  </>
                ) : !canLast && !form.lastFrameImageUpload ? renderLocked("last_image_prompt") : null}
              </>
            ) : null}

            {step === 4 ? (
              <>
                <RecentMediaSelect
                  slot="video"
                  label="Reuse recent motion video (last 48h)"
                  onSelect={(url) => {
                    setForm("motionVideoUpload", url);
                    setForm("veoPrompt", "");
                  }}
                  disabled={data.generating}
                />
                {canUpload ? (
                  <MediaUploadField
                    accept="video/*"
                    hint="Upload your own video instead of generating with Veo. Max 50 MB — uploads directly to storage."
                    kind="video"
                    maxBytes={PIPELINE_UPLOAD_LIMITS.videoBytes}
                    label="Upload video (optional)"
                    onChange={(value) => setForm("motionVideoUpload", value)}
                    value={form.motionVideoUpload}
                  />
                ) : null}
                {canVeo && !form.motionVideoUpload ? (
                  <>
                    <label className="field-label" htmlFor="veo-prompt">Or generate with Veo</label>
                    <p className="field-hint">
                      Uses your hero image as the first frame and your last-frame image from step 3 as the ending view — same as Google AI Studio image-to-video.
                    </p>
                    <textarea
                      id="veo-prompt"
                      className="prompt-area"
                      value={form.veoPrompt}
                      onChange={(e) => setForm("veoPrompt", e.target.value)}
                      placeholder="Slow drone movement from the hero scene to the wide architectural reveal, cinematic zoom, soft atmospheric light"
                    />
                    <div className="pipeline-veo-hints">
                      <span><Film size={12} /> First + last frame</span>
                      <span><ImageIcon size={12} /> 720p · 8s</span>
                      <span><Sparkles size={12} /> Cinematic motion</span>
                    </div>
                  </>
                ) : !canVeo && !form.motionVideoUpload ? renderLocked("veo") : null}
              </>
            ) : null}

            {step === 5 ? (
              <div className="pipeline-review">
                <div><span>Template</span><strong>{form.templateId ?? "Skipped"}</strong></div>
                <div><span>Website prompt</span><strong>{form.websitePrompt || "—"}</strong></div>
                <div><span>Hero image</span><strong>{form.heroImageUpload ? "Uploaded" : canNano && form.firstImagePrompt ? "Nano Banana" : form.presetHeroImageId ?? "Skipped"}</strong></div>
                <div><span>Last frame</span><strong>{form.lastFrameImageUpload ? "Uploaded" : canLast && form.lastImagePrompt ? "Nano Banana" : "Skipped"}</strong></div>
                <div><span>Video</span><strong>{form.motionVideoUpload ? "Uploaded" : canVeo && form.veoPrompt ? "Veo" : "Skipped"}</strong></div>
                <div><span>Estimated credits</span><strong>{estimatedCost}</strong></div>
                {data.generateError ? <p className="gen-error">{data.generateError}</p> : null}
                <button
                  type="button"
                  className={`gen-btn-main ${data.generating ? "disabled" : ""}`}
                  disabled={data.generating}
                  onClick={() => void data.handlePipelineGenerate()}
                >
                  <Wand2 size={15} />
                  {data.generating ? "Running pipeline…" : "Run generation pipeline"}
                  <span className="cost">· {estimatedCost} credits</span>
                </button>
              </div>
            ) : null}

            <div className="pipeline-nav">
              <button type="button" className="btn" onClick={goBack} disabled={step === 0 || data.generating}>
                <ChevronLeft size={14} />
                Back
              </button>
              {step < STEP_LABELS.length - 1 ? (
                <button type="button" className="btn btn-primary" onClick={goNext} disabled={data.generating}>
                  Continue
                  <ChevronRight size={14} />
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <aside className="aside-panel pipeline-aside">
          <div className="aside-head">
            <span className="aside-head-title">Pipeline stages</span>
          </div>
          <ul className="pipeline-stage-list">
            {[
              "Prompt Input",
              "Image Generation",
              "Motion Generation",
              "Frame Extraction",
              "Scene Build",
              "Experience Ready",
            ].map((stage) => (
              <li key={stage}>{stage}</li>
            ))}
          </ul>
          <p className="pipeline-aside-note">
            StoneAI builds scroll-driven cinematic experiences: Claude Opus plans scenes, Nano Banana creates first/last frames, Veo 3.1 Lite generates motion, and GSAP scroll-scrub drives the journey.
          </p>
        </aside>
      </div>
    </div>
  );
}
