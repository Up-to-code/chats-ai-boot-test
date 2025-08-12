import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/portal(.*)',
  '/chatbot(.*)',
  '/api/webhooks(.*)',
])

export default clerkMiddleware()

export const config = {
  matcher: [
    // Exclude static files and API routes
    '/((?!_next/image|_next/static|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    // Include all other routes
    '/',
    '/(api|trpc)(.*)'
  ],
}