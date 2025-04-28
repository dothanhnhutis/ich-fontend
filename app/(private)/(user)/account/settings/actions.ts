"use server";
import UserAPI from "@/libs/services/UserAPI";

export async function deleteSessionByIdAction(sessionId: string) {
  return await UserAPI.deleteSessionById(sessionId);
}

export async function setupMFAAction(deviceName: string) {
  return await UserAPI.setupMFA(deviceName);
}

export async function createMFAAction(codes: string[]) {
  return await UserAPI.createMFA(codes);
}

export async function getMFAAction() {
  return await UserAPI.getMFA();
}

export async function getSetupMFAAction() {
  return await UserAPI.getSetupMFA();
}

export async function deleteMFAAction(codes: string[]) {
  return await UserAPI.deleteMFA(codes);
}

export async function generateMFACodeAction() {
  return await UserAPI.generateMFACode();
}

export async function disableAccountAction() {
  return await UserAPI.disableAccount();
}
