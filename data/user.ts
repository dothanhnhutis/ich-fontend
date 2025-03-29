import "server-only";
import FetchAPI, { FetchError } from "@/lib/fetchApi";
import { getHeaders } from "./common";
import { CookieOpt } from "@/lib/utils";

const middlewareAPI = FetchAPI.createInstance({
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
  codeExpires: string[];
  createdAt: Date;
  updatedAt: Date;
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
};

export const currrentUser = async () => {
  try {
    const {
      data: { data },
    } = await middlewareAPI.get<{
      success: boolean;
      message: string;
      data: CurrentUser;
    }>("/me", {
      headers: await getHeaders(),
    });
    return data;
  } catch (error: unknown) {
    let errMes = "unknown error";
    if (error instanceof FetchError) {
      errMes = error.message;
    } else if (error instanceof Error) {
      errMes = error.message;
    }
    console.log(errMes);
    return null;
  }
};

export const getSessions = async () => {
  try {
    const {
      data: { data },
    } = await middlewareAPI.get<{
      success: boolean;
      message: string;
      data: Session[];
    }>("/sessions", {
      headers: await getHeaders(),
    });
    return data;
  } catch (error: unknown) {
    let errMes = "unknown error";
    if (error instanceof FetchError) {
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
    const { data } = await middlewareAPI.delete<{
      success: boolean;
      message: string;
      data: null;
    }>(`/sessions/${sessionId}`, {
      headers: await getHeaders(),
    });
    return data;
  } catch (error: unknown) {
    let errMes = "unknown error";
    if (error instanceof FetchError) {
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
