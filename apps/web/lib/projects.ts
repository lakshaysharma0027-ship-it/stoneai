import { getTemplateById, type TemplateId } from "./templates";
import { getTemplateSchemaById, type TemplateSchema } from "./templateSchemas";
import { editorPersistence } from "./editor/persistence";
import { createSupabaseBrowserClient } from "./supabase/client";

const PROJECT_STORAGE_KEY = "stoneai.projects.v1";

import type { PipelineMetadata } from "./pipeline/types";

export type StoredProject = {
  id: string;
  name: string;
  templateId: TemplateId;
  websiteSchema: TemplateSchema;
  pipelineMetadata?: PipelineMetadata;
  createdAt: number;
  updatedAt: number;
};

type ProjectRow = {
  id: string;
  name: string;
  template_id: TemplateId;
  website_schema: TemplateSchema;
  pipeline_metadata?: PipelineMetadata;
  created_at: string;
  updated_at: string;
};

const isBrowser = () => typeof window !== "undefined";

const isStoredProject = (value: unknown): value is StoredProject => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.templateId === "string" &&
    getTemplateById(candidate.templateId) !== null &&
    candidate.websiteSchema !== null &&
    typeof candidate.websiteSchema === "object" &&
    !Array.isArray(candidate.websiteSchema) &&
    typeof candidate.createdAt === "number" &&
    typeof candidate.updatedAt === "number"
  );
};

const normalizeStoredProject = (value: unknown): StoredProject | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const candidate = value as Record<string, unknown>;
  const template =
    typeof candidate.templateId === "string"
      ? getTemplateById(candidate.templateId)
      : null;
  const schema =
    isStoredProject(candidate)
      ? candidate.websiteSchema
      : ((candidate.schema as TemplateSchema | undefined) ??
        getTemplateSchemaById(candidate.templateId as string | undefined));

  if (
    typeof candidate.id !== "string" ||
    typeof candidate.name !== "string" ||
    !template ||
    !schema ||
    typeof candidate.createdAt !== "number" ||
    typeof candidate.updatedAt !== "number"
  ) {
    return null;
  }

  return {
    id: candidate.id,
    name: candidate.name,
    templateId: template.id,
    websiteSchema: schema,
    createdAt: candidate.createdAt,
    updatedAt: candidate.updatedAt,
  };
};

export const projectStorage = {
  local: {
    list(): StoredProject[] {
      return projectStorage.list();
    },

    clear(): void {
      if (!isBrowser()) return;
      window.localStorage.removeItem(PROJECT_STORAGE_KEY);
    },
  },

  list(): StoredProject[] {
    if (!isBrowser()) return [];

    try {
      const parsed: unknown = JSON.parse(
        window.localStorage.getItem(PROJECT_STORAGE_KEY) ?? "[]",
      );
      if (!Array.isArray(parsed)) return [];

      return parsed
        .map(normalizeStoredProject)
        .filter((project): project is StoredProject => project !== null)
        .sort((a, b) => b.updatedAt - a.updatedAt);
    } catch {
      return [];
    }
  },

  async listRemote(): Promise<StoredProject[]> {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("projects")
      .select("id,name,template_id,website_schema,pipeline_metadata,created_at,updated_at")
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return ((data ?? []) as ProjectRow[]).map((project) => ({
      id: project.id,
      name: project.name,
      templateId: project.template_id,
      websiteSchema: project.website_schema,
      pipelineMetadata: project.pipeline_metadata,
      createdAt: new Date(project.created_at).getTime(),
      updatedAt: new Date(project.updated_at).getTime(),
    }));
  },

  get(projectId: string): StoredProject | null {
    return this.list().find((candidate) => candidate.id === projectId) ?? null;
  },

  async getRemote(projectId: string): Promise<StoredProject | null> {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("projects")
      .select("id,name,template_id,website_schema,pipeline_metadata,created_at,updated_at")
      .eq("id", projectId)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    const project = data as ProjectRow;
    return {
      id: project.id,
      name: project.name,
      templateId: project.template_id,
      websiteSchema: project.website_schema,
      pipelineMetadata: project.pipeline_metadata,
      createdAt: new Date(project.created_at).getTime(),
      updatedAt: new Date(project.updated_at).getTime(),
    };
  },

  save(project: StoredProject): void {
    if (!isBrowser()) return;

    const projects = this.list();
    const next = [
      project,
      ...projects.filter((candidate) => candidate.id !== project.id),
    ].sort((a, b) => b.updatedAt - a.updatedAt);

    window.localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(next));
  },

  async saveRemote(project: StoredProject): Promise<StoredProject> {
    const supabase = createSupabaseBrowserClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error("You must be logged in to save projects.");

    const { data, error } = await supabase
      .from("projects")
      .upsert({
        id: project.id,
        user_id: user.id,
        name: project.name,
        template_id: project.templateId,
        website_schema: project.websiteSchema,
      })
      .select("id,name,template_id,website_schema,pipeline_metadata,created_at,updated_at")
      .single();

    if (error) throw error;

    const saved = data as ProjectRow;
    return {
      id: saved.id,
      name: saved.name,
      templateId: saved.template_id,
      websiteSchema: saved.website_schema,
      createdAt: new Date(saved.created_at).getTime(),
      updatedAt: new Date(saved.updated_at).getTime(),
    };
  },

  touch(projectId: string): StoredProject | null {
    const project = this.get(projectId);
    if (!project) return null;

    const updated = { ...project, updatedAt: Date.now() };
    this.save(updated);
    return updated;
  },

  async touchRemote(projectId: string): Promise<void> {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase
      .from("projects")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", projectId);

    if (error) throw error;
  },

  async importLocalProjects(): Promise<StoredProject[]> {
    const localProjects = this.list();
    const imported: StoredProject[] = [];

    for (const project of localProjects) {
      const importedProject = await this.saveRemote(project);
      const website = editorPersistence.loadWebsite(project.id);
      if (website) await editorPersistence.saveWebsiteRemote(website);
      imported.push(importedProject);
    }

    this.local.clear();
    return imported;
  },
};
