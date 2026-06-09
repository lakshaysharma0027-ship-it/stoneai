"use client";

import { useState, type CSSProperties, type MouseEvent } from "react";
import { ComponentRegistry } from "./componentRegistry";
import { useEditorStore } from "./store";
import type {
  Section,
  WebsiteComponent,
  ImageComponentProps,
  TextComponentProps,
  ButtonComponentProps,
  FeatureListComponentProps,
  PricingTableComponentProps,
  TestimonialListComponentProps,
  FAQListComponentProps,
  ContactFormComponentProps,
  LinkListComponentProps,
  LogoComponentProps,
} from "./types";
import { Icon } from "./ui/Icon";

const deviceWidths = {
  desktop: 1200,
  tablet: 768,
  mobile: 390,
} as const;

const sectionStyle = (section: Section, zoom: number): CSSProperties => ({
  position: "relative",
  minHeight: 160 * zoom,
  paddingTop: section.styles.spacing?.paddingTop,
  paddingRight: section.styles.spacing?.paddingRight,
  paddingBottom: section.styles.spacing?.paddingBottom,
  paddingLeft: section.styles.spacing?.paddingLeft,
  backgroundColor: section.styles.background?.color ?? "#ffffff",
  backgroundImage:
    section.styles.background?.image ?? section.settings.backgroundImage
      ? `url(${section.styles.background?.image ?? section.settings.backgroundImage})`
      : undefined,
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  color: section.styles.typography?.color ?? "#111827",
  opacity: section.visibility === "hidden" ? 0.4 : 1,
});

function EmptyText({ children }: { children: string }) {
  return <span className="text-[#777]">{children}</span>;
}

function ImageWithFallback({
  src,
  alt,
  className,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full min-h-20 w-full items-center justify-center rounded border border-current/10 bg-black/5 px-3 text-center text-xs opacity-60">
        Image unavailable
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} style={style} onError={() => setFailed(true)} />
  );
}

