"use server";
import {
  confirmEmail,
  getToken,
  resetPassword,
  sendReactivateAccount,
  sendRecoverAccount,
} from "@/data/auth";

export const sendReactivateAccountAction = async (email: string) => {
  return await sendReactivateAccount(email);
};

export async function sendRecoverAccountAction(email: string) {
  return await sendRecoverAccount(email);
}

export async function confirmEmailAction(token: string) {
  return await confirmEmail(token);
}

export async function getTokenAction(token: string) {
  return await getToken(token);
}

export async function resetPasswordAction(
  token: string,
  input: { password: string; confirmPassword: string }
) {
  return await resetPassword(token, input);
}
