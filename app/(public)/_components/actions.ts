"use server";
import AuthApi, { type LognIn, type Register } from "@/data/auth";

export const lognInAction = async (input: LognIn) => {
  return await AuthApi.lognIn(input);
};

export async function registerAction(input: Register) {
  return await AuthApi.signUp(input);
}
