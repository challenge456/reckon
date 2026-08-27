import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    "/((?!$|about|contact|api/auth|api/cron|signin|onboarding|_next/static|_next/image|favicon.ico|manifest.json|icons).*)",
  ],
};