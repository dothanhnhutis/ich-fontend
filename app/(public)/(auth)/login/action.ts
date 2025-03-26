"use server";
import { logIn } from "@/data/auth";

export type LogInActionData = {
  email: string;
  password: string;
};

export const logInAction = async (input: LogInActionData) => {
  return await logIn(input);
};
