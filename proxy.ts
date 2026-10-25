import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  DASHBOARD_HOME_PATH,
  isReservedDashboardSegment,
} from "@/lib/dashboard-routes";
import {
  DASHBOARD_CALLBACK_HEADER,
  DASHBOARD_ROLE_COOKIE,
  DASHBOARD_ROLE_HEADER,
  parseDashboardRole,
} from "@/lib/dashboard/role-preference";

function isDashboardPath(pathname: string): boolean {
  return (
    pathname === DASHBOARD_HOME_PATH ||
    pathname.startsWith(`${DASHBOARD_HOME_PATH}/`)
  );
}

function forwardDashboardRequest(request: NextRequest): NextResponse {
  const roleCookie = parseDashboardRole(
    request.cookies.get(DASHBOARD_ROLE_COOKIE)?.value,
  );
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(DASHBOARD_CALLBACK_HEADER, request.nextUrl.pathname);
  if (roleCookie) {
    requestHeaders.set(DASHBOARD_ROLE_HEADER, roleCookie);
  }
  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  if (roleCookie) {
    response.cookies.delete(DASHBOARD_ROLE_COOKIE);
  }
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (pathname === DASHBOARD_HOME_PATH) {
    const role = searchParams.get("role");
    if (role === "creator" || role === "brand" || role === "buyer") {
      const url = request.nextUrl.clone();
      url.searchParams.delete("role");
      const response = NextResponse.redirect(url);
      response.cookies.set(DASHBOARD_ROLE_COOKIE, role, {
        path: DASHBOARD_HOME_PATH,
        maxAge: 120,
        httpOnly: true,
        sameSite: "lax",
      });
      return response;
    }
  }

  const legacy = pathname.match(/^\/dashboard\/([^/]+)(\/.*)?$/);
  if (legacy) {
    const segment = legacy[1];
    if (!isReservedDashboardSegment(segment)) {
      const rest = legacy[2] ?? "";
      const target = rest ? `${DASHBOARD_HOME_PATH}${rest}` : DASHBOARD_HOME_PATH;
      return NextResponse.redirect(new URL(target, request.url));
    }
  }

  if (isDashboardPath(pathname)) {
    return forwardDashboardRequest(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
