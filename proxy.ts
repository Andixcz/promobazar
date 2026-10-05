import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  DASHBOARD_HOME_PATH,
  isReservedDashboardSegment,
} from "@/lib/dashboard-routes";

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (pathname === DASHBOARD_HOME_PATH) {
    const role = searchParams.get("role");
    if (role === "creator" || role === "brand" || role === "buyer") {
      const url = request.nextUrl.clone();
      url.searchParams.delete("role");
      const response = NextResponse.redirect(url);
      response.cookies.set("pb_dashboard_role", role, {
        path: DASHBOARD_HOME_PATH,
        maxAge: 120,
        httpOnly: true,
        sameSite: "lax",
      });
      return response;
    }
    return NextResponse.next();
  }

  const legacy = pathname.match(/^\/dashboard\/([^/]+)(\/.*)?$/);
  if (!legacy) return NextResponse.next();

  const segment = legacy[1];
  if (isReservedDashboardSegment(segment)) {
    return NextResponse.next();
  }

  const rest = legacy[2] ?? "";
  const target = rest ? `${DASHBOARD_HOME_PATH}${rest}` : DASHBOARD_HOME_PATH;
  return NextResponse.redirect(new URL(target, request.url));
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
