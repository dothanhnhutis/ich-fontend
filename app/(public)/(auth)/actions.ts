"use server";
import { sendReactivateAccount, sendRecoverAccount } from "@/data/auth";

export const sendReactivateAccountAction = async (email: string) => {
  return await sendReactivateAccount(email);
};

export const sendRecoverAccountAction = async (email: string) => {
  return await sendRecoverAccount(email);
};
