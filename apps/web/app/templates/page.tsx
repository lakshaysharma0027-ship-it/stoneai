"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import TemplatePreviewModal from "@/components/templates/TemplatePreviewModal";
import { projectStorage, type StoredProject } from "@/lib/projects";
import {
  templates as projectTemplates,
  type TemplateMetadata,
} from "@/lib/templates";
import { templates, type Template } from "./lib/templates";

const filters = [
  "All",
  "SaaS",
  "Startup",
  "Agency",
  "Portfolio",
  "Ecommerce",
  "Creator",
  "Fintech",
  "Design",
];

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", { month: "short", year: "2-digit" }).format(
    new Date(value),
  );

const resolveProjectTemplate = (template: Template): TemplateMetadata => {
  const projectTemplate = projectTemplates.find(
    (candidate) => candidate.name.toLowerCase() === template.name.toLowerCase(),
  );

  if (!projectTemplate) {
    throw new Error(`Missing project template for "${template.name}".`);
  }

  return projectTemplate;
};

function PreviewImage({
  src,
  alt,
  style,
}: {
  src?: string;
  alt: string;
  style: React.CSSProperties;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        style={{
          ...style,
          alignItems: "center",
          background: "#111",
          color: "#555",
          display: "flex",
          fontSize: 10,
          justifyContent: "center",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        Preview missing
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} style={style} onError={() => setFailed(true)} />
  );
}

function SkeletonBlock({
  style,
}: {
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        animation: "pulse 1.5s ease-in-out infinite alternate",
        background: "#111",
        borderRadius: 4,
        ...style,
      }}
    />
  );
}

function SkeletonCard() {
  return (
    <article style={{ background: "#000" }}>
      <div
        style={{
          aspectRatio: "16 / 10",
          background: "#111",
          overflow: "hidden",
          position: "relative",
        }}
      />
      <div style={{ padding: "14px 16px 16px" }}>
        <SkeletonBlock style={{ height: 10, marginBottom: 10, width: "60%" }} />
        <SkeletonBlock style={{ height: 10, marginBottom: 6, width: "85%" }} />
        <SkeletonBlock style={{ height: 10, marginBottom: 6, width: "50%" }} />
      </div>
      <div
        style={{
          alignItems: "center",
          borderTop: "0.5px solid #1a1a1a",
          display: "flex",
          justifyContent: "space-between",
          padding: "10px 16px",
        }}
      >
        <SkeletonBlock style={{ height: 10, width: 90 }} />
        <SkeletonBlock style={{ height: 10, width: 44 }} />
      </div>
    </article>
  );
}

