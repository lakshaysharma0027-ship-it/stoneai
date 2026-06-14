"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ComponentRegistry } from "./componentRegistry";
import { useEditorStore } from "./store";
import type { Section, SectionType, WebsiteComponent } from "./types";
import { Icon } from "./ui/Icon";
import { Divider, Kbd } from "./ui/primitives";

type DragState = {
  draggingId: string | null;
  overIndex: number | null;
};

const getComponentSearchText = (component: WebsiteComponent) => {
  const parts = [component.name, component.type];
  const props = component.props;

  if ("text" in props) {
    parts.push(
      typeof props.text === "string" ? props.text : props.text.raw,
    );
  }
  if ("label" in props) parts.push(props.label);
  if ("links" in props) {
    parts.push(...props.links.flatMap((link) => [link.label, link.href]));
  }
  if ("items" in props) {
    props.items.forEach((item) => {
      Object.values(item).forEach((value) => {
        if (typeof value === "string") parts.push(value);
      });
    });
  }
  if ("tiers" in props) {
    props.tiers.forEach((tier) => {
      parts.push(tier.name, tier.description ?? "", ...tier.features);
    });
  }
  if ("fields" in props) {
    props.fields.forEach((field) => parts.push(field.label, field.type));
  }

  return parts.join(" ").toLowerCase();
};

const sectionMatchesQuery = (section: Section, query: string) => {
  if (!query) return true;
  const sectionText = `${section.name} ${section.type}`.toLowerCase();
  return (
    sectionText.includes(query) ||
    section.components.some((component) =>
      getComponentSearchText(component).includes(query),
    )
  );
};

const componentMatchesQuery = (component: WebsiteComponent, query: string) =>
  !query || getComponentSearchText(component).includes(query);

const addableTypes: SectionType[] = [
  "navbar",
  "hero",
  "features",
  "pricing",
  "testimonials",
  "faq",
  "cta",
  "contact",
  "gallery",
  "stats",
  "logos",
  "footer",
  "custom",
];

function ComponentLayerRow({ component }: { component: WebsiteComponent }) {
  const selectedComponentId = useEditorStore((state) => state.selectedComponentId);
  const selectComponent = useEditorStore((state) => state.selectComponent);
  const entry = ComponentRegistry.resolveComponent(component.type);
  const selected = selectedComponentId === component.id;

  return (
    <button
      onClick={(event) => {
        event.stopPropagation();
        selectComponent(component.id);
      }}
      className={`mx-[3px] flex w-[calc(100%-6px)] cursor-pointer items-center gap-[5px] rounded-[4px] border px-2 py-[3px] pl-[22px] text-left transition-colors duration-75 ${
        selected
          ? "border-transparent bg-[var(--bg-active)] text-[var(--text-primary)]"
          : "border-transparent text-[var(--text-ghost)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-muted)]"
      }`}
      type="button"
    >
      <Icon name={entry.icon} size={10} className="flex-shrink-0 opacity-60" />
      <span className="ml-1 flex-1 truncate text-[11px]">{component.name}</span>
    </button>
  );
}

function SectionLayerRow({
  section,
  index,
  dragging,
  query,
  onDragStart,
  onDragOver,
  onDrop,
}: {
  section: Section;
  index: number;
  dragging: DragState;
  query: string;
  onDragStart: (sectionId: string) => void;
  onDragOver: (index: number) => void;
  onDrop: () => void;
}) {
  const selectedSectionId = useEditorStore((state) => state.selectedSectionId);
  const selectSection = useEditorStore((state) => state.selectSection);
  const updateSection = useEditorStore((state) => state.updateSection);
  const duplicateSection = useEditorStore((state) => state.duplicateSection);
  const removeSection = useEditorStore((state) => state.removeSection);
  const entry = ComponentRegistry.resolve(section.type);
  const selected = selectedSectionId === section.id;
  const isDragging = dragging.draggingId === section.id;
  const isOver = dragging.overIndex === index && !isDragging;

  return (
    <>
      <div
        draggable={!section.locked}
        onDragStart={() => onDragStart(section.id)}
        onDragOver={(event) => {
          event.preventDefault();
          onDragOver(index);
        }}
        onDrop={onDrop}
        onClick={() => selectSection(section.id)}
        className={`group mx-[3px] flex cursor-pointer items-center gap-[5px] rounded-[4px] border px-2 py-[3px] pl-2.5 transition-colors duration-75 ${
          selected
            ? "border-transparent bg-[var(--bg-active)] text-[var(--text-primary)]"
            : isOver
              ? "border-[#2D6EFD]/50 bg-[var(--bg-hover)] text-[var(--text-secondary)]"
              : "border-transparent text-[var(--text-ghost)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-muted)]"
        } ${isDragging ? "opacity-40" : ""}`}
      >
        <span className="w-3 flex-shrink-0 text-[var(--text-faint)]">::</span>
        <Icon
          name={entry.icon}
          size={11}
          className="flex-shrink-0 opacity-60"
        />
        <span className="ml-1 flex-1 truncate text-[11px]">
          {section.name || entry.displayName}
        </span>
        <div className="hidden items-center gap-1 group-hover:flex">
          {section.locked && <Icon name="lock" size={10} className="text-[#555]" />}
          <button
            title={section.visibility === "visible" ? "Hide" : "Show"}
            onClick={(event) => {
              event.stopPropagation();
              updateSection(section.id, {
                visibility:
                  section.visibility === "visible" ? "hidden" : "visible",
              });
            }}
            className="opacity-0 text-[#222] hover:text-[var(--text-muted)] group-hover:opacity-100"
            type="button"
          >
            <Icon name="eye" size={10} />
          </button>
          <button
            title="Duplicate"
            onClick={(event) => {
              event.stopPropagation();
              duplicateSection(section.id);
            }}
            className="opacity-0 text-[#222] hover:text-[var(--text-muted)] group-hover:opacity-100"
            type="button"
          >
            <Icon name="component" size={10} />
          </button>
          <button
            title="Delete"
            onClick={(event) => {
              event.stopPropagation();
              removeSection(section.id);
            }}
            className="opacity-0 text-[#222] hover:text-[var(--text-muted)] group-hover:opacity-100"
            type="button"
          >
            <Icon name="close" size={10} />
          </button>
        </div>
      </div>
      {selected &&
        [...section.components]
          .sort((a, b) => a.order - b.order)
          .filter((component) => componentMatchesQuery(component, query))
          .map((component) => (
            <ComponentLayerRow key={component.id} component={component} />
          ))}
    </>
  );
}

