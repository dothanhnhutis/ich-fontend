"use server";

import { AUTH_MESSAGES } from "@/constants/systemMessages";
import { APIError } from "@/libs/services/api";
import AuthApi from "@/libs/services/AuthAPI";
import { DefaultResponseData } from "@/types/api";
import { SignIn, SignUp } from "@/types/auth";

export async function signInAction(input: SignIn): Promise<
  DefaultResponseData & {
    token: string | null;
    status: string;
  }
> {
  try {
    return await AuthApi.signIn(input);
  } catch (error: unknown) {
    if (error instanceof APIError) {
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
}

export async function signUpAction(input: SignUp) {
  try {
    const data = await AuthApi.signUp(input);
    return {
      isSuccess: true,
      message: data.message,
    };
  } catch (error: unknown) {
    if (error instanceof APIError) {
      const data = error.response.data as DefaultResponseData;
      return {
        isSuccess: false,
        message: data.message,
      };
    }
    return {
      isSuccess: false,
      message: AUTH_MESSAGES.EMAIL_ALREADY_REGISTERED,
    };
  }
}
