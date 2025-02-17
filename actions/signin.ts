"use server";

import FetchAPI, { FetchError } from "@/lib/fetchApi";
import { string2Cookie } from "@/lib/utils";
import { cookies } from "next/headers";

const authApi = FetchAPI.createInstance({
  baseUrl: "http://localhost:4000" + "/api/v1/users",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export async function signInAction(
  prevState: { message: string | null },
  formData: FormData
): Promise<{
  message: string | null;
}> {
  prevState.message = null;
  const rawFormData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    const { data, headers } = await authApi.post<{
      status: number;
      success: boolean;
      message: string;
    }>("/signin", rawFormData);

    const cookiesParser = string2Cookie(headers.get("set-cookie") || "");
    for (const { name, value, options } of cookiesParser) {
      (await cookies()).set(name, value, options);
    }
    return {
      message: data.message,
    };
  } catch (error: unknown) {
    if (error instanceof FetchError) {
      return {
        message: error.message,
      };
    }
    console.log("Error", error);
  }

  return { message: "Email và mật khẩu không hợp lệ." };
}
