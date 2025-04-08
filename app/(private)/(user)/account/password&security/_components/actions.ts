"use server";

import { sendOTPUpdateEmail, updateEmailByOTP } from "@/data/user";

export async function sendOTPUpdateEmailAction(email: string) {
  await sendOTPUpdateEmail(email);
}

export async function updateEmailByOTPAction(input: {
  email: string;
  otp: string;
}) {
  return await updateEmailByOTP(input);
}
