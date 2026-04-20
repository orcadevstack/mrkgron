import { NextRequest, NextResponse } from "next/server";

const protectedPrefixes = [
  "/dashboard",
  "/analytics",
  "/automation",
  "/communications",
  "/commerce",
  "/crm",
  "/identity",
  "/insights",
  "/integrations",
  "/journeys",
  "/logistics",
  "/merchandising",
  "/messaging",
  "/segments",
  "/settings",
  "/storefront",
  "/tenants",
  "/tracking",
];

const authRoutes = ["/login", "/register"];

function matchesProtectedRoute(pathname: string) {
  return protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;
  const isAuthenticated = Boolean(accessToken);

  if (!isAuthenticated && matchesProtectedRoute(pathname)) {
    const loginUrl = new URL("/login", request.url);
    const redirectTarget = `${pathname}${search}`;

    if (redirectTarget !== "/login") {
      loginUrl.searchParams.set("next", redirectTarget);
    }

    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/dashboard/:path*",
    "/analytics/:path*",
    "/automation/:path*",
    "/communications/:path*",
    "/commerce/:path*",
    "/crm/:path*",
    "/identity/:path*",
    "/insights/:path*",
    "/integrations/:path*",
    "/journeys/:path*",
    "/logistics/:path*",
    "/merchandising/:path*",
    "/messaging/:path*",
    "/segments/:path*",
    "/settings/:path*",
    "/storefront/:path*",
    "/tenants/:path*",
    "/tracking/:path*",
  ],
};