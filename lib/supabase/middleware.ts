import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Refreshes the Supabase auth session on every request and guards /admin.
 * Runs in proxy.ts. Fails open on any Supabase error (e.g. env vars not
 * configured yet) so a misconfigured Supabase project degrades to "public
 * site works, /admin requires login" instead of a hard 500 on every route.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/admin/login";
  // Safari doesn't expose `navigator.connection` at all, so the hero video's
  // client-side data-saver check can never see iOS Low Data Mode — but Safari
  // (and Chrome) DO send a `Save-Data` request header when it's on. Relay it
  // into a cookie the client can read, since reading the header directly on
  // the page would force it out of static rendering.
  const saveData = request.headers.get("save-data") === "on";

  let user = null;

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: CookieToSet[]) {
            for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
            response = NextResponse.next({ request });
            for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options);
          },
        },
      },
    );

    const {
      data: { user: sessionUser },
    } = await supabase.auth.getUser();
    user = sessionUser;
  } catch (err) {
    console.warn("[proxy] Supabase unavailable, failing open:", err instanceof Error ? err.message : err);
  }

  if (isAdminRoute && !isLoginRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isLoginRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (saveData) {
    response.cookies.set("save-data", "1", { path: "/", maxAge: 60 * 60 * 24, sameSite: "lax" });
  }

  return response;
}
