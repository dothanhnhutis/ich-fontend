import "server-only";
import { API, APIError } from "./api";
import { getHeaders, loadCookie } from "./common";
import { DefaultResponseData } from "@/types/api";
import {
  MFAFormData,
  MFAToken,
  ResetPasswordFormData,
  SignInAPIRes,
  SignInFormData,
  SignInMFAAPIRes,
  SignUpFormData,
  TokenSession,
} from "@/types/auth";

const authInstance = API.create({
  baseUrl: "http://localhost:4000" + "/api/v1/auth",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default class AuthApi {
  //done
  static async signInMFA({
    token,
    ...input
  }: MFAFormData): Promise<SignInMFAAPIRes> {
    const { data, headers } = await authInstance.post<SignInMFAAPIRes>(
      "/signin/mfa",
      input,
      {
        headers: { ...(await getHeaders()), Authorization: token },
      }
    );
    const rawCookie = headers.get("set-cookie") ?? "";
    await loadCookie(rawCookie);

    return data;
  }
  //done
  static async signIn(input: SignInFormData): Promise<SignInAPIRes> {
    const { data, headers } = await authInstance.post<SignInAPIRes>(
      "/signin",
      input,
      {
        headers: await getHeaders(),
      }
    );

    const rawCookie = headers.get("set-cookie") ?? "";
    await loadCookie(rawCookie);

    return data;
  }
  //done
  static async signUp(input: SignUpFormData): Promise<DefaultResponseData> {
    const { data } = await authInstance.post<DefaultResponseData>(
      "/signup",
      input,
      {
        headers: await getHeaders(),
      }
    );
    return data;
  }
  //done
  static async sendRecoverAccount(email: string) {
    const { data } = await authInstance.post<DefaultResponseData>(
      "/recover",
      { email },
      {
        headers: await getHeaders(),
      }
    );
    return data;
  }
  // done
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
  // done
  static async activateAccount(token: string) {
    const { data } = await authInstance.get<DefaultResponseData>("/activate", {
      headers: { ...(await getHeaders()), Authorization: token },
    });
    return data;
  }
  // done
  static async confirmEmail(token: string) {
    const { data } = await authInstance.get<DefaultResponseData>(
      "/confirm-email",
      {
        headers: { ...(await getHeaders()), Authorization: token },
      }
    );
    return data;
  }
  // done
  static async getToken(token: string): Promise<TokenSession | null> {
    const { data } = await authInstance.get<TokenSession | null>("/token", {
      headers: { ...(await getHeaders()), Authorization: token },
    });
    return data;
  }
  // done
  static async resetPassword({
    token,
    ...input
  }: ResetPasswordFormData): Promise<DefaultResponseData> {
    const { data } = await authInstance.post<DefaultResponseData>(
      "/reset-password",
      input,
      {
        headers: { ...(await getHeaders()), Authorization: token },
      }
    );
    return data;
  }
}
