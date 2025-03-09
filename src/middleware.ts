import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
  const jwt = request.cookies.get('next-auth.session-token')?.value || request.cookies.get('__Secure-next-auth.session-token')?.value

  if (!jwt) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    await jwtVerify(jwt, secret);
    return NextResponse.next();
  } catch (error) {
    console.error({ error })
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: ['/admin', '/main'],
};