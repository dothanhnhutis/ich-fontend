import "server-only";
import { FetchAPI, FetchApiError } from "@/lib/axios";
import { getHeaders } from "./common";
import { string2Cookie } from "@/lib/utils";
import { cookies } from "next/headers";

// const authApi = FetchAPI.create({
//   baseUrl: "http://localhost:4000" + "/api/v1/auth",
//   credentials: "include",
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });

// export const logIn = async (input: LogInDataType) => {
//   try {
//     const { data, headers } = await authApi.post<
//       null,
//       { isBanned: boolean; isDisabled: boolean }
//     >("/signin", input, {
//       headers: await getHeaders(),
//     });

//     const rawCookie = headers.get("set-cookie") ?? "";
//     const cookiesParse = string2Cookie(rawCookie);
//     const c = await cookies();
//     for (const { name, value, options } of cookiesParse) {
//       c.set(name, value, options);
//     }

//     return data;
//   } catch (error: unknown) {
//     if (error instanceof FetchError) {
//       console.log(error.serialize());
//       const cookieStore = await cookies();
//       cookieStore.set("reActiveAccount", input.email, {
//         // domain: "/"
//       });

//       return error.serialize();
//     }
//     return {
//       status: 400,
//       success: false,
//       message: "Email và mật khẩu không hợp lệ.",
//     };
//   }
// };

const authInstance = FetchAPI.create({
  baseUrl: "http://localhost:4000" + "/api/v1/auth",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export type LogInDataType = {
  email: string;
  password: string;
};

type LognInResponse = {
  status: number;
  success: true;
  message: string;
};
type LognInError = {
  status: number;
  success: false;
  message: string;
  data: {
    isBanned: boolean;
    isDisabled: boolean;
  };
};
export const LognIn = async (input: LogInDataType) => {
  try {
    const { data, headers } = await authInstance.post<LognInResponse>(
      "/signin",
      input,
      {
        headers: await getHeaders(),
      }
    );

    const rawCookie = headers.get("set-cookie") ?? "";
    const cookiesParse = string2Cookie(rawCookie);
    const c = await cookies();
    for (const { name, value, options } of cookiesParse) {
      c.set(name, value, options);
    }
    return data;
  } catch (error: unknown) {
    if (error instanceof FetchApiError) {
      const data = error.response.data as LognInError;
      return data;
    }
    console.error("Unknown error", error);
    return {
      status: 400,
      success: false,
      message: "Email và mật khẩu không hợp lệ.",
    };
  }
};
