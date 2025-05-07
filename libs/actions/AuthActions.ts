"use server";
import { APIError } from "@/libs/services/api";
import AuthApi from "@/libs/services/AuthAPI";
import AuthAPI from "@/libs/services/AuthAPI";
import { DefaultResponseData } from "@/types/api";
import {
  MFAFormData,
  ResetPasswordFormData,
  SignInActionRes,
  SignInFormData,
  SignUpFormData,
} from "@/types/auth";
// done
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
// done
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
// done
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
// done
export async function confirmEmailAction(token: string) {
  try {
    const data = await AuthAPI.confirmEmail(token);
    return { isSuccess: true, message: data.message };
  } catch (error: unknown) {
    let errMes: string = "Xác thực tài khoản thất bại";
    if (error instanceof APIError) {
      const data = error.response.data as DefaultResponseData;
      errMes = data.message;
    } else if (error instanceof Error) {
      errMes = error.message;
    }
    return { isSuccess: false, message: errMes };
  }
}
// done
export async function getTokenAction(token: string) {
  try {
    return await AuthAPI.getToken(token);
  } catch (error: unknown) {
    console.log(error);
    return null;
  }
}
// done
export async function resetPasswordAction(input: ResetPasswordFormData) {
  try {
    const { message } = await AuthAPI.resetPassword(input);
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
// done
export async function signInAction(
  input: SignInFormData
): Promise<SignInActionRes> {
  try {
    return await AuthApi.signIn(input);
  } catch (error: unknown) {
    if (error instanceof APIError) {
      const data = error.response.data as DefaultResponseData;
      return {
        ...data,
        status: "ERROR",
        token: null,
      };
    }
    return {
      message: "Email và mật khẩu không hợp lệ.",
      status: "ERROR",
      token: null,
    };
  }
}
// done
export async function signInMFAAction(input: MFAFormData) {
  try {
    return await AuthApi.signInMFA(input);
  } catch (error: unknown) {
    if (error instanceof APIError) {
      const data = error.response.data as DefaultResponseData;
      return {
        ...data,
        status: "ERROR",
      };
    }
    return {
      message: "Mã xác thực không hợp lệ.",
      status: "ERROR",
    };
  }
}
// done
export async function signUpAction(input: SignUpFormData) {
  try {
    const { message } = await AuthApi.signUp(input);
    return {
      isSuccess: true,
      message,
    };
  } catch (error: unknown) {
    let errMes: string = "Email đã được đăng ký.";
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
