"use server";
import { APIError } from "@/libs/services/api";
import AuthAPI from "@/libs/services/AuthAPI";
import { DefaultResponseData } from "@/types/api";

export async function activateAccountAction(token: string) {
  return await AuthAPI.activateAccount(token);
}

export async function sendReactivateAccountAction(token: string) {
  try {
    const data = await AuthAPI.sendReactivateAccount(token);
    return { isSuccess: true, message: data.message };
  } catch (error: unknown) {
    let errMes: string = "Kích hoạt tài khoản thất bại";
    if (error instanceof APIError) {
      const data = error.response.data as DefaultResponseData;
      errMes = data.message;
    } else if (error instanceof Error) {
      errMes = error.message;
    }
    console.error("Unknown error", error);
    return {
      isSuccess: false,
      message: errMes,
    };
  }
}

export async function sendRecoverAccountAction(email: string) {
  return await AuthAPI.sendRecoverAccount(email);
}

export async function confirmEmailAction(token: string) {
  return await AuthAPI.confirmEmail(token);
}

export async function getTokenAction(token: string) {
  return await AuthAPI.getToken(token);
}

export async function resetPasswordAction(
  token: string,
  input: { password: string; confirmPassword: string }
) {
  return await AuthAPI.resetPassword(token, input);
}
