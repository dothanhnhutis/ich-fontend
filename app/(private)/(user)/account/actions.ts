"use server";

import { createMFA, deleteSessionById, getMFA, setupMFA } from "@/data/user";

export async function deleteSessionByIdAction(sessionId: string) {
  return await deleteSessionById(sessionId);
}

export async function setupMFAAction(deviceName: string) {
  return await setupMFA(deviceName);
}

export async function createMFAAction(codes: string[]) {
  return await createMFA(codes);
}

export async function getMFAAction() {
  return await getMFA();
}
