"use server";

import AuthApi from "@/lib/services/AuthAPI";
import UserApi, { UpdatePassword } from "@/lib/services/user";

export async function sendOTPUpdateEmailAction(email: string) {
  await UserApi.sendOTPUpdateEmail(email);
}

export async function updateEmailByOTPAction(input: {
  email: string;
  otp: string;
}) {
  return await UserApi.updateEmailByOTP(input);
}

export async function updatePasswordAction(input: UpdatePassword) {
  return await UserApi.updatePassword(input);
}

export async function createPasswordAction(input: UpdatePassword) {
  return await UserApi.createPassword(input);
}

export async function forgotPasswordAction(email: string) {
  return await AuthApi.forgotPassword(email);
}
