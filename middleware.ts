import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(function middleware(req) {
  const isProduction = process.env.NODE_ENV === "production";
  const url = isProduction
    ? "https://www.deadendbooks.org/not-found"
    : "http://localhost:3000/not-found";

  const token = req.nextauth.token;
  console.log("Middleware - Token:", token);
  const isAdminRoute = req.url.includes("/admin");

  if (isAdminRoute && (!token || token?.admin !== true)) {
    const notFoundUrl = url;
    return NextResponse.redirect(notFoundUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
