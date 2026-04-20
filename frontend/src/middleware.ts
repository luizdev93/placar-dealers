import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Redireciona / → /rv na borda (Vercel); reforça o comportamento da home. */
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/rv", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
