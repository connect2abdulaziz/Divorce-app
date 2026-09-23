import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookieToSet = { name: string; value: string; options: CookieOptions };

// Paths that don't require a signed-in user.
const PUBLIC_PATHS = ["/", "/login", "/signup", "/auth", "/error"];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

// Refreshes the Supabase auth session cookie on every request so it never
// silently expires mid-questionnaire, and gates access to everything except
// the public auth paths above. Called from the root middleware.ts.
function hasAuthCookie(request: NextRequest) {
  return request.cookies.getAll().some(({ name }) => name.startsWith("sb-") && name.includes("-auth-token"));
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const { pathname } = request.nextUrl;

  // The marketing page never reads the session, so skip the auth round trip.
  if (pathname === "/") return supabaseResponse;

  // No session cookie means no user and nothing to refresh — avoid the network call.
  if (!hasAuthCookie(request)) {
    if (isPublicPath(pathname)) return supabaseResponse;
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const env = getSupabaseEnv();

  // Missing or unreachable auth config — keep public pages working and
  // send protected routes to login instead of throwing AuthRetryableFetchError.
  if (!env) {
    if (!isPublicPath(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("error", "Auth is not configured. Check NEXT_PUBLIC_SUPABASE_URL.");
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  let user: { id: string } | null = null;
  try {
    // IMPORTANT: this call must not be removed — it's what actually refreshes
    // the token. Do not add logic between createServerClient and this call.
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      // Network / DNS / paused project — treat as signed out.
      console.warn("[supabase] getUser failed:", error.message);
    } else {
      user = data.user;
    }
  } catch (err) {
    console.warn("[supabase] getUser threw:", err instanceof Error ? err.message : err);
  }

  if (!user && !isPublicPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && (pathname === "/login" || pathname === "/signup")) {
    try {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      const role = (profile as { role?: string } | null)?.role;
      const url = request.nextUrl.clone();
      url.pathname = role === "staff" || role === "admin" ? "/admin" : "/dashboard";
      return NextResponse.redirect(url);
    } catch {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
