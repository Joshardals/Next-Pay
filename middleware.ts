// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Add your route protection logic here
  // You might want to check auth status and verification status
  // and redirect accordingly
}

export const config = {
  matcher: ["/verification", "/dashboard/:path*"],
};
