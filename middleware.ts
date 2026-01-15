import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { updateSession } from "@/lib/supabase/middleware";

function getSecret() {
  const authSecret = process.env.AUTH_SECRET;
  if (!authSecret) {
    throw new Error("AUTH_SECRET não está configurado");
  }
  return new TextEncoder().encode(authSecret);
}

// Routes that require admin JWT authentication
const PROTECTED_API_ROUTES = ["/api/upload"];

// Routes that require Supabase user authentication
const USER_PROTECTED_ROUTES = ["/dashboard", "/settings", "/setup/new"];

// API routes that require Supabase user authentication
const USER_PROTECTED_API_ROUTES = ["/api/user/upload"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Admin routes
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminLoginPage = pathname === "/admin/login";
  const isProtectedApiRoute = PROTECTED_API_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // User routes
  const isUserProtectedRoute = USER_PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isUserProtectedApiRoute = USER_PROTECTED_API_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // User auth routes (redirect if already logged in)
  const isUserAuthRoute =
    pathname === "/login" || pathname === "/register";

  // Update Supabase session for all requests
  const { supabaseResponse, user } = await updateSession(request);

  // Handle user protected routes - redirect to login if not authenticated
  if (isUserProtectedRoute && !user) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Handle user protected API routes - return 401 if not authenticated
  if (isUserProtectedApiRoute && !user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  // Handle auth routes - redirect to dashboard if already logged in
  if (isUserAuthRoute && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // For non-admin routes, return Supabase response (with refreshed cookies)
  if (!isAdminRoute && !isProtectedApiRoute) {
    return supabaseResponse;
  }

  // Admin login page - allow access
  if (isAdminLoginPage) {
    return supabaseResponse;
  }

  // Admin routes - check JWT token
  const token = request.cookies.get("session")?.value;

  if (!token) {
    if (isProtectedApiRoute) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    const secret = getSecret();
    await jwtVerify(token, secret);
    return supabaseResponse;
  } catch {
    if (isProtectedApiRoute) {
      return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/upload/:path*",
    "/api/user/:path*",
    "/dashboard/:path*",
    "/settings/:path*",
    "/setup/new",
    "/login",
    "/register",
    // Include all routes for Supabase session refresh
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
