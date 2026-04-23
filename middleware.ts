// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Get the session cookie (Firebase Auth sets this if using SSR, 
  // but for client-side SDKs, we often check a local cookie)
  const session = request.cookies.get('session');
  const { pathname } = request.nextUrl;

  // 2. Define public paths that DON'T need a login (like the login page itself)
  const isPublicPath = pathname === '/login';

  // 3. If there is no session and the user is trying to access a private page
  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 4. If the user is logged in, don't let them go back to the login page
  if (session && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// 5. Specify which paths this middleware should run on

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api (API routes)
     * 2. /_next (Next.js internals like static files/images)
     * 3. /_static (Your own static files)
     * 4. All files with extensions (e.g., favicon.ico, logo.png)
     */
    '/((?!api|_next|.*\\..*).*)',
  ],
};