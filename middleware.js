import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(["userDashboard"]);

export default async function middleware(request) {
  const response = NextResponse.next();
  
  // Set headers after creating the response
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');

  // Return the Clerk middleware with the modified response
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
