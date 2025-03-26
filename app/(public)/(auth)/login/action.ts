"use server";
import { logIn, LogInDataType } from "@/data/auth";

export const logInAction = async (input: LogInDataType) => {
  return await logIn(input);
};
