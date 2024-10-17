import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(["userDashboard"]);

export default function middleware(request) {
  const response = NextResponse.next();
  
  // Add the Cross-Origin-Opener-Policy header
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  
  // Apply Clerk middleware
  return clerkMiddleware((auth, req) => {
    if (isProtectedRoute(req)) auth().protect();
  })(request, response);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
