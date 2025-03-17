import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

// Define your roles and protected routes
const protectedRoutes: { [key: string]: string[] } = {
  "/admin": ["ADMIN", "EDITOR"],
  "/main": ["USER"],
  // example, adjust to your needs
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublicRoute =
    pathname.includes("/api/auth") ||
    pathname.includes(".png") ||
    pathname.includes(".svg") ||
    pathname.includes("/favicon.ico") ||
    pathname.includes("jpg") ||
    pathname.includes("_next");

  // Allow public routes and NextAuth API routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  try {
    const token = await getToken({
      req: req,
      secret: secret,
    });
    if (!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Check if the route is protected
    const requiredRoles = Object.keys(protectedRoutes).find((route) =>
      pathname.startsWith(route)
    );

    if (requiredRoles) {
      // Check if user has the required role
      const allowedRoles =
        protectedRoutes[requiredRoles as keyof typeof protectedRoutes];
      if (
        allowedRoles &&
        token.role &&
        allowedRoles.includes(token.role as string)
      ) {
        return NextResponse.next(); // User has the required role
      } else {
        return NextResponse.redirect(new URL("/", req.url)); // User is unauthorized
      }
    }

    // Allow access to unprotected routes
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/", req.url)); // Or handle differently
  }
}

export const config = {
  matcher: ["/admin/:path*", "/main/:path*"],
};
