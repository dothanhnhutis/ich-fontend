import {
  NextRequest,
  NextResponse,
  // userAgent
} from "next/server";

import { cookies } from "next/headers";
import { DEFAULT_LOGIN_REDIRECT } from "./routes";
import { CurrentUser, currrentUser } from "./data/user";
import { clearSid } from "./data/auth";

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
  //   const isPrivateRoute = privateRegexRoutes.some((routes) =>
  //     routes.test(request.nextUrl.pathname)
  //   );
  //   const isAuthRoute = authRoutes.test(request.nextUrl.pathname);
  const { nextUrl, url } = request;
  const cookieStore = await cookies();
  const hasSession = cookieStore.get("sid");
  let user: CurrentUser | null = null;
  if (hasSession) {
    user = await currrentUser();
    if (!user) {
      cookieStore.delete("sid");
    }
  }

  if (user) {
    if (nextUrl.pathname.startsWith("/login")) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, url));
    }
  } else {
    if (nextUrl.pathname.startsWith("/admin"))
      return NextResponse.redirect(new URL("/login", url));
  }
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
