"use server";

import { getCurrrentUser, logOut } from "@/data/user";

export async function getCurrentUserAction() {
  return await getCurrrentUser();
}

export async function logOutAction() {
  return await logOut();
}
