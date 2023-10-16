import { NextResponse } from "next/server";
import { getSession } from "next-auth/react";
import { ExtendedSession } from "./types";

export async function middleware(req: any) {
  const session = await getSession({ req });
  const signinUrl = new URL("/not-found", req.url);

  if (!session || !session.user || !(session as ExtendedSession)?.user?.admin) {
    return NextResponse.redirect(signinUrl);
  }
  const supplied_token = req.nextUrl.searchParams.get("token");
  const valid_token = process.env.AUTH_TOKEN;

  if (supplied_token !== valid_token) {
    const signinUrl = new URL("/not-found", req.url);
    return NextResponse.redirect(signinUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/admin/:path*", "/admin/:path*"],
};
