import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
    console.log("Middleware running:", request.nextUrl.pathname);
    
  let response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const publicRoutes = ["/login", "/"];

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!user) {
    if (!isPublicRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return response;
  }

  if (pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("tempory_psw")
    .eq("auth_id", user.id)
    .single();

  if (profile?.tempory_psw && pathname !== "/new-password") {
    return NextResponse.redirect(new URL("/new-password", request.url));
  }

  if (!profile?.tempory_psw && pathname.startsWith("/new-password")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|logo|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