function AddSectionMenu({ pageId }: { pageId: string }) {
  const [open, setOpen] = useState(false);
  const addSection = useEditorStore((state) => state.addSection);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((value) => !value)}
        className="flex h-[26px] w-full items-center justify-center gap-[5px] rounded-[4px] border border-transparent bg-transparent text-[11px] text-[var(--text-faint)] transition-colors duration-75 hover:text-[var(--text-muted)]"
        type="button"
      >
        <Icon name="plus" size={11} />
        Add section
      </button>
      {open && (
        <div className="absolute bottom-full left-0 right-0 z-50 mb-1 overflow-hidden rounded-[6px] border border-[#161616] bg-[#0A0A0A] shadow-2xl">
          {addableTypes.map((type) => {
            const entry = ComponentRegistry.resolve(type);

            return (
              <button
                key={type}
                onClick={() => {
                  addSection(pageId, type);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-[11px] text-[#4B5563] transition-colors duration-75 hover:bg-[#111] hover:text-white"
                type="button"
              >
                <Icon name={entry.icon} size={11} />
                {entry.displayName}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function LayersPanel() {
  const website = useEditorStore((state) => state.website);
  const activePageId = useEditorStore((state) => state.activePageId);
  const moveSection = useEditorStore((state) => state.moveSection);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const activePage =
    website?.pages.find((page) => page.id === activePageId) ?? null;
  const normalizedQuery = query.trim().toLowerCase();
  const sections = useMemo(
    () =>
      [...(activePage?.sections ?? [])]
        .sort((a, b) => a.order - b.order)
        .filter((section) => sectionMatchesQuery(section, normalizedQuery)),
    [activePage?.sections, normalizedQuery],
  );
  const [dragging, setDragging] = useState<DragState>({
    draggingId: null,
    overIndex: null,
  });

  const handleDrop = () => {
    if (dragging.draggingId && dragging.overIndex !== null) {
      moveSection(dragging.draggingId, dragging.overIndex);
    }

    setDragging({ draggingId: null, overIndex: null });
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      const tagName =
        target instanceof HTMLElement ? target.tagName.toLowerCase() : "";
      const isTyping =
        tagName === "input" || tagName === "textarea" || tagName === "select";

      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }

      if (event.key === "Escape" && document.activeElement === searchInputRef.current) {
        setQuery("");
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <aside
      className="editor-layers-panel hidden w-[200px] flex-shrink-0 flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-panel)] md:flex"
      onDragEnd={() => setDragging({ draggingId: null, overIndex: null })}
    >
      <div className="flex flex-shrink-0 items-center justify-between border-b border-[var(--border-subtle)] px-[11px] pb-[7px] pt-[9px]">
        <span className="text-[10px] font-medium uppercase tracking-[0.07em] text-[var(--text-ghost)]">
          Layers
        </span>
      </div>

      <div className="relative flex-shrink-0 border-b border-[var(--border-subtle)] px-2.5 py-[7px]">
        <div className="flex h-6 items-center gap-2 rounded-[4px] border border-[var(--border-default)] bg-[var(--bg-base)] px-[7px] focus-within:border-[var(--border-strong)]">
          <Icon name="search" size={11} className="text-[var(--text-faint)]" />
          <input
            ref={searchInputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search..."
            className="flex-1 bg-transparent text-[11px] text-[var(--text-muted)] placeholder-[var(--text-muted)]"
          />
          <Kbd>/</Kbd>
        </div>
      </div>

      <Divider />

      <div className="flex-1 overflow-y-auto py-[3px]">
        {!activePage ? (
          <div className="px-3 py-2 text-[11px] text-[var(--text-muted)]">
            No page selected.
          </div>
        ) : activePage.sections.length === 0 ? (
          <div className="px-3 py-2 text-[11px] text-[var(--text-muted)]">
            This page has no sections.
          </div>
        ) : sections.length === 0 ? (
          <div className="px-3 py-2 text-[11px] text-[var(--text-muted)]">
            No layers match {query}.
          </div>
        ) : (
          sections.map((section, index) => (
            <SectionLayerRow
              key={section.id}
              section={section}
              index={index}
              dragging={dragging}
              query={normalizedQuery}
              onDragStart={(sectionId) =>
                setDragging({ draggingId: sectionId, overIndex: index })
              }
              onDragOver={(overIndex) =>
                setDragging((state) => ({ ...state, overIndex }))
              }
              onDrop={handleDrop}
            />
          ))
        )}
      </div>

      {activePage && (
        <div className="flex items-center justify-center gap-[5px] border-t border-[var(--border-subtle)] p-2">
          <AddSectionMenu pageId={activePage.id} />
        </div>
      )}
    </aside>
  );
}
