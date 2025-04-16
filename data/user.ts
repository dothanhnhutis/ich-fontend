import "server-only";
import { FetchAPI, FetchApiError } from "@/lib/axios";
import { DefaultResponseData, getHeaders } from "./common";
import { CookieOpt } from "@/lib/utils";
import { revalidatePath, revalidateTag } from "next/cache";
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
  deviceName: string;
  secretKey: string;
  backupCode: string[];
  count: number;
  expiredBackupCodes: string[];
  backupCodeCreatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type Account = {
  id: string;
  provider: string;
  providerId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TOTP = {
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
type SetupMFA = DefaultResponseData & { data: TOTP | null };
type MFAResponseData = DefaultResponseData & { data: MFA | null };
export type UpdatePassword = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  isSignOut: boolean;
};
export default class UserApi {
  static async logOut() {
    try {
      await userAPI.delete<CurrentUserResponse>("/signout", {
        headers: await getHeaders(),
      });
    } catch (error: unknown) {
      let errMes = "unknown error";
      if (error instanceof FetchApiError) {
        errMes = error.message;
      } else if (error instanceof Error) {
        errMes = error.message;
      }
    } finally {
      revalidateTag("me");
      const cookieStore = await cookies();
      cookieStore.delete("sid");
    }
  }

  static async getCurrrentUser(): Promise<CurrentUserResponse["data"]> {
    try {
      const {
        data: { data },
      } = await userAPI.get<CurrentUserResponse>("/me", {
        headers: await getHeaders(),
        next: {
          tags: ["me"],
        },
      });
      return data;
    } catch (error: unknown) {
      let errMes = "unknown error";
      if (error instanceof FetchApiError) {
        errMes = error.message;
      } else if (error instanceof Error) {
        errMes = error.message;
      }
      return null;
    }
  }

  static async getSessions() {
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
  }

  static async deleteSessionById(
    sessionId: string
  ): Promise<DefaultResponseData> {
    try {
      const { data } = await userAPI.delete<DefaultResponseData>(
        `/sessions/${sessionId}`,
        {
          headers: await getHeaders(),
        }
      );

      revalidatePath("/account/sessions");
      return data;
    } catch (error: unknown) {
      let errMes = "unknown error";
      if (error instanceof FetchApiError) {
        return error.response.data as DefaultResponseData;
      } else if (error instanceof Error) {
        errMes = error.message;
      }
      console.log(errMes);
      return {
        status: 400,
        success: false,
        message: errMes,
      };
    }
  }

  static async setupMFA(deviceName: string): Promise<SetupMFA> {
    try {
      const { data } = await userAPI.post<{
        status: number;
        success: boolean;
        message: string;
        data: TOTP;
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
        status: 400,
        success: false,
        message: errMes,
        data: null,
      };
    }
  }

  static async getSetupMFA(): Promise<SetupMFA["data"]> {
    try {
      const {
        data: { data },
      } = await userAPI.get<SetupMFA>("/setup-mfa", {
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

  static async createMFA(codes: string[]): Promise<MFAResponseData> {
    try {
      const { data } = await userAPI.post<MFAResponseData>(
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
        status: 400,
        success: false,
        message: errMes,
        data: null,
      };
    }
  }

  static async getMFA(): Promise<MFAResponseData["data"]> {
    try {
      const {
        data: { data },
      } = await userAPI.get<MFAResponseData>("/mfa", {
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

  static async generateMFACode(): Promise<MFAResponseData> {
    try {
      const { data } = await userAPI.put<MFAResponseData>(`/mfa`, undefined, {
        headers: await getHeaders(),
      });
      revalidatePath("/account/password&security");
      return data;
    } catch (error: unknown) {
      let errMes = "unknown error";
      if (error instanceof FetchApiError) {
        return error.response.data as MFAResponseData;
      } else if (error instanceof Error) {
        errMes = error.message;
      }
      console.log(errMes);
      return {
        status: 400,
        success: false,
        message: errMes,
        data: null,
      };
    }
  }

  static async deleteMFA(codes: string[]): Promise<DefaultResponseData> {
    try {
      const { data } = await userAPI.delete<DefaultResponseData>(`/mfa`, {
        data: { codes },
        headers: await getHeaders(),
      });
      return data;
    } catch (error: unknown) {
      let errMes = "unknown error";
      if (error instanceof FetchApiError) {
        return error.response.data as DefaultResponseData;
      } else if (error instanceof Error) {
        errMes = error.message;
      }
      return {
        status: 400,
        success: false,
        message: errMes,
      };
    }
  }

  static async disableAccount() {
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
  }

  static async sendOTPUpdateEmail(email: string): Promise<void> {
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

  static async updateEmailByOTP(input: {
    email: string;
    otp: string;
  }): Promise<DefaultResponseData> {
    try {
      const { data } = await userAPI.patch<DefaultResponseData>(
        "/email",
        input,
        {
          headers: await getHeaders(),
        }
      );
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

  static async updatePassword(input: UpdatePassword) {
    try {
      const { data } = await userAPI.patch<DefaultResponseData>(
        "/password",
        input,
        {
          headers: await getHeaders(),
        }
      );
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

  static async createPassword(input: UpdatePassword) {
    try {
      const { data } = await userAPI.post<DefaultResponseData>(
        "/password",
        {
          password: input.newPassword,
          confirmPassword: input.confirmNewPassword,
        },
        {
          headers: await getHeaders(),
        }
      );
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

  static async getLinked(): Promise<Account[]> {
    try {
      const { data } = await userAPI.get<
        DefaultResponseData & { data: Account[] }
      >("/links", {
        headers: await getHeaders(),
      });
      return data.data;
    } catch (error: unknown) {
      if (error instanceof FetchApiError) {
        const data = error.response.data as DefaultResponseData & {
          data: Account[];
        };
        return data.data;
      }
      console.error("Unknown error", error);
      return [];
    }
  }
}
