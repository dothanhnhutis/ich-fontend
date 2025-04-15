"use server";

import AuthApi from "@/data/auth";
import {
  createPassword,
  sendOTPUpdateEmail,
  updateEmailByOTP,
  UpdatePassword,
  updatePassword,
} from "@/data/user";

export async function sendOTPUpdateEmailAction(email: string) {
  await sendOTPUpdateEmail(email);
}

export async function updateEmailByOTPAction(input: {
  email: string;
  otp: string;
}) {
  return await updateEmailByOTP(input);
}

export async function updatePasswordAction(input: UpdatePassword) {
  return await updatePassword(input);
}

export async function createPasswordAction(input: UpdatePassword) {
  return await createPassword(input);
}

export async function forgotPasswordAction(email: string) {
  return await AuthApi.forgotPassword(email);
}
