import "server-only";
import { API, APIError } from "./api";
import { getHeaders } from "./common";
import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { DefaultResponseData } from "@/types/api";

const userAPI = API.create({
  baseUrl: "http://localhost:4000" + "/api/v1/users",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default class UserApi {
  static async logOut() {
    try {
      await userAPI.delete<CurrentUserResponse>("/signout", {
        headers: await getHeaders(),
      });
    } catch (error: unknown) {
      let errMes = "unknown error";
      if (error instanceof APIError) {
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
      if (error instanceof APIError) {
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
      if (error instanceof APIError) {
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
      if (error instanceof APIError) {
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
      if (error instanceof APIError) {
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
      if (error instanceof APIError) {
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
      if (error instanceof APIError) {
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
      if (error instanceof APIError) {
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
      if (error instanceof APIError) {
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
      if (error instanceof APIError) {
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
      if (error instanceof APIError) {
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
      if (error instanceof APIError) {
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
      if (error instanceof APIError) {
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
      if (error instanceof APIError) {
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
      if (error instanceof APIError) {
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
      if (error instanceof APIError) {
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
