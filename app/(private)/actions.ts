"use server";

import { getCurrrentUser } from "@/data/user";

export async function getCurrentUserAction() {
  return await getCurrrentUser();
}
