import "server-only";
import { FetchAPI, FetchApiError } from "@/lib/axios";
import { DefaultResponseData, getHeaders, loadCookie } from "./common";
import { string2Cookie } from "@/lib/utils";
import { cookies } from "next/headers";

const authInstance = FetchAPI.create({
  baseUrl: "http://localhost:4000" + "/api/v1/auth",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export type LognIn = {
  email: string;
  password: string;
};

type LognInResponse = DefaultResponseData & {
  data: {
    isBanned: boolean;
    isDisabled: boolean;
  };
};

export const lognIn = async (input: LognIn): Promise<LognInResponse> => {
  try {
    const { data, headers } = await authInstance.post<LognInResponse>(
      "/signin",
      input,
      {
        headers: await getHeaders(),
      }
    );

    const rawCookie = headers.get("set-cookie") ?? "";
    await loadCookie(rawCookie);

    return data;
  } catch (error: unknown) {
    if (error instanceof FetchApiError) {
      const data = error.response.data as LognInResponse;
      if (data.data.isDisabled) {
        const cookieStore = await cookies();
        cookieStore.set({
          name: "reActiveAccount",
          value: input.email,
          httpOnly: true,
          path: "/reactivate",
          maxAge: 5 * 60,
        });
      }
      return data;
    }
    console.error("Unknown error", error);
    return {
      status: 400,
      success: false,
      message: "Email và mật khẩu không hợp lệ.",
      data: {
        isBanned: false,
        isDisabled: false,
      },
    };
  }
};

export type Register = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export async function register(input: Register): Promise<DefaultResponseData> {
  try {
    const { data, headers } = await authInstance.post<DefaultResponseData>(
      "/signup",
      input,
      {
        headers: await getHeaders(),
      }
    );
    const rawCookie = headers.get("set-cookie") ?? "";
    await loadCookie(rawCookie);

    return data;
  } catch (error: unknown) {
    if (error instanceof FetchApiError) {
      const data = error.response.data as DefaultResponseData;
      return data;
    }
    console.error("Unknown error", error);
    return {
      status: 400,
      success: false,
      message: "Email này đã đăng ký.",
    };
  }
}

export async function sendRecoverAccount(email: string) {
  try {
    const { data, headers } = await authInstance.post<DefaultResponseData>(
      "/recover",
      { email },
      {
        headers: await getHeaders(),
      }
    );
    const rawCookie = headers.get("set-cookie") ?? "";
    await loadCookie(rawCookie);

    return data;
  } catch (error: unknown) {
    if (error instanceof FetchApiError) {
      const data = error.response.data as DefaultResponseData;
      data.message = "Email đổi mật khẩu đã được gửi.";
      return data;
    }
    console.error("Unknown error", error);
    return {
      status: 400,
      success: false,
      message: "Email đổi mật khẩu đã được gửi.",
    };
  }
}

export const sendReactivateAccount = async (
  email: string
): Promise<DefaultResponseData> => {
  try {
    const { data } = await authInstance.post<DefaultResponseData>(
      "/reactivate",
      { email },
      {
        headers: await getHeaders(),
      }
    );

    const cookieStore = await cookies();
    cookieStore.set({
      name: "reActiveAccount",
      value: "",
      httpOnly: true,
      path: "/reactivate",
      maxAge: 0,
    });

    return data;
  } catch (error: unknown) {
    if (error instanceof FetchApiError) {
      const data = error.response.data as DefaultResponseData;
      return data;
    }
    console.error("Unknown error", error);
    return {
      status: 400,
      success: false,
      message: "",
    };
  }
};

export async function forgotPassword(
  email: string
): Promise<DefaultResponseData> {
  try {
    const { data } = await authInstance.post<DefaultResponseData>(
      "/recover",
      { email },
      {
        headers: await getHeaders(),
      }
    );
    return data;
  } catch (error: unknown) {
    if (error instanceof FetchApiError) {
      const data = error.response.data as DefaultResponseData;
      return data;
    }
    console.error("Unknown error", error);
    return {
      status: 400,
      success: false,
      message: "",
    };
  }
}
