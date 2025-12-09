import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value
    const { pathname } = request.nextUrl

    // Paths that require authentication
    const protectedPaths = ['/cart', '/checkout', '/profile']

    // Paths that are only for non-authenticated users
    const authPaths = ['/login', '/signup']

    const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
    const isAuthPath = authPaths.some(path => pathname.startsWith(path))

    // If trying to access protected route without token
    if (isProtectedPath && !token) {
        const loginUrl = new URL('/login', request.url)
        return NextResponse.redirect(loginUrl)
    }

    // If trying to access login/signup while already logged in
    if (isAuthPath && token) {
        const homeUrl = new URL('/', request.url)
        return NextResponse.redirect(homeUrl)
    }

    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/cart/:path*',
        '/checkout/:path*',
        '/profile/:path*',
        '/login',
        '/signup',
    ],
}
