import { NextResponse, type NextRequest } from "next/server";
import { LOGIN_ERROR_CODES, oauthErrorCode } from "@/lib/auth/loginErrors";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";
  const oauthError = requestUrl.searchParams.get("error");

  if (oauthError) {
    const errorCode = oauthErrorCode(oauthError);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorCode)}`, request.url),
    );
  }

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(LOGIN_ERROR_CODES.sessionFailed)}`, request.url),
      );
    }
  }

  return NextResponse.redirect(new URL(next, request.url));
}