export default function TemplatesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("popular");
  const [isLoading, setIsLoading] = useState(true);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [creatingTemplateId, setCreatingTemplateId] = useState<number | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 250);
    return () => window.clearTimeout(timer);
  }, []);

  const filtered = useMemo(
    () =>
      templates
        .filter((template) => activeFilter === "All" || template.category === activeFilter)
        .filter(
          (template) =>
            template.name.toLowerCase().includes(search.toLowerCase()) ||
            template.description.toLowerCase().includes(search.toLowerCase()) ||
            template.category.toLowerCase().includes(search.toLowerCase()),
        )
        .sort((a, b) => {
          if (sortOrder === "name") return a.name.localeCompare(b.name);
          if (sortOrder === "newest") {
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          }
          return b.uses - a.uses;
        }),
    [activeFilter, search, sortOrder],
  );

  const createProjectFromTemplate = (template: Template) => {
    const projectTemplate = resolveProjectTemplate(template);
    setCreatingTemplateId(template.id);

    window.setTimeout(() => {
      const project: StoredProject = {
        id: crypto.randomUUID(),
        name: projectTemplate.name,
        templateId: projectTemplate.id,
        websiteSchema: structuredClone(projectTemplate.schema),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      projectStorage.save(project);
      void projectStorage
        .saveRemote(project)
        .then((savedProject) => {
          router.push(`/editor/${savedProject.id}`);
        })
        .catch((error: unknown) => {
          console.error("[StoneAI templates] remote project save failed", error);
          setCreatingTemplateId(null);
        });
    }, 500);
  };

  return (
    <main
      style={{
        background: "#000",
        color: "#fff",
        fontFamily: "system-ui, Inter, sans-serif",
        letterSpacing: "-0.01em",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <MarketingNav />
      <style>
        {`@keyframes pulse { from { opacity: 0.4 } to { opacity: 0.8 } }`}
      </style>
      <div style={{ margin: "0 auto", maxWidth: 1280 }}>
        <section
          style={{
            margin: "0 auto",
            maxWidth: 560,
            padding: "100px 24px 48px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "#555",
              fontSize: 11,
              letterSpacing: "0.12em",
              margin: "0 0 20px",
              textTransform: "uppercase",
            }}
          >
            Template Gallery
          </p>
          <h1
            style={{
              color: "#fff",
              fontSize: 48,
              fontWeight: 500,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              margin: "0 0 16px",
            }}
          >
            Start with something exceptional.
          </h1>
          <p
            style={{
              color: "#888",
              fontSize: 15,
              lineHeight: 1.6,
              margin: "0 auto 36px",
              maxWidth: 420,
            }}
          >
            Production-ready templates for every product. Designed to ship, built to scale.
          </p>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search templates..."
            style={{
              background: "#0a0a0a",
              border: "0.5px solid #242424",
              borderRadius: 6,
              color: "#fff",
              fontSize: 14,
              outline: "none",
              padding: "12px 16px",
              width: "100%",
            }}
          />
        </section>

        <section
          style={{
            alignItems: "center",
            borderBottom: "0.5px solid #1a1a1a",
            borderTop: "0.5px solid #1a1a1a",
            display: "flex",
            justifyContent: "space-between",
            margin: "0 24px 24px",
            padding: "20px 0",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {filters.map((filter) => {
              const active = activeFilter === filter;

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  style={{
                    background: active ? "#fff" : "transparent",
                    border: `0.5px solid ${active ? "#fff" : "transparent"}`,
                    borderRadius: 6,
                    color: active ? "#000" : "#888",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: active ? 500 : 400,
                    padding: "6px 14px",
                  }}
                  onMouseEnter={(event) => {
                    if (!active) {
                      event.currentTarget.style.color = "#fff";
                      event.currentTarget.style.borderColor = "#333";
                    }
                  }}
                  onMouseLeave={(event) => {
                    if (!active) {
                      event.currentTarget.style.color = "#888";
                      event.currentTarget.style.borderColor = "transparent";
                    }
                  }}
                >
                  {filter}
                </button>
              );
            })}
          </div>
          <div style={{ alignItems: "center", display: "flex", gap: 8 }}>
            <span
              style={{
                color: "#555",
                fontSize: 12,
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
              }}
            >
              {filtered.length} template{filtered.length === 1 ? "" : "s"}
            </span>
            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              style={{
                background: "transparent",
                border: "0.5px solid #242424",
                borderRadius: 6,
                color: "#888",
                fontSize: 12,
                padding: "6px 12px",
              }}
            >
              <option value="popular">Most popular</option>
              <option value="newest">Newest</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </section>

        {filtered.length === 0 && !isLoading ? (
          <div style={{ padding: "80px 32px", textAlign: "center" }}>
            <p
              style={{
                color: "#555",
                fontSize: 14,
                letterSpacing: "-0.01em",
                margin: 0,
              }}
            >
              No templates found. Try a different search.
            </p>
          </div>
        ) : (
          <section
            style={{
              background: "#1a1a1a",
              borderRadius: 12,
              display: "grid",
              gap: 1,
              gridTemplateColumns: "repeat(3, 1fr)",
              margin: "0 24px 48px",
              overflow: "hidden",
            }}
          >
            {isLoading
              ? Array.from({ length: 6 }, (_, index) => <SkeletonCard key={index} />)
              : filtered.map((template) => {
                  const isCreating = creatingTemplateId === template.id;

                  return (
                    <article
                      key={template.id}
                      style={{
                        background: template.bgColor === "#000" ? "#000" : "#0a0a0a",
                        minWidth: 0,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          aspectRatio: "16 / 10",
                          background: template.bgColor || "#111",
                          overflow: "hidden",
                          position: "relative",
                        }}
                        onMouseEnter={(event) => {
                          const overlay = event.currentTarget.querySelector(
                            "[data-overlay]",
                          ) as HTMLDivElement | null;
                          if (overlay) {
                            overlay.style.opacity = "1";
                          }
                        }}
                        onMouseLeave={(event) => {
                          const overlay = event.currentTarget.querySelector(
                            "[data-overlay]",
                          ) as HTMLDivElement | null;
                          if (overlay) {
                            overlay.style.opacity = "0";
                          }
                        }}
                      >
                        <PreviewImage
                          src={template.desktopScreenshot}
                          alt={`${template.name} preview`}
                          style={{
                            display: "block",
                            height: "100%",
                            objectFit: "cover",
                            width: "100%",
                          }}
                        />
                        <div
                          style={{
                            background: "rgba(0,0,0,0.7)",
                            border: "0.5px solid rgba(255,255,255,0.1)",
                            borderRadius: 3,
                            color: "#aaa",
                            fontSize: 10,
                            left: 12,
                            letterSpacing: "0.08em",
                            padding: "3px 8px",
                            position: "absolute",
                            textTransform: "uppercase",
                            top: 12,
                          }}
                        >
                          {template.category}
                        </div>
                        {template.featured ? (
                          <div
                            style={{
                              background: "#fff",
                              borderRadius: 3,
                              color: "#000",
                              fontSize: 9,
                              fontWeight: 500,
                              padding: "2px 7px",
                              position: "absolute",
                              right: 12,
                              top: 12,
                            }}
                          >
                            Featured
                          </div>
                        ) : null}
                        <div
                          data-overlay
                          style={{
                            alignItems: "center",
                            background: "rgba(0,0,0,0.6)",
                            display: "flex",
                            gap: 8,
                            inset: 0,
                            justifyContent: "center",
                            opacity: 0,
                            position: "absolute",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => setPreviewTemplate(template)}
                            style={{
                              background: "rgba(255,255,255,0.08)",
                              border: "0.5px solid rgba(255,255,255,0.25)",
                              borderRadius: 6,
                              color: "#fff",
                              cursor: "pointer",
                              fontSize: 12,
                              padding: "8px 18px",
                            }}
                          >
                            Preview
                          </button>
                          <button
                            type="button"
                            onClick={() => createProjectFromTemplate(template)}
                            disabled={isCreating}
                            style={{
                              background: "#fff",
                              border: "none",
                              borderRadius: 6,
                              color: "#000",
                              cursor: isCreating ? "wait" : "pointer",
                              fontSize: 12,
                              fontWeight: 500,
                              padding: "8px 18px",
                            }}
                          >
                            {isCreating ? "Creating Project..." : "Use Template"}
                          </button>
                        </div>
                      </div>
                      <div style={{ padding: "14px 16px 16px" }}>
                        <h2
                          style={{
                            color: "#fff",
                            fontSize: 14,
                            fontWeight: 500,
                            letterSpacing: "-0.02em",
                            margin: "0 0 4px",
                          }}
                        >
                          {template.name}
                        </h2>
                        <p
                          style={{
                            color: "#555",
                            fontSize: 12,
                            lineHeight: 1.5,
                            margin: 0,
                          }}
                        >
                          {template.description}
                        </p>
                      </div>
                      <div
                        style={{
                          alignItems: "center",
                          borderTop: "0.5px solid #1a1a1a",
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "10px 16px",
                        }}
                      >
                        <div
                          style={{
                            color: "#555",
                            display: "flex",
                            fontSize: 11,
                            gap: 10,
                          }}
                        >
                          <span>{template.pages} sections</span>
                          <span>{template.uses.toLocaleString()} uses</span>
                        </div>
                        <span style={{ color: "#333", fontSize: 11 }}>
                          {formatDate(template.updatedAt)}
                        </span>
                      </div>
                    </article>
                  );
                })}
          </section>
        )}
      </div>

      {previewTemplate ? (
        <TemplatePreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onUseTemplate={createProjectFromTemplate}
          isCreating={creatingTemplateId === previewTemplate.id}
        />
      ) : null}
      <MarketingFooter />
    </main>
  );
}
