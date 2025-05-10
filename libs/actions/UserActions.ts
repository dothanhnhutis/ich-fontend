"use server";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

import UserAPI from "@/libs/services/UserAPI";
import { APIError } from "../services/api";
import { Session, UpdateEmailByOTPFormData, User } from "@/types/user";
import { DefaultResponseData } from "@/types/api";

//done
export async function getCurrentUserAction(): Promise<User | null> {
  try {
    return await UserAPI.getCurrrentUser();
  } catch (error: unknown) {
    let errMes = "unknown error";
    if (error instanceof APIError) {
      errMes = error.message;
    } else if (error instanceof Error) {
      errMes = error.message;
    }
    console.log(errMes);
    return null;
  }
}
//done
export async function logOutAction(): Promise<void> {
  try {
    return await UserAPI.logOut();
  } catch (error: unknown) {
    let errMes = "unknown error";
    if (error instanceof APIError) {
      errMes = error.message;
    } else if (error instanceof Error) {
      errMes = error.message;
    }
    console.log(errMes);
  } finally {
    revalidateTag("me");
    const cookieStore = await cookies();
    cookieStore.delete("sid");
  }
}
//done
export async function getSessionsAction(): Promise<Session[]> {
  try {
    return await UserAPI.getSessions();
  } catch (error: unknown) {
    let errMes = "unknown error";
    if (error instanceof APIError) {
      errMes = error.message;
    } else if (error instanceof Error) {
      errMes = error.message;
    }
    console.log(errMes);
    return [];
  }
}
//done
export async function deleteSessionByIdAction(sessionId: string) {
  try {
    const { message } = await UserAPI.deleteSessionById(sessionId);
    return { isSuccess: true, message };
  } catch (error: unknown) {
    let errMes = "unknown error";
    if (error instanceof APIError) {
      const { message } = error.response.data as DefaultResponseData;
      errMes = message;
    } else if (error instanceof Error) {
      errMes = error.message;
    }
    console.log(errMes);
    return {
      isSuccess: false,
      message: errMes,
    };
  }
}
// done
export async function updateEmailByOTPAction(input: UpdateEmailByOTPFormData) {
  try {
    const { message } = await UserAPI.updateEmailByOTP(input);
    return {
      isSuccess: true,
      message,
    };
  } catch (error: unknown) {
    let errMes = "unknown error";
    if (error instanceof APIError) {
      const { message } = error.response.data as DefaultResponseData;
      errMes = message;
    } else if (error instanceof Error) {
      errMes = error.message;
    }
    console.log(errMes);
    return {
      isSuccess: false,
      message: errMes,
    };
  }
}
//done
export async function sendOTPUpdateEmailAction(email: string) {
  try {
    const { message } = await UserAPI.sendOTPUpdateEmail(email);
    return {
      isSuccess: true,
      message,
    };
  } catch (error: unknown) {
    let errMes = "unknown error";
    if (error instanceof APIError) {
      const { message } = error.response.data as DefaultResponseData;
      errMes = message;
    } else if (error instanceof Error) {
      errMes = error.message;
    }
    return {
      isSuccess: false,
      message: errMes,
    };
  }
}

//done
export async function reSendVerifyEmailAction(): Promise<{
  isSuccess: boolean;
  message: string;
}> {
  try {
    const { message } = await UserAPI.reSendVerifyEmail();
    return {
      isSuccess: true,
      message,
    };
  } catch (error: unknown) {
    let errMes = "unknown error";
    if (error instanceof APIError) {
      const { message } = error.response.data as DefaultResponseData;
      errMes = message;
    } else if (error instanceof Error) {
      errMes = error.message;
    }
    return {
      isSuccess: false,
      message: errMes,
    };
  }
}

//done
export async function updateOrSendOTPUpdateEmailAction(email: string): Promise<{
  isSuccess: boolean;
  message: string;
}> {
  try {
    const { message } = await UserAPI.updateOrSendOTPUpdateEmail(email);
    return {
      isSuccess: true,
      message,
    };
  } catch (error: unknown) {
    let errMes = "unknown error";
    if (error instanceof APIError) {
      const { message } = error.response.data as DefaultResponseData;
      errMes = message;
    } else if (error instanceof Error) {
      errMes = error.message;
    }
    return {
      isSuccess: false,
      message: errMes,
    };
  }
}

//
export async function disconnectProviderAction(provider: "google"): Promise<{
  isSuccess: boolean;
  message: string;
}> {
  try {
    const { message } = await UserAPI.disconnectProvider(provider);
    return {
      isSuccess: true,
      message,
    };
  } catch (error: unknown) {
    let errMes = "unknown error";
    if (error instanceof APIError) {
      const { message } = error.response.data as DefaultResponseData;
      errMes = message;
    } else if (error instanceof Error) {
      errMes = error.message;
    }
    return {
      isSuccess: false,
      message: errMes,
    };
  }
}
