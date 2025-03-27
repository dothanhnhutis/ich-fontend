import "server-only";
import FetchAPI, { FetchError } from "@/lib/fetchApi";
import { getHeaders } from "./common";

const middlewareAPI = FetchAPI.createInstance({
  baseUrl: "http://localhost:4000" + "/api/v1/users",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

type Avatar = {
  id: string;
  url: string;
  fileName: string;
  originalname: string;
  width: number | null;
  height: number | null;
};

type Session = {
  id: string;
  userId: string;
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
