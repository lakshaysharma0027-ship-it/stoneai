"use client";

import { useEffect } from "react";
import { getTemplateById } from "@/lib/templates";
import { projectStorage } from "@/lib/projects";
import { editorPersistence } from "@/lib/editor/persistence";
import Toolbar from "./Toolbar";
import LayersPanel from "./LayersPanel";
import Canvas from "./Canvas";
import InspectorPanel from "./InspectorPanel";
import AIAssistantPanel from "./AIAssistantPanel";
import { useEditorStore } from "./store";
import { Icon } from "./ui/Icon";
import "./editor.css";

type EditorShellProps = {
  projectId: string;
};

export default function EditorShell({ projectId }: EditorShellProps) {
  const initializeProject = useEditorStore((state) => state.initializeProject);
  const editorMode = useEditorStore((state) => state.editorMode);
  const activePageId = useEditorStore((state) => state.activePageId);
  const selectedSectionId = useEditorStore((state) => state.selectedSectionId);
  const aiOpen = useEditorStore((state) => state.aiOpen);
  const showGrid = useEditorStore((state) => state.showGrid);
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);
  const clearSelection = useEditorStore((state) => state.clearSelection);
  const setAiOpen = useEditorStore((state) => state.setAiOpen);
  const setEditorMode = useEditorStore((state) => state.setEditorMode);
  const setShowGrid = useEditorStore((state) => state.setShowGrid);
  const addSection = useEditorStore((state) => state.addSection);
  const duplicateSection = useEditorStore((state) => state.duplicateSection);
  const removeSection = useEditorStore((state) => state.removeSection);

  useEffect(() => {
    let active = true;

    const loadProject = async () => {
      const project = await projectStorage
        .getRemote(projectId)
        .catch(() => projectStorage.get(projectId));
      const website = await editorPersistence
        .loadWebsiteRemote(projectId)
        .catch(() => null);
      if (!active) return;

      const template = getTemplateById(project?.templateId);
      const websiteSchema = project?.websiteSchema ?? null;

      initializeProject(projectId, {
        title: project?.name ?? "Untitled Project",
        description: template?.description ?? "",
        templateId: template?.id,
      }, websiteSchema, website);
    };

    void loadProject();
    return () => {
      active = false;
    };
  }, [initializeProject, projectId]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.ctrlKey || event.key.toLowerCase() !== "z") return;

      event.preventDefault();
      if (event.shiftKey) {
        redo();
      } else {
        undo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [redo, undo]);

  return (
    <div
      className="flex h-screen w-screen flex-col overflow-hidden bg-[var(--bg-base)] text-[var(--text-primary)]"
      style={{ fontFamily: "-apple-system, 'SF Pro Text', sans-serif" }}
    >
      <Toolbar />

      <div className="relative flex flex-1 overflow-hidden">
        {editorMode !== "preview" && (
          <aside className="flex w-11 flex-shrink-0 flex-col items-center gap-px border-r border-[var(--border-subtle)] bg-[var(--bg-base)] py-2">
            <RailButton
              icon="cursor"
              title="Select (V)"
              active
              onClick={clearSelection}
            />
            <RailButton
              icon="plus"
              title="Add hero section"
              disabled={!activePageId}
              onClick={() => {
                if (activePageId) addSection(activePageId, "hero");
              }}
            />
            <RailButton
              icon="component"
              title="Duplicate selected section"
              disabled={!selectedSectionId}
              onClick={() => {
                if (selectedSectionId) duplicateSection(selectedSectionId);
              }}
            />
            <RailButton
              icon="close"
              title="Delete selected section"
              disabled={!selectedSectionId}
              onClick={() => {
                if (selectedSectionId) removeSection(selectedSectionId);
              }}
            />
            <div className="my-[3px] h-px w-3.5 bg-[var(--border-default)]" />
            <RailButton icon="undo" title="Undo (Ctrl+Z)" onClick={undo} />
            <RailButton icon="redo" title="Redo (Ctrl+Shift+Z)" onClick={redo} />
            <RailButton
              icon="eye"
              title="Preview"
              onClick={() => setEditorMode("preview")}
            />
            <div className="flex-1" />
            <RailButton
              icon="sparkle"
              title="Ask StoneAI"
              active={aiOpen}
              onClick={() => setAiOpen(!aiOpen)}
            />
            <RailButton
              icon="grid"
              title="Toggle canvas grid"
              active={showGrid}
              onClick={() => setShowGrid(!showGrid)}
            />
          </aside>
        )}
        {editorMode !== "preview" && <LayersPanel />}
        <Canvas />
        {editorMode !== "preview" && <InspectorPanel />}
        {editorMode !== "preview" && <AIAssistantPanel />}
      </div>
    </div>
  );
}

function RailButton({
  icon,
  title,
  active,
  disabled,
  onClick,
}: {
  icon: string;
  title: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-7 w-7 items-center justify-center rounded-[5px] border transition-colors duration-75 disabled:cursor-not-allowed disabled:opacity-25 ${
        active
          ? "border-[var(--border-strong)] bg-[var(--bg-active)] text-[var(--text-secondary)]"
          : "border-transparent text-[var(--text-ghost)] hover:bg-[#080808] hover:text-[var(--text-muted)]"
      }`}
      type="button"
    >
      <Icon name={icon} size={14} />
    </button>
  );
}
