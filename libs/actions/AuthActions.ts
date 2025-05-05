"use server";
import { APIError } from "@/libs/services/api";
import AuthAPI from "@/libs/services/AuthAPI";
import { DefaultResponseData } from "@/types/api";

//
export async function activateAccountAction(token: string) {
  try {
    const data = await AuthAPI.activateAccount(token);
    return { isSuccess: false, message: data.message };
  } catch (error: unknown) {
    let errMes: string = "Kích hoạt tài khoản thất bại";
    if (error instanceof APIError) {
      const data = error.response.data as DefaultResponseData;
      return { isSuccess: false, message: data.message };
    } else if (error instanceof Error) {
      errMes = error.message;
    }
    return { isSuccess: false, message: errMes };
  }
}

export async function sendReactivateAccountAction(token: string) {
  try {
    const data = await AuthAPI.sendReactivateAccount(token);
    return { isSuccess: true, message: data.message };
  } catch (error: unknown) {
    let errMes: string = "Gửi E-mail kích hoạt tài khoản thất bại";
    if (error instanceof APIError) {
      const data = error.response.data as DefaultResponseData;
      errMes = data.message;
    } else if (error instanceof Error) {
      errMes = error.message;
    }
    return {
      isSuccess: false,
      message: errMes,
    };
  }
}

export async function sendRecoverAccountAction(email: string) {
  try {
    const data = await AuthAPI.sendRecoverAccount(email);
    return { isSuccess: true, message: data.message };
  } catch (error: unknown) {
    let errMes: string = "Gửi E-mail đổi mật khẩu thất bại.";
    if (error instanceof APIError) {
      const data = error.response.data as DefaultResponseData;
      errMes = data.message;
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
export async function confirmEmailAction(token: string) {
  try {
    const data = await AuthAPI.confirmEmail(token);
    return { isSuccess: false, message: data.message };
  } catch (error: unknown) {
    if (error instanceof APIError) {
      const data = error.response.data as DefaultResponseData;
      return { isSuccess: false, message: data.message };
    }
    return { isSuccess: false, message: "Xác thực tài khoản thất bại" };
  }
}
//
export async function getTokenAction(token: string) {
  try {
    return await AuthAPI.getToken(token);
  } catch (error: unknown) {
    return null;
  }
}
//
export async function resetPasswordAction(
  token: string,
  input: { password: string; confirmPassword: string }
) {
  try {
    const { message } = await AuthAPI.resetPassword(token, input);
    return {
      isSuccess: true,
      message,
    };
  } catch (error: unknown) {
    if (error instanceof APIError) {
      const data = error.response.data as DefaultResponseData;
      return {
        isSuccess: false,
        message: data.message,
      };
    }
    return {
      isSuccess: false,
      message: "Cập nhật mật khẩu thất bại",
    };
  }
}

export async function signInAction(
  prevState: null | {
    message: string;
    token: string | null;
    status: string;
  },
  formData: FormData
): Promise<null | {
  message: string;
  token: string | null;
  status: string;
}> {
  const rawFormData = {
    customerId: formData.get("email"),
    amount: formData.get("password"),
  };
  console.log(rawFormData);
  return {
    message: "",
    token: "",
    status: "",
  };
}
