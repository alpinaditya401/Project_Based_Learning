// middleware.ts - Route Protection & Authentication Middleware
// Modul 6 - Next.js App Router Implementation
// Demonstrates server-side authentication and route protection

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/admin", "/settings"];

// Public routes that redirect to dashboard if logged in
const publicRoutes = ["/login", "/register", "/forgot-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for session cookie
  const session = request.cookies.get("session");
  const isAuthenticated = session?.value === "authenticated";
  
  console.log(`🔍 Request: ${pathname} | Auth: ${isAuthenticated}`);
  
  // Protected routes authentication check
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      console.log(`🚫 Redirecting to login: ${pathname}`);
      
      // Redirect to login page with redirect parameter
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      
      return NextResponse.redirect(loginUrl);
    }
    
    // Add auth headers for debugging
    const response = NextResponse.next();
    response.headers.set("X-Auth-Status", "authenticated");
    response.headers.set("X-User-Session", session?.value || "");
    
    return response;
  }
  
  // Public routes - redirect to dashboard if already authenticated
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    if (isAuthenticated && pathname === "/login") {
      console.log(`✅ Already authenticated, redirecting to dashboard`);
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }
  
  // Rate limiting for API endpoints
  if (pathname.startsWith("/api/")) {
    const apiKey = request.headers.get("x-api-key");
    
    // Basic rate limiting example
    const xRatelimitRemaining = request.headers.get("x-ratelimit-remaining");
    
    if (apiKey !== process.env.NEXT_PUBLIC_API_KEY) {
      console.log(`❌ Invalid API key for: ${pathname}`);
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      );
    }
    
    // Log rate limit info
    if (xRatelimitRemaining) {
      console.log(`⚠️ Rate limit remaining: ${xRatelimitRemaining}`);
    }
  }
  
  // CORS headers for API endpoints
  if (pathname.startsWith("/api/") && request.method === "OPTIONS") {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-API-Key",
    };
    
    return NextResponse.json({}, { headers: corsHeaders });
  }
  
  // Security headers for all requests
  const response = NextResponse.next();
  
  // Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:;"
  );
  
  // X-Frame-Options
  response.headers.set("X-Frame-Options", "DENY");
  
  // X-XSS-Protection
  response.headers.set("X-XSS-Protection", "1; mode=block");
  
  // X-Content-Type-Options
  response.headers.set("X-Content-Type-Options", "nosniff");
  
  // Referrer-Policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  
  return response;
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
