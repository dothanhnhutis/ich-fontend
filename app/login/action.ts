"use server";

import FetchAPI from "@/lib/fetchApi";
import { string2Cookie } from "@/lib/utils";
import { cookies, headers } from "next/headers";

const authApi = FetchAPI.createInstance({
  baseUrl: "http://localhost:4000" + "/api/v1/auth",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export type LogInActionData = {
  email: string;
  password: string;
};

export const logIn = async (input: LogInActionData) => {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "Unknown";
  const ipRaw = headersList.get("x-forwarded-for") || "127.0.0.1";
  const clientIP = ipRaw.split(",")[0].trim();
  try {
    const { data, headers } = await authApi.post<{
      status: number;
      success: boolean;
      message: string;
    }>("/signin", input, {
      headers: {
        "x-forwarded-for": clientIP,
        "user-agent": userAgent,
      },
    });

    const rawCookie = headers.get("set-cookie") ?? "";

    const cookiesParse = string2Cookie(rawCookie);
    const c = await cookies();
    for (const { name, value, options } of cookiesParse) {
      c.set(name, value, options);
    }

    return data;
  } catch (error: unknown) {
    console.log(error);
    return {
      status: 400,
      success: false,
      message: "Email và mật khẩu không hợp lệ.",
    };
  }
};
