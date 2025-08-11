import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in',
  '/sign-up',
  '/portal(.*)',
  '/images(.*)',
  '/chatbot',
  '/favicon.ico',
  '/api/webhooks(.*)',
  '/_next(.*)',
  '/static(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  console.log('Middleware running for:', req.nextUrl.pathname)
  
  // If the route is not public, protect it
  if (!isPublicRoute(req)) {
    console.log('Private route detected:', req.nextUrl.pathname)
    
    try {
      // This will throw an error if user is not authenticated
      const { userId } = await auth()
      
      if (!userId) {
        console.log('User not authenticated, redirecting...')
        // Redirect to sign-in page
        return NextResponse.redirect(new URL('/sign-in', req.url))
      }
      
      console.log('User authenticated:', userId)
    } catch (error) {
      console.log('Auth error, redirecting to sign-in')
      return NextResponse.redirect(new URL('/sign-in', req.url))
    }
  }
  
  // Allow the request to continue
  return NextResponse.next()
})

export const config = {
  // This matcher will catch ALL routes including non-existent ones
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$).*)',
  ],
}