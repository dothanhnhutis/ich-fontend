"use server";
import { LognIn, LogInDataType } from "@/data/auth";

export const logInAction = async (input: LogInDataType) => {
  return await LognIn(input);
};
