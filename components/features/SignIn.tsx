"use client";
import React from "react";
import GoogleButton from "../commons/authForms/GoogleButton";
import { Label } from "../commons/label";
import { Input } from "../commons/input";
import Link from "next/link";
import PasswordInput from "../password-input";
import { Button } from "../commons/button";
import { LoaderCircleIcon } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { z } from "zod";
import { signInAction } from "@/libs/actions/AuthActions";

const emailSchema = z.string().email();

type SignInFormData = {
  email: string;
  password: string;
};

type MFAFormData = Pick<SignInFormData, "email"> & {
  code: string;
};

type SignInContextProps = {
  mfaToken: null | string;
  formData: SignInFormData & MFAFormData;
  handleFormData: (data: Partial<SignInContextProps["formData"]>) => void;
};

const SignInContext = React.createContext<SignInContextProps | null>(null);

export function useSignIn() {
  const context = React.useContext(SignInContext);
  if (!context) {
    throw new Error("useSignIn must be used within a SignInProvider.");
  }
  return context;
}

export function SignInProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [mfaToken, setMFAToken] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState<
    SignInContextProps["formData"]
  >({
    email: "",
    password: "",
    code: "",
  });

  const handleFormData = (data: Partial<SignInContextProps["formData"]>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const contextValue = React.useMemo<SignInContextProps>(
    () => ({
      mfaToken,
      formData,
      handleFormData,
    }),
    [mfaToken, formData]
  );

  return (
    <SignInContext.Provider value={contextValue}>
      {children}
    </SignInContext.Provider>
  );
}

function SignInForm() {
  const { mfaToken, formData, handleFormData } = useSignIn();

  if (mfaToken) return;

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // if (status == "USER_SIGN_IN_PASSWORD") {
    //   document.cookie =
    //     "oauth2_error_type=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // }
    handleFormData({ [e.target.name]: e.target.value });
  };

  const [state, formAction, isPending] = React.useActionState(
    signInAction,
    null
  );

  return (
    <div className="w-full max-w-sm">
      <div className="flex flex-col gap-1.5 py-6">
        <h1 className="font-semibold tracking-tight text-2xl">Đăng nhập</h1>
        <p className="text-muted-foreground text-sm">Chào mừng bạn trở lại</p>
      </div>

      <form action={formAction}>
        <div className="grid gap-6">
          <div className="flex flex-col gap-4">
            <GoogleButton />
          </div>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Hoặc tiếp tục với
            </span>
          </div>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                required
                onChange={handleOnchange}
                value={formData.email}
                disabled={isPending}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Mật khẩu</Label>
                <Link
                  href={
                    emailSchema.safeParse(formData.email).success
                      ? `${ROUTES.recover}?email=${formData.email}`
                      : ROUTES.recover
                  }
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <PasswordInput
                id="password"
                name="password"
                autoComplete="off"
                placeholder="*********"
                required
                onChange={handleOnchange}
                value={formData.password}
                disabled={isPending}
              />
            </div>
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isPending}
            >
              {isPending && (
                <LoaderCircleIcon className="size-4 animate-spin" />
              )}
              Đăng nhập
            </Button>
          </div>
          <div className="text-center text-sm">
            Không có tài khoản?{" "}
            <a href="/register" className="underline underline-offset-4">
              Đăng ký
            </a>
          </div>
        </div>
      </form>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary py-6">
        Bằng cách nhấp vào tiếp tục, bạn đồng ý với{" "}
        <Link href="#">Điều khoản dịch vụ</Link> và{" "}
        <Link href="#">Chính sách bảo mật</Link> của chúng tôi.
      </div>
    </div>
  );
}

function MFAForm() {
  const { mfaToken } = useSignIn();

  if (!mfaToken) return;

  return <div>mfaform</div>;
}

export default function SignIn() {
  return (
    <SignInProvider>
      <SignInForm />
      <MFAForm />
    </SignInProvider>
  );
}
