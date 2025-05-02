"use server";

import UserAPI from "@/libs/services/UserAPI";

export async function getCurrentUserAction() {
  return await UserAPI.getCurrrentUser();
}

export async function logOutAction() {
  return await UserAPI.logOut();
}
