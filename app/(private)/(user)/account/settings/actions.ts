"use server";
import UserApi from "@/lib/services/user";

export async function deleteSessionByIdAction(sessionId: string) {
  return await UserApi.deleteSessionById(sessionId);
}

export async function setupMFAAction(deviceName: string) {
  return await UserApi.setupMFA(deviceName);
}

export async function createMFAAction(codes: string[]) {
  return await UserApi.createMFA(codes);
}

export async function getMFAAction() {
  return await UserApi.getMFA();
}

export async function getSetupMFAAction() {
  return await UserApi.getSetupMFA();
}

export async function deleteMFAAction(codes: string[]) {
  return await UserApi.deleteMFA(codes);
}

export async function generateMFACodeAction() {
  return await UserApi.generateMFACode();
}

export async function disableAccountAction() {
  return await UserApi.disableAccount();
}
