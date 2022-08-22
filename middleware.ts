import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const session = await getToken({ req: request });

  if (!session) {
    const callbackUrl = request.nextUrl.href.replace(
      request.nextUrl.origin,
      ""
    );

    //return 401/403 response for api routes
    //there will be a handler for the api route, that will extract
    //url params and pass it along

    if (request.nextUrl.href.includes("/api")) {
      return NextResponse.rewrite("/api/error");
    }

    //redirect for unauth pages
    return NextResponse.redirect(
      new URL(`/auth/login?callbackUrl=${callbackUrl}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
