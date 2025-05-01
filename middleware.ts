import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from './utils/supabase/middleware'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // Get the current path
  const path = request.nextUrl.pathname

  // Define role-specific paths
  const ROLE_PATHS = {
    admin: '/admin',
    driver: '/driver',
    client: '/dashboard'
  } as const
  
  // Check if the path requires authentication
  if (path.startsWith('/admin') || path.startsWith('/driver') || path.startsWith('/dashboard')) {
    // Create a response object
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
    
    // Create Supabase client for middleware
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return request.cookies.get(name)?.value
          },
          set(name, value, options) {
            request.cookies.set({
              name,
              value,
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name, options) {
            request.cookies.delete({
              name,
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.delete({
              name,
              ...options,
            })
          },
        },
      }
    )

    // Get the user session
    const { data: { session } } = await supabase.auth.getSession()

    // If no session, redirect to login
    if (!session) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirect', path)
      return NextResponse.redirect(redirectUrl)
    }

    // Get user role from profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    // Get user's designated path based on role
    const userRolePath = ROLE_PATHS[profile?.role as keyof typeof ROLE_PATHS] || ROLE_PATHS.client

    // Handle role-based access control
    const currentSection = path.split('/')[1] // Get first part of path (admin, driver, or dashboard)
    const allowedPaths = {
      admin: ['/admin'],
      driver: ['/driver'],
      client: ['/dashboard']
    }

    // Check if user is trying to access an unauthorized section
    const userRole = profile?.role || 'client'
    if (!allowedPaths[userRole as keyof typeof allowedPaths].some(p => path.startsWith(p))) {
      // Redirect to user's designated section if trying to access unauthorized area
      return NextResponse.redirect(new URL(userRolePath, request.url))
    }

    // Special case: if accessing root dashboard paths, ensure users go to their specific dashboards
    if (path === '/admin' || path === '/driver' || path === '/dashboard') {
      if (path !== userRolePath) {
        return NextResponse.redirect(new URL(userRolePath, request.url))
      }
    }
    
    return response
  }
  
  // For other routes, just update the session
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}