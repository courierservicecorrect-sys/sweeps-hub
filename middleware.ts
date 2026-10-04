import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 1. Export the main middleware function
export function middleware(request: NextRequest) {
  // Your routing / auth / rewrite logic here
  return NextResponse.next();
}

// 2. Export the config object at the bottom of the file
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public files (images, icons, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
