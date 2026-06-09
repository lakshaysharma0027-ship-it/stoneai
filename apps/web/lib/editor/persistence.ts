import { WEBSITE_SCHEMA_VERSION, type Website } from "./schema";
import { createSupabaseBrowserClient } from "../supabase/client";

const STORAGE_NAMESPACE = "stoneai.editor.website";

export type PersistedWebsiteEnvelope = {
  schemaVersion: typeof WEBSITE_SCHEMA_VERSION;
  savedAt: string;
  website: Website;
};

export type EditorPersistence = {
  getStorageKey: (projectId: string) => string;
  loadWebsite: (projectId: string) => Website | null;
  saveWebsite: (website: Website) => void;
  loadWebsiteRemote: (projectId: string) => Promise<Website | null>;
  saveWebsiteRemote: (website: Website) => Promise<void>;
  clearWebsite: (projectId: string) => void;
};

const isBrowser = () => typeof window !== "undefined";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isPersistedEnvelope = (
  value: unknown,
): value is PersistedWebsiteEnvelope => {
  if (!isRecord(value)) return false;

  const website = value.website;
  return (
    value.schemaVersion === WEBSITE_SCHEMA_VERSION &&
    typeof value.savedAt === "string" &&
    isRecord(website) &&
    website.schemaVersion === WEBSITE_SCHEMA_VERSION &&
    typeof website.id === "string" &&
    typeof website.projectId === "string" &&
    Array.isArray(website.pages)
  );
};

export const createLocalStorageEditorPersistence = (): EditorPersistence => ({
  getStorageKey: (projectId) =>
    `${STORAGE_NAMESPACE}.v${WEBSITE_SCHEMA_VERSION}.${projectId}`,

  loadWebsite: (projectId) => {
    if (!isBrowser()) return null;

    const raw = window.localStorage.getItem(
      `${STORAGE_NAMESPACE}.v${WEBSITE_SCHEMA_VERSION}.${projectId}`,
    );
    if (!raw) return null;

    try {
      const parsed: unknown = JSON.parse(raw);
      if (!isPersistedEnvelope(parsed)) return null;
      return parsed.website;
    } catch {
      return null;
    }
  },

  saveWebsite: (website) => {
    if (!isBrowser()) return;

    const envelope: PersistedWebsiteEnvelope = {
      schemaVersion: WEBSITE_SCHEMA_VERSION,
      savedAt: new Date().toISOString(),
      website,
    };

    window.localStorage.setItem(
      `${STORAGE_NAMESPACE}.v${WEBSITE_SCHEMA_VERSION}.${website.projectId}`,
      JSON.stringify(envelope),
    );
  },

  loadWebsiteRemote: async (projectId) => {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("websites")
      .select("website")
      .eq("project_id", projectId)
      .maybeSingle();

    if (error) throw error;

    const envelope = {
      schemaVersion: WEBSITE_SCHEMA_VERSION,
      savedAt: new Date().toISOString(),
      website: (data as { website?: unknown } | null)?.website,
    };
    if (!isPersistedEnvelope(envelope)) {
      return null;
    }

    return envelope.website;
  },

  saveWebsiteRemote: async (website) => {
    const supabase = createSupabaseBrowserClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error("You must be logged in to save websites.");

    const { error } = await supabase.from("websites").upsert(
      {
        project_id: website.projectId,
        user_id: user.id,
        website,
      },
      {
        onConflict: "project_id",
      },
    );

    if (error) throw error;
  },

  clearWebsite: (projectId) => {
    if (!isBrowser()) return;

    window.localStorage.removeItem(
      `${STORAGE_NAMESPACE}.v${WEBSITE_SCHEMA_VERSION}.${projectId}`,
    );
  },
});

export const editorPersistence = createLocalStorageEditorPersistence();
