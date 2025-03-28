"use server";

import { deleteSessionById } from "@/data/user";

export async function deleteSessionByIdAction(sessionId: string) {
  return await deleteSessionById(sessionId);
}
