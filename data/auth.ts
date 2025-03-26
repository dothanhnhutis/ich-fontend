import "server-only";
import FetchAPI from "@/lib/fetchApi";
import { getHeaders } from "./common";
import { string2Cookie } from "@/lib/utils";
import { cookies } from "next/headers";

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
  try {
    const { data, headers } = await authApi.post<{
      status: number;
      success: boolean;
      message: string;
    }>("/signin", input, {
      headers: await getHeaders(),
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
