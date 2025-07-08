import { MiddlewareConfig, NextMiddleware, NextRequest, NextResponse } from 'next/server'

// import { auth } from '@/lib/auth'

export const config: MiddlewareConfig = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}

const AUTH_PATHS = new Set(['/signin', '/signup'])

export const middleware: NextMiddleware = (request: NextRequest) => {
  const headers = new Headers(request.headers)
  headers.set('x-pathname', request.nextUrl.pathname)
  headers.set('x-url', request.nextUrl.toString())

  const response = NextResponse.next({
    request: {
      headers,
    },
  })

  // check if the page is a signin or signup page and include the correct auth intent in cookies
  if (AUTH_PATHS.has(request.nextUrl.pathname)) {
    response.cookies.set('auth.intent', request.nextUrl.pathname.replace(/^\//, ''))
  }

  return response
}
