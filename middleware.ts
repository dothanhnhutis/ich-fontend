import {
  NextRequest,
  NextResponse,
  // userAgent
} from "next/server";

import { cookies, headers } from "next/headers";
import FetchAPI, { FetchError } from "./lib/fetchApi";
import { DEFAULT_LOGIN_REDIRECT, isAdminRegex } from "./routes";

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

const middlewareAPI = FetchAPI.createInstance({
  baseUrl: "http://localhost:4000" + "/api/v1/users",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

type Avatar = {
  id: string;
  url: string;
  fileName: string;
  originalname: string;
  width: number | null;
  height: number | null;
};

type Session = {
  id: string;
  userId: string;
};

type Role = {
  id: string;
  name: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type CurrentUser = {
  id: string;
  email: string;
  emailVerified: Date | null;
  password: string;
  username: string;
  avatar: Avatar | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  session: Session;
  roles: Role[];
};

const currrentUser = async () => {
  const allCookie = (await cookies())
    .getAll()
    .map((c) => `${c.name}=${encodeURIComponent(c.value)}`)
    .join("; ");

  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "Unknown";
  const ipRaw = headersList.get("x-forwarded-for") || "127.0.0.1";
  const clientIP = ipRaw.split(",")[0].trim();

  try {
    const {
      data: { data },
    } = await middlewareAPI.get<{
      success: boolean;
      message: string;
      data: CurrentUser;
    }>("/me", {
      headers: {
        Cookie: allCookie,
        "x-forwarded-for": clientIP,
        "user-agent": userAgent,
      },
    });
    return data;
  } catch (error: unknown) {
    let errMes = "unknown error";
    if (error instanceof FetchError) {
      errMes = error.message;
    } else if (error instanceof Error) {
      errMes = error.message;
    }
    console.log(errMes);
    return null;
  }
};

export async function middleware(request: NextRequest) {
  //   const isPrivateRoute = privateRegexRoutes.some((routes) =>
  //     routes.test(request.nextUrl.pathname)
  //   );
  //   const isAuthRoute = authRoutes.test(request.nextUrl.pathname);
  const { nextUrl, url } = request;
  const { get } = await cookies();
  const hasSession = get("sid");
  let user: CurrentUser | null = null;
  if (hasSession) {
    user = await currrentUser();
  }

  if (user) {
    const permissions: string[] = user.roles
      .map((role) => role.permissions)
      .flat(1);
    const uniquePermission: string[] = permissions.filter(
      (permission, idx, permissions) => permissions.indexOf(permission) == idx
    );
    const isAdmin = uniquePermission.some((pre) => isAdminRegex.test(pre));

    if (nextUrl.pathname.startsWith("/login")) {
      const url_redirect = isAdmin ? "/admin" : DEFAULT_LOGIN_REDIRECT;
      return NextResponse.rewrite(new URL(url_redirect, url));
    }
  } else {
    if (nextUrl.pathname.startsWith("/admin"))
      return NextResponse.rewrite(new URL("/login", url));
  }
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
