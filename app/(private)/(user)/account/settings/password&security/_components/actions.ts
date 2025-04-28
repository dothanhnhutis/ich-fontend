"use server";

import AuthAPI from "@/libs/services/AuthAPI";
import UserAPI from "@/libs/services/UserAPI";
import { UpdatePassword } from "@/types/user";

export async function sendOTPUpdateEmailAction(email: string) {
  await UserAPI.sendOTPUpdateEmail(email);
}

export async function updateEmailByOTPAction(input: {
  email: string;
  otp: string;
}) {
  return await UserAPI.updateEmailByOTP(input);
}

export async function updatePasswordAction(input: UpdatePassword) {
  return await UserAPI.updatePassword(input);
}

export async function createPasswordAction(input: UpdatePassword) {
  return await UserAPI.createPassword(input);
}

export async function forgotPasswordAction(email: string) {
  return await AuthAPI.forgotPassword(email);
}
