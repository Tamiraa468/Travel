import { clerkMiddleware } from "@clerk/nextjs/server";

// Run Clerk middleware only on routes that truly require auth to avoid
// unexpected 500s when env vars are missing in production or during setup.
export default clerkMiddleware();

// Limit middleware to authenticated areas only (adjust as needed)
export const config = {
  matcher: [
    "/profile(.*)", // user profile
  ],
};
