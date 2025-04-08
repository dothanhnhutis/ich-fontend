"use server";
import { lognIn, LognIn } from "@/data/auth";

export const lognInAction = async (input: LognIn) => {
  return await lognIn(input);
};