function ComponentBlock({ component }: { component: WebsiteComponent }) {
  const selectedComponentId = useEditorStore((state) => state.selectedComponentId);
  const selectComponent = useEditorStore((state) => state.selectComponent);
  const selected = selectedComponentId === component.id;
  const className = selected
    ? "outline outline-2 outline-[#7dd3fc] outline-offset-2"
    : "hover:outline hover:outline-1 hover:outline-white/30";
  const typographyStyle: CSSProperties = {
    color: component.styles.typography?.color,
    fontFamily: component.styles.typography?.fontFamily,
    fontSize: component.styles.typography?.fontSize,
    fontWeight: component.styles.typography?.fontWeight,
    textAlign: component.styles.typography?.textAlign,
    lineHeight: component.styles.typography?.lineHeight,
    letterSpacing: component.styles.typography?.letterSpacing,
  };
  const boxStyle: CSSProperties = {
    background: component.styles.background?.color,
    borderColor: component.styles.border?.color,
    borderWidth: component.styles.border?.width,
    borderRadius: component.styles.border?.radius,
    paddingTop: component.styles.spacing?.paddingTop,
    paddingRight: component.styles.spacing?.paddingRight,
    paddingBottom: component.styles.spacing?.paddingBottom,
    paddingLeft: component.styles.spacing?.paddingLeft,
  };
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    selectComponent(component.id);
  };

  switch (component.type) {
    case "text":
    case "richText": {
      const props = component.props as TextComponentProps;
      const role = props.semanticRole ?? "body";
      const content = props.text.raw || <EmptyText>Empty text</EmptyText>;

      return (
        <div className={className} style={typographyStyle} onClick={handleClick}>
          {role === "heading" ? (
            <h2 className="text-4xl font-semibold tracking-normal">{content}</h2>
          ) : role === "legal" || role === "caption" ? (
            <p className="text-xs opacity-70">{content}</p>
          ) : (
            <p className="max-w-2xl text-base leading-7 opacity-80">{content}</p>
          )}
        </div>
      );
    }

    case "button": {
      const props = component.props as ButtonComponentProps;
      return (
        <a
          href={props.href}
          className={`inline-flex rounded-md border border-current px-4 py-2 text-sm ${className}`}
          style={{ ...typographyStyle, ...boxStyle }}
          onClick={(event) => {
            event.preventDefault();
            handleClick(event);
          }}
        >
          {props.label || "Button"}
        </a>
      );
    }

    case "featureList": {
      const props = component.props as FeatureListComponentProps;
      return (
        <div
          className={`grid w-full gap-4 ${className}`}
          style={{
            ...typographyStyle,
            ...boxStyle,
            gridTemplateColumns: `repeat(${props.columns}, minmax(0, 1fr))`,
          }}
          onClick={handleClick}
        >
          {props.items.length === 0 ? (
            <p className="col-span-full text-center text-sm opacity-70">
              No feature items added.
            </p>
          ) : props.items.map((item) => (
            <div key={item.id} className="rounded border border-current/10 p-4">
              {item.imageSrc && (
                <div className="mb-4 flex h-24 items-center justify-center overflow-hidden rounded bg-black/5">
                  <ImageWithFallback
                    src={item.imageSrc}
                    alt={item.title}
                    className="h-full w-full"
                    style={{ objectFit: "contain" }}
                  />
                </div>
              )}
              <h3 className="mb-2 font-medium">{item.title}</h3>
              <p className="text-sm opacity-70">{item.description}</p>
            </div>
          ))}
        </div>
      );
    }

    case "pricingTable": {
      const props = component.props as PricingTableComponentProps;
      return (
        <div
          className={`grid w-full gap-4 border md:grid-cols-2 ${className}`}
          style={{ ...typographyStyle, ...boxStyle }}
          onClick={handleClick}
        >
          {props.tiers.length === 0 ? (
            <p className="col-span-full text-center text-sm opacity-70">
              No pricing tiers added.
            </p>
          ) : props.tiers.map((tier) => (
            <div key={tier.id} className="rounded border border-current/10 p-4">
              <h3 className="font-medium">{tier.name}</h3>
              <p className="mt-2 text-2xl font-semibold">
                {props.currency} {tier.price}
              </p>
              <p className="mt-2 text-sm opacity-70">{tier.description}</p>
            </div>
          ))}
        </div>
      );
    }

    case "testimonialList": {
      const props = component.props as TestimonialListComponentProps;
      return (
        <div
          className={`grid w-full gap-4 md:grid-cols-2 ${className}`}
          style={{ ...typographyStyle, ...boxStyle }}
          onClick={handleClick}
        >
          {props.items.length === 0 ? (
            <p className="col-span-full text-center text-sm opacity-70">
              No testimonials added.
            </p>
          ) : props.items.map((item) => (
            <figure key={item.id} className="rounded border border-current/10 p-4">
              <blockquote className="text-sm opacity-80">{item.quote}</blockquote>
              <figcaption className="mt-3 text-xs opacity-60">
                {item.author}
                {item.role ? `, ${item.role}` : ""}
              </figcaption>
            </figure>
          ))}
        </div>
      );
    }

    case "faqList": {
      const props = component.props as FAQListComponentProps;
      return (
        <div
          className={`w-full space-y-3 ${className}`}
          style={{ ...typographyStyle, ...boxStyle }}
          onClick={handleClick}
        >
          {props.items.length === 0 ? (
            <p className="text-center text-sm opacity-70">No FAQ items added.</p>
          ) : props.items.map((item) => (
            <div key={item.id} className="rounded border border-current/10 p-4">
              <h3 className="font-medium">{item.question}</h3>
              <p className="mt-2 text-sm opacity-70">{item.answer}</p>
            </div>
          ))}
        </div>
      );
    }

    case "contactForm": {
      const props = component.props as ContactFormComponentProps;
      return (
        <div
          className={`w-full max-w-xl space-y-3 ${className}`}
          style={{ ...typographyStyle, ...boxStyle }}
          onClick={handleClick}
        >
          {props.fields.map((field) => (
            <label key={field.id} className="block text-sm">
              <span className="mb-1 block opacity-70">{field.label}</span>
              <div className="h-10 rounded border border-current/20" />
            </label>
          ))}
          <button className="rounded border border-current px-4 py-2 text-sm" type="button">
            {props.submitLabel}
          </button>
        </div>
      );
    }

    case "linkList":
    case "navbarLinks": {
      const props = component.props as LinkListComponentProps;
      return (
        <nav
          className={`flex flex-wrap justify-center gap-4 text-sm ${className}`}
          style={typographyStyle}
          onClick={handleClick}
        >
          {props.links.length === 0 ? (
            <EmptyText>No links added</EmptyText>
          ) : props.links.map((link) => (
            <a key={link.id} href={link.href} onClick={(event) => event.preventDefault()}>
              {link.label}
            </a>
          ))}
        </nav>
      );
    }

    case "logo": {
      const props = component.props as LogoComponentProps;
      return (
        <div
          className={`inline-flex items-center justify-center gap-2 text-base font-semibold ${className}`}
          style={typographyStyle}
          onClick={handleClick}
        >
          {props.imageSrc && (
            <ImageWithFallback
              src={props.imageSrc}
              alt={props.text || "Logo"}
              className="max-h-8 max-w-40"
              style={{ objectFit: "contain" }}
            />
          )}
          {props.text || <EmptyText>Logo</EmptyText>}
        </div>
      );
    }

    case "image":
      {
        const props = component.props as ImageComponentProps;
        return (
          <div
            className={`flex h-48 w-full items-center justify-center overflow-hidden rounded border border-current/10 text-sm opacity-70 ${className}`}
            style={boxStyle}
            onClick={handleClick}
          >
            {props.src ? (
              <ImageWithFallback
                src={props.src}
                alt={props.alt}
                className="h-full w-full"
                style={{ objectFit: props.objectFit }}
              />
            ) : (
              "Image"
            )}
          </div>
        );
      }
  }
}

