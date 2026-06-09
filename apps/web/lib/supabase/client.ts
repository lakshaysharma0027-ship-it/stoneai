import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured =
  Boolean(supabaseUrl) && Boolean(supabasePublishableKey);

export const createSupabaseBrowserClient = () => {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  return createBrowserClient(supabaseUrl, supabasePublishableKey);
};
