"use server";
import AuthApi from "@/data/auth";

export async function activateAccountAction(token: string) {
  return await AuthApi.activateAccount(token);
}

export async function sendReactivateAccountAction() {
  return await AuthApi.sendReactivateAccount();
}

export async function sendRecoverAccountAction(email: string) {
  return await AuthApi.sendRecoverAccount(email);
}

export async function confirmEmailAction(token: string) {
  return await AuthApi.confirmEmail(token);
}

export async function getTokenAction(token: string) {
  return await AuthApi.getToken(token);
}

export async function resetPasswordAction(
  token: string,
  input: { password: string; confirmPassword: string }
) {
  return await AuthApi.resetPassword(token, input);
}
