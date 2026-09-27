import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SESSION_COOKIE_NAME = 'cms_session';

const getSecretKey = () => {
  const secret = process.env.AUTH_SECRET || 'praktis-pos-cms-secret-key-2026-secure-jwt';
  return new TextEncoder().encode(secret);
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only handle /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  let isValid = false;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, getSecretKey());
      if (typeof payload.id === 'number' && typeof payload.username === 'string') {
        isValid = true;
      }
    } catch {
      isValid = false;
    }
  }

  const isLoginPage = pathname === '/admin/login';

  // If on login page and already logged in, redirect to /admin
  if (isLoginPage && isValid) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // If accessing protected admin route and not logged in, redirect to /admin/login
  if (!isLoginPage && !isValid) {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
