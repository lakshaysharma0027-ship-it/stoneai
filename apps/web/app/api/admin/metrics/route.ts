import { NextResponse } from "next/server";
import { getAuthenticatedRequestContext } from "@/lib/api/auth";
import { isAdminEmail } from "@/lib/admin/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const countRows = async (table: string, applyFilter?: "active_subscriptions" | "images" | "videos" | "active_sites" | "published_sites") => {
  const supabase = createSupabaseAdminClient();
  let query = supabase.from(table).select("id", { count: "exact", head: true });

  if (applyFilter === "active_subscriptions") query = query.in("status", ["active", "trialing"]);
  if (applyFilter === "images") query = query.eq("media_type", "image");
  if (applyFilter === "videos") query = query.eq("media_type", "video");
  if (applyFilter === "active_sites") query = query.in("status", ["draft", "published"]);
  if (applyFilter === "published_sites") query = query.eq("status", "published");

  const { count, error } = await query;
  if (error) throw error;
  return count ?? 0;
};

export async function GET() {
  try {
    const { user } = await getAuthenticatedRequestContext();
    if (!user || !isAdminEmail(user.email)) {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }

    const supabase = createSupabaseAdminClient();
    const [
      users,
      subscriptions,
      imageGenerations,
      videoGenerations,
      activeSites,
      publishedSites,
      creditTransactions,
      topCustomers,
    ] = await Promise.all([
      countRows("profiles"),
      countRows("subscriptions", "active_subscriptions"),
      countRows("media_generations", "images"),
      countRows("media_generations", "videos"),
      countRows("sites", "active_sites"),
      countRows("sites", "published_sites"),
      supabase.from("credit_transactions").select("amount,type,user_id,created_at").order("created_at", { ascending: false }).limit(500),
      supabase
        .from("subscriptions")
        .select("user_id,plan,credits_remaining,monthly_credits,status,customer_id,subscription_id")
        .order("monthly_credits", { ascending: false })
        .limit(10),
    ]);

    if (creditTransactions.error) throw creditTransactions.error;
    if (topCustomers.error) throw topCustomers.error;

    const creditUsage = (creditTransactions.data ?? []).reduce(
      (total, row) => total + (row.type === "consume" ? Math.abs(row.amount) : 0),
      0,
    );

    return NextResponse.json({
      users,
      revenue: null,
      subscriptions,
      creditUsage,
      imageGenerations,
      videoGenerations,
      activeSites,
      publishedSites,
      topCustomers: topCustomers.data ?? [],
    });
  } catch (error) {
    console.error("[StoneAI admin metrics] failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not load admin metrics." },
      { status: 500 },
    );
  }
}
