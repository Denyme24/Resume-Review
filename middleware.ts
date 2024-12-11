import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Only apply to the `api/upload` route
  if (request.nextUrl.pathname === "/api/upload") {
    return NextResponse.next(); // Let the request pass through
  }
}
