"use server";
import { sendReactivateAccount } from "@/data/auth";

export const sendReactivateAccountAction = async (email: string) => {
  return await sendReactivateAccount(email);
};
