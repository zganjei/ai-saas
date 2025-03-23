import { auth, clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NEXT_ROUTER_SEGMENT_PREFETCH_HEADER } from "next/dist/client/components/app-router-headers";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-up(.*)",
  "/subscribe(.*)",
]);

const isSignupRoute = createRouteMatcher([
  "/sign-up(.*)",
]);


export default clerkMiddleware(async(auth,req)=>{
  const userAuth = await auth()
  const {userId} = userAuth;
  const {pathname, origin}  = req.nextUrl
  console.log("middleware info: ", userId,pathname, origin);

  if(!isPublicRoute(req) && !userId){
    return NextResponse.redirect(new URL("/sign-up",origin))
  }

  if(isSignupRoute(req) && userId){
    return NextResponse.redirect(new URL("/mealplan",origin));
  }

  return NextResponse.next()
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};