import NextAuth from "next-auth";
import { NextResponse } from "next/server";

// Middleware runs on the Edge runtime. Keep it independent from auth.ts,
// which imports Prisma and bcrypt for the credentials provider.
const { auth } = NextAuth({
  providers: [],
  session: { strategy: "jwt" },
});

export default auth((req) => {
  const isLoggedIn = !!req.auth;

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }
});

export const config = {
  matcher: ["/dashboard/:path*"],
};