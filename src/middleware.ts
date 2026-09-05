import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Hanya lindungi rute yang diawali dengan /admin
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT_SECRET tidak ditemukan');
      }

      const encodedSecret = new TextEncoder().encode(secret);
      await jwtVerify(token, encodedSecret);

      // Token valid, lanjutkan ke halaman admin
      return NextResponse.next();
    } catch {
      // Token expired atau invalid, redirect ke login
      const loginUrl = new URL('/login', request.url);
      const response = NextResponse.redirect(loginUrl);
      // Clear cookie yang tidak valid
      response.cookies.delete('admin_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
