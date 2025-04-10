"use server";

import {
  createMFA,
  deleteMFA,
  deleteSessionById,
  disableAccount,
  generateMFACode,
  getMFA,
  getSetupMFA,
  setupMFA,
} from "@/data/user";

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

export async function getSetupMFAAction() {
  return await getSetupMFA();
}

export async function deleteMFAAction(codes: string[]) {
  return await deleteMFA(codes);
}

export async function generateMFACodeAction() {
  return await generateMFACode();
}

export async function disableAccountAction() {
  return await disableAccount();
}
