"use server";
import AuthApi, { type LognIn, type Register } from "@/lib/services/AuthAPI";
import { DefaultResponseData } from "@/lib/services/common";
import { FetchApiError } from "@/lib/services/axios";

export const lognInAction = async (
  input: LognIn
): Promise<
  DefaultResponseData & {
    token: string | null;
    status: string;
  }
> => {
  try {
    return await AuthApi.lognIn(input);
  } catch (error: unknown) {
    if (error instanceof FetchApiError) {
      const data = error.response.data as DefaultResponseData;
      return {
        ...data,
        status: "ERROR",
        token: null,
      };
    }
    return {
      message: "Email và mật khẩu không hợp lệ.",
      status: "ERROR",
      token: null,
    };
  }
};

export async function registerAction(input: Register) {
  return await AuthApi.signUp(input);
}
