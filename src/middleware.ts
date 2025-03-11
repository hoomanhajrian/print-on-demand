// app/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET;

// Define your roles and protected routes
const protectedRoutes: { [key: string]: string[] } = {
  '/admin': ['ADMIN', 'EDITOR'],
  '/main': ['PRINTER', 'CLIENT', 'ADMIN'],
  // example, adjust to your needs
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes and NextAuth API routes
  if (pathname.startsWith('/api/auth') || pathname === '/') {
    return NextResponse.next();
  }

  try {
    const token = await getToken({ req, secret });

    // Check if the route is protected
    const requiredRoles = Object.keys(protectedRoutes).find((route) =>
      pathname.startsWith(route)
    );

    if (requiredRoles) {
      if (!token) {
        console.log("Middleware: No token found for protected route.");
        return NextResponse.redirect(new URL('/', req.url));
      }

      // Check if user has the required role
      const allowedRoles = protectedRoutes[requiredRoles as keyof typeof protectedRoutes];
      if (allowedRoles && token.role && allowedRoles.includes(token.role as string)) {
        console.log("Middleware: Authorized access for route:", pathname);
        return NextResponse.next(); // User has the required role
      } else {
        console.log("Middleware: Unauthorized access for route:", pathname);
        return NextResponse.redirect(new URL('/unauthorized', req.url)); // User is unauthorized
      }
    }

    // Allow access to unprotected routes
    console.log("Middleware: Access allowed for unprotected route:", pathname);
    return NextResponse.next();

  } catch (error) {
    console.error("Middleware JWT error:", error);
    return NextResponse.redirect(new URL('/', req.url)); // Or handle differently
  }
}

export const config = {
  matcher: ['/admin/:path*', '/main/:path*'],
};