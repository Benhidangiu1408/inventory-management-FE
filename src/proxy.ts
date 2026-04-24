import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("jwt")?.value;
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/login";
  // Permission route
  /**
   * ==========================================
   * 🔍 QUICK REGEX CHEAT SHEET (Routing Edition)
   * ==========================================
   * * Regular Expressions (Regex) are used to match text patterns.
   * In this middleware, we use them to match URL pathnames.
   * * --- THE BOUNDARIES ---
   * ^   : Start of the string. Ensures the match starts exactly at the beginning.
   * $   : End of the string. Ensures nothing extra comes after the match.
   * Example: /^apple$/ matches "apple", but not "applesauce".
   * * --- THE SLASHES ---
   * \/  : A literal forward slash. Because regex is wrapped in / /, we
   * have to "escape" real URL slashes with a backslash.
   * * --- THE WILDCARDS & QUANTIFIERS ---
   * \d  : Any digit (0-9).
   * +   : One or more of the previous item.
   * Example: \d+ matches "5" or "1024".
   * ?   : Zero or one of the previous item (makes it optional).
   * Example: \/? makes the trailing slash optional.
   * .   : Any single character.
   * * : Zero or more of the previous item.
   * Example: .* means "literally anything, or nothing at all".
   * * --- GROUPING ---
   * ()  : Groups multiple tokens together.
   * Example: (\/.*)? means "an optional group consisting of a slash
   * followed by anything".
   * * --- EXAMPLES IN ACTION ---
   * /^\/users\/?$/             -> Matches /users OR /users/
   * /^\/users\/\d+$/           -> Matches /users/42 (Requires an ID)
   * /^\/dashboard(\/.*)?$/     -> Matches /dashboard AND /dashboard/settings
   */
  const PERMISSION_RULES = [
    // --- Catalog ---
    { pattern: /^\/catalog\/category(\/.*)?$/, permission: "MANAGE_CATEGORY" }, // Starts with (catch-all for category)
    { pattern: /^\/catalog\/unit(\/.*)?$/, permission: "MANAGE_UNIT" },
    {
      pattern: /^\/catalog\/variant-attributes(\/.*)?$/,
      permission: "MANAGE_ATTR",
    },
    // --- Catalog: Products ---
    { pattern: /^\/catalog\/product\/new\/?$/, permission: "EDIT_PRODUCT" }, // Exact match: /catalog/product/new
    { pattern: /^\/catalog\/product(\/.*)?$/, permission: "VIEW_PRODUCT" },

    // --- Admin ---
    { pattern: /^\/admin\/role-management(\/.*)?$/, permission: "MANAGE_ROLE" },
    {
      pattern: /^\/admin\/user-management\/new\/?$/,
      permission: "CREATE_USER",
    },
    {
      pattern: /^\/admin\/user-management(\/.*)?$/,
      permission: "VIEW_OTHER_USER",
    },
    // --- Warehouse ---
    {
      pattern: /^\/warehouse-management\/inventory-check\/new\/?$/,
      permission: "SCHEDULE_STOCKTAKING",
    },
    {
      pattern: /^\/warehouse-management\/warehouse\/new\/?$/,
      permission: "EDIT_WAREHOUSE",
    },
    {
      pattern: /^\/warehouse-management\/warehouse(\/.*)?$/,
      permission: "VIEW_WAREHOUSE",
    },
    // --- Inbound / Outbound / Faults ---
    { pattern: /^\/import\/new\/?$/, permission: "STOCK_IN" },
    { pattern: /^\/export\/new\/?$/, permission: "STOCK_OUT" },
    {
      pattern: /^\/fault-order\/details\/\d+\/process-order\/\d+\/?$/,
      permission: "ANALYSIS_VIEW",
    },
    {
      pattern: /^\/fault-order\/details\/\d+\/assign-task\/\d+\/?$/,
      permission: "TASK_VIEW",
    },
    { pattern: /^\/fault-order(\/.*)?$/, permission: "VIEW_FAULT_LIST" },
  ];
  // If the user has NO token, and they are NOT on the login page -> send to login
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // If the user HAS a token, and they try to go to the login page -> send to dashboard
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Permissions check
  const matchedRule = PERMISSION_RULES.find((rule) =>
    rule.pattern.test(pathname),
  );

  if (matchedRule) {
    const permissionsString = request.cookies.get("permissions")?.value || "";
    const permissions = permissionsString.split(",");

    if (!permissions.includes(matchedRule.permission)) {
      return NextResponse.rewrite(new URL("/forbidden", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|logo).*)"],
};
