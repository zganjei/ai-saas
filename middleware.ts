import { auth, clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NEXT_ROUTER_SEGMENT_PREFETCH_HEADER } from "next/dist/client/components/app-router-headers";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-up(.*)",
  "/subscribe(.*)",
  "/api/webhook(.*)",
]);

const isSignupRoute = createRouteMatcher([
  "/sign-up(.*)",
]);


export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  // **Bypass authentication for Stripe webhooks**
  console.log("pathname:",pathname)
  if (pathname.startsWith("/api/webhook")) {
    console.log("222 reached clerkmiddleware")
    console.log("Skipping authentication for webhook");
    return NextResponse.next();
  }

  const userAuth = await auth();
  const { userId } = userAuth;

  // specific to codespaces
  const isLocalhost = req.nextUrl.origin.includes("localhost");
  const origin = isLocalhost
    ? process.env.NEXT_PUBLIC_API_URL // Use the Codespaces URL
    : req.nextUrl.origin; // Otherwise, use the request's origin

  console.log("Middleware info: ", userId, pathname, origin);

  if (!isPublicRoute(req) && !userId) {
    return NextResponse.redirect(new URL("/sign-up", origin));
  }

  if (isSignupRoute(req) && userId) {
    return NextResponse.redirect(new URL("/mealplan", origin));
  }

  return NextResponse.next();
});


export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};