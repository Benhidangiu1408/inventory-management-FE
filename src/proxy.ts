import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("jwt")?.value;
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/login";
  // Permission route
  const PERMISSION_MAP: Record<string, string> = {
    "/catalog/category": "MANAGE_CATEGORY",
    "/catalog/unit": "MANAGE_UNIT",
    "/catalog/variant-attributes": "MANAGE_ATTR",
    "/catalog/product/new": "EDIT_PRODUCT",
    "/catalog/product": "VIEW_PRODUCT",
    "/admin/role-management": "MANAGE_ROLE",
    "/admin/user-management/new": "CREATE_USER",
    "/admin/user-management": "VIEW_OTHER_USER",
    "/other-profile": "VIEW_OTHER_USER",
    "/warehouse-management/warehouse/new": "EDIT_WAREHOUSE",
    "/warehouse-management/warehouse": "VIEW_WAREHOUSE",
  };
  // If the user has NO token, and they are NOT on the login page -> send to login
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // If the user HAS a token, and they try to go to the login page -> send to dashboard
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Permissions check
  const protectedRouteKey = Object.keys(PERMISSION_MAP).find((route) =>
    pathname.startsWith(route),
  );
  // If the route is protected, verify permissions
  if (protectedRouteKey) {
    // Lazy Evaluation: Only parse the cookie string IF we hit a protected route
    const permissionsString = request.cookies.get("permissions")?.value || "";
    const permissions = permissionsString.split(",");
    const requiredPermission = PERMISSION_MAP[protectedRouteKey];

    if (!permissions.includes(requiredPermission)) {
      return NextResponse.rewrite(new URL("/forbidden", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|logo).*)"],
};
