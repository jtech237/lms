import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import { NextResponse } from 'next/server';
import { signOut } from '@/auth';

const { auth: middleware } = NextAuth(authConfig);
const ROUTE_ROLES: Record<string, Array<string>> = {
  '/dashboard/teacher': ['TEACHER', 'ADMIN'],
  '/dashboard/admin': ['ADMIN'],
  '/dashboard/student': ['STUDENT'],
};

export default middleware((req) => {
  const { pathname, searchParams } = req.nextUrl;
  const session = req.auth;

  if (session && pathname.startsWith('/auth')) {
    const next = decodeURIComponent(searchParams.get('next') || '');

    const newUrl = new URL(
      next || `/dashboard/${session.user.role.toLowerCase()}`,
      req.url
    );
    return NextResponse.redirect(newUrl);
  }

  if (!session && !pathname.startsWith('/auth')) {
    const newUrl = new URL(
      `/auth/login?next=${encodeURIComponent(pathname)}`,
      req.url
    );
    return NextResponse.redirect(newUrl);
  }

  if (!session && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(
      new URL(`/auth/login?next=${encodeURIComponent(pathname)}`, req.url)
    );
  }

  for (const [path, roles] of Object.entries(ROUTE_ROLES)) {
    if (pathname.startsWith(path)) {
      if (!roles.includes(String(session?.user?.role))) {
        return signOut({
          redirectTo: `/auth/login?next=${encodeURIComponent(pathname)}`,
        });
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  // runtime: 'nodejs',
};
