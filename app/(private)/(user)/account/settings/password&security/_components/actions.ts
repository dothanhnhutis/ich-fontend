"use server";

import AuthApi from "@/data/auth";
import UserApi, { UpdatePassword } from "@/data/user";

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
