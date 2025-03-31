"use server";

import { createMFA, deleteSessionById, setupMFA } from "@/data/user";

export async function deleteSessionByIdAction(sessionId: string) {
  return await deleteSessionById(sessionId);
}

export async function setupMFAAction(deviceName: string) {
  return await setupMFA(deviceName);
}

export async function createMFAAction(codes: string[]) {
  return await createMFA(codes);
}
