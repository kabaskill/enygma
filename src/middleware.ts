import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from './utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)
  
  // First get the session
  const {
    data: { session },
  } = await supabase.auth.getSession()
  
  // Then verify the user with getUser() if there's a session
  let authenticatedUser = null
  if (session) {
    const { data: { user } } = await supabase.auth.getUser()
    authenticatedUser = user
  }
  
  // If no authenticated user and trying to access protected route
  if (!authenticatedUser && request.nextUrl.pathname.startsWith('/protected')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}