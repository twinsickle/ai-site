import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    const validUser = process.env.SITE_USERNAME || 'admin';
    const validPass = process.env.SITE_PASSWORD || 'admin123';

    if (user === validUser && pwd === validPass) {
      return NextResponse.next();
    }
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/chat (keep AI endpoint accessible if needed, or protect it too)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - icon.svg (favicon file)
     */
    '/((?!_next/static|_next/image|icon.svg).*)',
  ],
};