function SectionBody({ section }: { section: Section }) {
  const components = [...section.components].sort((a, b) => a.order - b.order);

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
      {components.map((component) => (
        <ComponentBlock key={component.id} component={component} />
      ))}
    </div>
  );
}

function CanvasSection({ section, zoom }: { section: Section; zoom: number }) {
  const selectedSectionId = useEditorStore((state) => state.selectedSectionId);
  const hoveredSectionId = useEditorStore((state) => state.hoveredSectionId);
  const selectSection = useEditorStore((state) => state.selectSection);
  const selectComponent = useEditorStore((state) => state.selectComponent);
  const hoverSection = useEditorStore((state) => state.hoverSection);
  const isSelected = selectedSectionId === section.id;
  const isHovered = hoveredSectionId === section.id;
  const label = ComponentRegistry.resolve(section.type).displayName;

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    selectSection(section.id);
    selectComponent(null);
  };

  return (
    <div
      className="transition-colors duration-75"
      style={sectionStyle(section, zoom)}
      onClick={handleClick}
      onMouseEnter={() => hoverSection(section.id)}
      onMouseLeave={() => hoverSection(null)}
    >
      {(isSelected || isHovered) && (
        <div
          className={`pointer-events-none absolute inset-0 z-10 ${
            isSelected ? "border-2 border-[#7dd3fc]" : "border border-white/40"
          }`}
        >
          <div className="absolute left-2 top-2 rounded border border-[#1a1a1a] bg-[#060606] px-1.5 py-0.5 text-[9px] text-white/80 shadow-lg">
            {label}
          </div>
        </div>
      )}
      {section.visibility === "hidden" && (
        <div className="pointer-events-none absolute right-2 top-2 z-20 rounded border border-[#1a1a1a] bg-[#060606] px-1.5 py-0.5 text-[9px] text-white/60">
          Hidden
        </div>
      )}
      <SectionBody section={section} />
    </div>
  );
}

