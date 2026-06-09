import { createSupabaseServerClient } from "@/lib/supabase/server";

export const getAuthenticatedRequestContext = async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error && error.message !== "Auth session missing!") throw error;

  return {
    supabase,
    user,
  };
};
