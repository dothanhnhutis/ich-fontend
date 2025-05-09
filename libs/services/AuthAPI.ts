import "server-only";
import { API, APIError } from "./api";
import { getHeaders, loadCookie } from "./common";
import { DefaultResponseData } from "@/types/api";
import { SignIn, SignUp, TokenData } from "@/types/auth";

const authInstance = API.create({
  baseUrl: "http://localhost:4000" + "/api/v1/auth",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default class AuthApi {
  static async signInMFA(
    token: string,
    input: { email: string; code: string }
  ) {
    const { data, headers } = await authInstance.post<{
      status: string;
      message: string;
    }>("/signin/mfa", input, {
      headers: { ...(await getHeaders()), Authorization: token },
    });

    const rawCookie = headers.get("set-cookie") ?? "";
    await loadCookie(rawCookie);

    return data;
  }

  static async signIn(input: SignIn) {
    const { data, headers } = await authInstance.post<{
      token: string;
      status: string;
      message: string;
    }>("/signin", input, {
      headers: await getHeaders(),
    });

    const rawCookie = headers.get("set-cookie") ?? "";
    await loadCookie(rawCookie);

    return data;
  }

  static async signUp(input: SignUp): Promise<DefaultResponseData> {
    const { data } = await authInstance.post<DefaultResponseData>(
      "/signup",
      input,
      {
        headers: await getHeaders(),
      }
    );
    return data;
  }

  static async sendRecoverAccount(email: string) {
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
      if (error instanceof APIError) {
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

  static async sendReactivateAccount(
    token: string
  ): Promise<DefaultResponseData> {
    const { data } = await authInstance.get<DefaultResponseData>(
      "/reactivate",
      {
        headers: { ...(await getHeaders()), Authorization: token },
      }
    );

    return data;
  }

  static async activateAccount(token: string) {
    try {
      const { data } = await authInstance.get<DefaultResponseData>(
        "/activate",
        {
          headers: { ...(await getHeaders()), Authorization: token },
        }
      );
      return data;
    } catch (error: unknown) {
      if (error instanceof APIError) {
        const data = error.response.data as DefaultResponseData;
        return data;
      }
      console.error("Unknown error", error);
      return {
        status: 400,
        success: false,
        message: "Kích hoạt tài khoản thất bại",
      };
    }
  }

  static async forgotPassword(email: string): Promise<DefaultResponseData> {
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
      if (error instanceof APIError) {
        const data = error.response.data as DefaultResponseData;
        return data;
      }
      console.error("Unknown error", error);
      return {
        message: "",
      };
    }
  }

  static async confirmEmail(token: string) {
    try {
      const { data } = await authInstance.get<DefaultResponseData>(
        "/confirm-email",
        {
          headers: { ...(await getHeaders()), Authorization: token },
        }
      );
      return data;
    } catch (error: unknown) {
      if (error instanceof APIError) {
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

  static async getToken(token: string): Promise<TokenData | null> {
    try {
      const { data } = await authInstance.get<
        DefaultResponseData & { data: TokenData }
      >("/token", {
        headers: { ...(await getHeaders()), Authorization: token },
      });
      return data.data;
    } catch (error: unknown) {
      if (error instanceof APIError) {
        const data = error.response.data as DefaultResponseData & {
          data: TokenData;
        };
        return data.data;
      }
      console.error("Unknown error", error);
      return null;
    }
  }

  static async resetPassword(
    token: string,
    input: { password: string; confirmPassword: string }
  ): Promise<DefaultResponseData> {
    try {
      const { data } = await authInstance.post<DefaultResponseData>(
        "/reset-password",
        input,
        {
          headers: { ...(await getHeaders()), Authorization: token },
        }
      );
      return data;
    } catch (error: unknown) {
      if (error instanceof APIError) {
        const data = error.response.data as DefaultResponseData;
        return data;
      }
      console.error("Unknown error", error);
      return {
        message: "Cập nhật mật khẩu thất bại",
      };
    }
  }
}
