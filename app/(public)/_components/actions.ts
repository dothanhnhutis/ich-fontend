"use server";
import { lognIn, LognIn, register, Register } from "@/data/auth";

export const lognInAction = async (input: LognIn) => {
  return await lognIn(input);
};

export async function registerAction(input: Register) {
  return await register(input);
}
