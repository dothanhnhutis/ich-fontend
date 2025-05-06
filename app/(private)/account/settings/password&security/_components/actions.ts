"use server";

import AuthAPI from "@/libs/services/AuthAPI";
import UserAPI from "@/libs/services/UserAPI";
import { UpdatePassword } from "@/types/user";

export async function updatePasswordAction(input: UpdatePassword) {
  return await UserAPI.updatePassword(input);
}

export async function createPasswordAction(input: UpdatePassword) {
  return await UserAPI.createPassword(input);
}

export async function forgotPasswordAction(email: string) {
  return await AuthAPI.sendRecoverAccount(email);
}
