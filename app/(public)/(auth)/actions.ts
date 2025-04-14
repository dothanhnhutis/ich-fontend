"use server";
import {
  confirmEmail,
  sendReactivateAccount,
  sendRecoverAccount,
} from "@/data/auth";

export const sendReactivateAccountAction = async (email: string) => {
  return await sendReactivateAccount(email);
};

export const sendRecoverAccountAction = async (email: string) => {
  return await sendRecoverAccount(email);
};

export async function confirmEmailAction(token: string) {
  return await confirmEmail(token);
}
