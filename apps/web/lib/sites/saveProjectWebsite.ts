import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { slimWebsiteForStorage } from "@/lib/cinematic/slimStorage";
import type { Website } from "@/lib/editor/schema";

export async function saveProjectWebsiteRecord(
  supabase: SupabaseClient,
  userId: string,
  projectId: string,
  website: Website,
) {
  const slimWebsite = slimWebsiteForStorage(website);
  const payload = {
    project_id: projectId,
    user_id: userId,
    website: slimWebsite,
  };

  const { error: userUpsertError } = await supabase
    .from("websites")
    .upsert(payload, { onConflict: "project_id" });

  if (!userUpsertError) return;

  console.warn("[StoneAI] websites upsert via user client failed, retrying with admin:", userUpsertError.message);

  const admin = createSupabaseAdminClient();
  const { error: adminUpsertError } = await admin.from("websites").upsert(payload, {
    onConflict: "project_id",
  });

  if (adminUpsertError) {
    console.error("[StoneAI] websites upsert failed", adminUpsertError);
    throw new Error(
      adminUpsertError.message.includes("too large") || adminUpsertError.message.includes("payload")
        ? "Website data is too large to save. Contact support."
        : `Could not save website: ${adminUpsertError.message}`,
    );
  }
}
