import { NextRequest, NextResponse } from "next/server";
import UserAPI from "./libs/services/UserAPI";
import { User } from "./types/user";
import { ROUTES } from "./constants/routes";

// import { DEFAULT_LOGIN_REDIRECT } from "./constants/routes";
// import UserApi, { CurrentUser } from "./lib/services/user";

// function redirect(request: NextRequest, path?: string) {
//   const { nextUrl, url } = request;
//   //add Header
//   const headers = new Headers(request.headers);
//   headers.set("x-current-path", nextUrl.pathname);
//   headers.set("x-current-search-params", nextUrl.searchParams.toString());
//   headers.set(
//     "x-forwarded-for",
//     request.headers.get("x-real-ip") ||
//       request.headers.get("x-forwarded-for") ||
//       ""
//   );
//   headers.set("x-user-agent", userAgent(request).ua || "");

//   if (path) {
//     const response = NextResponse.redirect(new URL(path, request.nextUrl), {
//       headers,
//     });
//     if (path == "/login") response.cookies.delete("session");
//     return response;
//   } else {
//     const response = NextResponse.next({
//       request: {
//         headers,
//       },
//     });
//     return response;
//   }
// }

export async function middleware(request: NextRequest) {
  const { nextUrl, url } = request;

  const sid = request.cookies.get("sid");

  let user: User | null = null;
  if (sid) {
    user = await UserAPI.getCurrrentUser();
  }

  if (user) {
    if (nextUrl.pathname == "/login") {
      return NextResponse.redirect(new URL(ROUTES.accountPage, url));
    }
    if (
      nextUrl.pathname == "/account" ||
      nextUrl.pathname == "/account/settings"
    ) {
      const response = NextResponse.rewrite(
        new URL("/account/settings/profile", request.url)
      );
      return response;
    }
  } else {
    if (nextUrl.pathname.startsWith("/account")) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.set("sid", "", { maxAge: 0, path: "/" });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
