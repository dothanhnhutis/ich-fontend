"use server";

import UserApi from "@/lib/services/user";

export async function getCurrentUserAction() {
  return await UserApi.getCurrrentUser();
}

export async function logOutAction() {
  return await UserApi.logOut();
}
