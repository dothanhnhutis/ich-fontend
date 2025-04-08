import "server-only";
import { FetchAPI, FetchApiError } from "@/lib/axios";
import { DefaultResponseData, getHeaders } from "./common";
import { CookieOpt } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const userAPI = FetchAPI.create({
  baseUrl: "http://localhost:4000" + "/api/v1/users",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export type MFA = {
  userId: string;
  secretKey: string;
  backupCode: string[];
  count: number;
  codeExpires: string[];
  deviceName: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TOTPAuth = {
  ascii: string;
  hex: string;
  base32: string;
  oauthUrl: string;
  deviceName: string;
  qrCodeUrl: string;
  createdAt: Date;
};

type Avatar = {
  id: string;
  url: string;
  fileName: string;
  originalname: string;
  width: number | null;
  height: number | null;
};

export type Session = {
  id: string;
  userId: string;
  cookie: CookieOpt;
  ip: string;
  userAgent: {
    ua: string;
    browser: Record<string, string>;
    cpu: Record<string, string>;
    device: Record<string, string>;
    engine: Record<string, string>;
    os: Record<string, string>;
  };
  lastAccess: Date;
  createAt: Date;
};

type Role = {
  id: string;
  name: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type CurrentUser = {
  id: string;
  email: string;
  emailVerified: Date | null;
  password: string;
  username: string;
  avatar: Avatar | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  session: Session;
  roles: Role[];
  hasPassword: boolean;
};

type CurrentUserResponse = DefaultResponseData & {
  data: CurrentUser | null;
};

export async function getCurrrentUser(): Promise<CurrentUserResponse["data"]> {
  try {
    const {
      data: { data },
    } = await userAPI.get<CurrentUserResponse>("/me", {
      headers: await getHeaders(),
    });
    return data;
  } catch (error: unknown) {
    let errMes = "unknown error";
    if (error instanceof FetchApiError) {
      errMes = error.message;
    } else if (error instanceof Error) {
      errMes = error.message;
    }
    console.log(errMes);
    return null;
  }
}

export const getSessions = async () => {
  try {
    const {
      data: { data },
    } = await userAPI.get<{
      success: boolean;
      message: string;
      data: Session[];
    }>("/sessions", {
      headers: await getHeaders(),
    });
    return data;
  } catch (error: unknown) {
    let errMes = "unknown error";
    if (error instanceof FetchApiError) {
      errMes = error.message;
    } else if (error instanceof Error) {
      errMes = error.message;
    }
    console.log(errMes);
    return [];
  }
};

export const deleteSessionById = async (sessionId: string) => {
  try {
    const { data } = await userAPI.delete<{
      success: boolean;
      message: string;
      data: null;
    }>(`/sessions/${sessionId}`, {
      headers: await getHeaders(),
    });

    revalidatePath("/account/sessions");
    return data;
  } catch (error: unknown) {
    let errMes = "unknown error";
    if (error instanceof FetchApiError) {
      errMes = error.message;
    } else if (error instanceof Error) {
      errMes = error.message;
    }
    console.log(errMes);
    return {
      success: false,
      message: errMes,
      data: null,
    };
  }
};

export const setupMFA = async (deviceName: string) => {
  try {
    const { data } = await userAPI.post<{
      success: boolean;
      message: string;
      data: TOTPAuth;
    }>(
      `/setup-mfa`,
      { deviceName },
      {
        headers: await getHeaders(),
      }
    );
    return data;
  } catch (error: unknown) {
    let errMes = "unknown error";
    if (error instanceof FetchApiError) {
      errMes = error.message;
    } else if (error instanceof Error) {
      errMes = error.message;
    }
    console.log(errMes);
    return {
      success: false,
      message: errMes,
      data: null,
    };
  }
};

export const createMFA = async (codes: string[]) => {
  try {
    const { data } = await userAPI.post<{
      success: boolean;
      message: string;
      data: MFA;
    }>(
      `/mfa`,
      { codes },
      {
        headers: await getHeaders(),
      }
    );
    revalidatePath("/account/password&security");
    return data;
  } catch (error: unknown) {
    let errMes = "unknown error";
    if (error instanceof FetchApiError) {
      errMes = error.message;
    } else if (error instanceof Error) {
      errMes = error.message;
    }
    console.log(errMes);
    return {
      success: false,
      message: errMes,
      data: null,
    };
  }
};

export const getMFA = async () => {
  try {
    const {
      data: { data },
    } = await userAPI.get<{
      success: boolean;
      message: string;
      data: MFA;
    }>("/mfa", {
      headers: await getHeaders(),
    });
    return data;
  } catch (error: unknown) {
    let errMes = "unknown error";
    if (error instanceof FetchApiError) {
      errMes = error.message;
    } else if (error instanceof Error) {
      errMes = error.message;
    }
    console.log(errMes);
    return null;
  }
};

export const getSetupMFA = async () => {
  try {
    const {
      data: { data },
    } = await userAPI.get<{
      success: boolean;
      message: string;
      data: TOTPAuth;
    }>("/setup-mfa", {
      headers: await getHeaders(),
    });
    return data;
  } catch (error: unknown) {
    let errMes = "unknown error";
    if (error instanceof FetchApiError) {
      errMes = error.message;
    } else if (error instanceof Error) {
      errMes = error.message;
    }
    console.log(errMes);
    return null;
  }
};

export const deleteMFA = async (codes: string[]) => {
  try {
    const { data } = await userAPI.delete<{
      success: boolean;
      message: string;
    }>(`/mfa`, {
      body: JSON.stringify({ codes }),
      headers: await getHeaders(),
    });
    revalidatePath("/account/password&security");
    return data;
  } catch (error: unknown) {
    let errMes = "unknown error";
    if (error instanceof FetchApiError) {
      errMes = error.message;
    } else if (error instanceof Error) {
      errMes = error.message;
    }
    console.log(errMes);
    return {
      success: false,
      message: errMes,
    };
  }
};

export const disableAccount = async () => {
  try {
    const { data } = await userAPI.delete<{
      success: boolean;
      message: string;
    }>(`/deactivate`, {
      headers: await getHeaders(),
    });
    revalidatePath("/account/password&security");
    const cookieStore = await cookies();
    cookieStore.delete("sid");
    return data;
  } catch (error: unknown) {
    let errMes = "unknown error";
    if (error instanceof FetchApiError) {
      errMes = error.message;
    } else if (error instanceof Error) {
      errMes = error.message;
    }
    console.log(errMes);
    return {
      success: false,
      message: errMes,
    };
  }
};

export async function sendOTPUpdateEmail(email: string): Promise<void> {
  try {
    await userAPI.post<DefaultResponseData>(
      `/email`,
      { email },
      {
        headers: await getHeaders(),
      }
    );
  } catch (error: unknown) {
    let errMes = "unknown error";
    if (error instanceof FetchApiError) {
      errMes = error.message;
    } else if (error instanceof Error) {
      errMes = error.message;
    }
    console.log(errMes);
  }
}

export async function updateEmailByOTP(input: {
  email: string;
  otp: string;
}): Promise<DefaultResponseData> {
  try {
    const { data } = await userAPI.patch<DefaultResponseData>("/email", input, {
      headers: await getHeaders(),
    });
    return data;
  } catch (error: unknown) {
    if (error instanceof FetchApiError) {
      const data = error.response.data as DefaultResponseData;

      return data;
    }
    console.error("Unknown error", error);
    return {
      status: 400,
      success: false,
      message: "",
    };
  }
}