export default function Canvas() {
  const device = useEditorStore((state) => state.device);
  const zoom = useEditorStore((state) => state.zoom);
  const showGrid = useEditorStore((state) => state.showGrid);
  const website = useEditorStore((state) => state.website);
  const activePageId = useEditorStore((state) => state.activePageId);
  const setZoom = useEditorStore((state) => state.setZoom);
  const setShowGrid = useEditorStore((state) => state.setShowGrid);
  const clearSelection = useEditorStore((state) => state.clearSelection);
  const addSection = useEditorStore((state) => state.addSection);
  const activePage =
    website?.pages.find((page) => page.id === activePageId) ?? null;
  const canvasW = deviceWidths[device];
  const sections = [...(activePage?.sections ?? [])].sort(
    (a, b) => a.order - b.order,
  );

  return (
    <main className="relative flex flex-1 flex-col overflow-hidden bg-[#050505]">
      <div className={`relative flex-1 overflow-auto ${showGrid ? "canvas-grid" : ""}`}>
        <div className="pointer-events-none sticky left-0 top-0 z-20 h-5 border-b border-[#0D0D0D] bg-[#050505]/95">
          <div className="ml-6 flex h-full items-end overflow-hidden">
            {Array.from({ length: 40 }, (_, index) => (
              <div
                key={index}
                className="relative h-full flex-shrink-0 border-l border-[#0D0D0D]"
                style={{ width: 48 * zoom }}
              >
                <span className="absolute bottom-0.5 left-1 font-mono text-[8px] text-[#2D2D2D]">
                  {index * 100}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="pointer-events-none sticky left-0 top-5 z-20 float-left h-[calc(100%-20px)] w-6 border-r border-[#0D0D0D] bg-[#050505]/95">
          {Array.from({ length: 30 }, (_, index) => (
            <div
              key={index}
              className="relative border-t border-[#0D0D0D]"
              style={{ height: 48 * zoom }}
            >
              <span className="absolute right-1 top-1 rotate-90 font-mono text-[8px] text-[#2D2D2D]">
                {index * 100}
              </span>
            </div>
          ))}
        </div>
        <div
          className="relative ml-6"
          style={{ padding: "60px 80px 200px" }}
          onClick={clearSelection}
        >
          <div className="relative" style={{ width: canvasW * zoom, margin: "0 auto" }}>
            <div className="absolute -top-6 left-0 whitespace-nowrap font-mono text-[10px] text-[#333]">
              {device.charAt(0).toUpperCase() + device.slice(1)} frame - {canvasW}px
            </div>

            <div
              className="relative overflow-hidden border border-[#161616] bg-white shadow-2xl"
              style={{
                width: canvasW * zoom,
                minHeight: 720 * zoom,
              }}
            >
              {!activePage ? (
                <div className="flex h-[360px] items-center justify-center text-sm text-[#777]">
                  No page selected.
                </div>
              ) : sections.length === 0 ? (
                <div className="flex h-[360px] flex-col items-center justify-center gap-3 text-center text-sm text-[#777]">
                  <p>This page has no sections.</p>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      addSection(activePage.id, "hero");
                    }}
                    className="rounded border border-[#2a2a2a] px-3 py-1.5 text-xs text-[#ddd] transition-colors hover:border-[#444] hover:text-white"
                    type="button"
                  >
                    Add section
                  </button>
                </div>
              ) : (
                sections.map((section) => (
                  <CanvasSection key={section.id} section={section} zoom={zoom} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-4 left-1/2 z-40 -translate-x-1/2">
        <div className="pointer-events-auto flex h-9 items-center gap-1 rounded-[6px] border border-[#161616] bg-[#0A0A0A]/95 p-1 shadow-xl">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`flex h-7 w-7 items-center justify-center rounded-[5px] transition-colors duration-75 ${
              showGrid
                ? "bg-[#111] text-white"
                : "text-[#4B5563] hover:bg-[#111] hover:text-white"
            }`}
            type="button"
            title="Toggle grid"
          >
            <Icon name="grid" size={12} />
          </button>
          <button
            onClick={() => setZoom((value) => Math.max(0.1, value - 0.1))}
            className="flex h-7 w-7 items-center justify-center rounded-[5px] text-[#4B5563] transition-colors duration-75 hover:bg-[#111] hover:text-white"
            type="button"
            title="Zoom out"
          >
            <Icon name="zoomOut" size={12} />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="h-7 min-w-12 rounded-[5px] px-2 font-mono text-[10px] text-[#9CA3AF] transition-colors duration-75 hover:bg-[#111] hover:text-white"
            type="button"
            title="Reset zoom"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={() => setZoom((value) => Math.min(3, value + 0.1))}
            className="flex h-7 w-7 items-center justify-center rounded-[5px] text-[#4B5563] transition-colors duration-75 hover:bg-[#111] hover:text-white"
            type="button"
            title="Zoom in"
          >
            <Icon name="zoomIn" size={12} />
          </button>
        </div>
      </div>
    </main>
  );
}
