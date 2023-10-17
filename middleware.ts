import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(function middleware(req) {
  const token = req.nextauth.token;
  const isAdminRoute = req.url.includes("/admin");
  console.log(token);

  if (isAdminRoute && (!token || token?.admin !== true)) {
    const notFoundUrl = "http://localhost:3000/not-found";
    return NextResponse.redirect(notFoundUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
