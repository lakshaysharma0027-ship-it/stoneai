import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import {
  isStoneAIAppHost,
  normalizeRequestHost,
  resolveHostnameToSlug,
} from "@/lib/domains/hostname";

const protectedRoutes = ["/", "/dashboard", "/templates", "/projects", "/editor"];
const authRoutes = [
  "/login",
  "/signup",
  "/forgot-password",
];

const isRouteMatch = (pathname: string, routes: string[]) =>
  routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  let response = NextResponse.next({ request });

  if (!supabaseUrl || !supabasePublishableKey) return response;

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;
  const hostname = normalizeRequestHost(request.headers.get("host"));

  if (!pathname.startsWith("/api") && !pathname.startsWith("/sites")) {
    const slug = await resolveHostnameToSlug(supabase, hostname);
    if (slug) {
      const url = request.nextUrl.clone();
      url.pathname = `/sites/${slug}`;
      return NextResponse.rewrite(url);
    }
  }

  if (!user && isStoneAIAppHost(hostname) && isRouteMatch(pathname, protectedRoutes)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (user && isRouteMatch(pathname, authRoutes)) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}
