"use client";
import React from "react";
import { Button } from "@/components/commons/button";
import { Input } from "@/components/commons/input";
import { Label } from "@/components/commons/label";
import { LoaderCircleIcon } from "lucide-react";
import PasswordInput from "@/components/password-input";
import Link from "next/link";
import GoogleButton from "./GoogleButton";
import { z } from "zod";
import { AUTH_MESSAGES } from "@/constants/systemMessages";
import { ROUTES } from "@/constants/routes";
import useSignIn from "@/libs/hooks/use-signin";

const emailSchema = z.string().email();

function MFAForm() {
  const { data, handleChangeData, signInMutation, signInMFAMutation } =
    useSignIn();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signInMFAMutation.mutate();
  };
  return (
    <div className="w-full max-w-sm">
      <div className="flex flex-col gap-1.5 py-6">
        <h1 className="font-semibold tracking-tight text-2xl">
          Xác thực đa yếu tố (MFA)
        </h1>
        <p className="text-muted-foreground text-sm">
          Tài khoản của bạn được đảm bảo bằng xác thực đa yếu tố (MFA). Để hoàn
          tất đăng nhập, hãy bật hoặc xem thiết bị MFA của bạn và nhập mã xác
          thực bên dưới.
        </p>
      </div>

      {signInMFAMutation.data && signInMFAMutation.data.status == "ERROR" ? (
        <p className="bg-red-100/70 text-sm text-red-600 p-2 mb-2 rounded-md">
          {signInMFAMutation.data.message}
        </p>
      ) : null}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <div className="grid gap-6">
            <div className="grid gap-2">
              <p>
                <span className="font-medium text-sm">E-mail</span>:{" "}
                {data.email}
              </p>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="code">Mã xác thực</Label>
                <button
                  type="button"
                  className="text-primary text-sm cursor-pointer hover:underline"
                >
                  Khắc phục sự cố MFA
                </button>
              </div>
              <Input
                id="code"
                name="code"
                placeholder="123456"
                maxLength={6}
                required
                onChange={(e) => handleChangeData({ code: e.target.value })}
                value={data.code}
                disabled={signInMFAMutation.isPending}
              />
            </div>
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={signInMFAMutation.isPending}
            >
              {signInMFAMutation.isPending && (
                <LoaderCircleIcon className="size-4 animate-spin" />
              )}
              Xác thực
            </Button>
          </div>
          <button
            type="button"
            className="text-primary justify-self-start cursor-pointer text-sm hover:underline"
            onClick={() => {
              handleChangeData({
                email: "",
                password: "",
                code: "",
              });
              signInMutation.reset();
            }}
          >
            Đăng nhập với tài khoản khác
          </button>
        </div>
      </form>
    </div>
  );
}

const SignInForm = () => {
  const { signInMutation, data, handleChangeData } = useSignIn();

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // if (status == "USER_SIGN_IN_PASSWORD") {
    //   document.cookie =
    //     "oauth2_error_type=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // }
    handleChangeData({ [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signInMutation.mutate();
  };

  return (
    <div className="w-full max-w-sm">
      <div className="flex flex-col gap-1.5 py-6">
        <h1 className="font-semibold tracking-tight text-2xl">Đăng nhập</h1>
        <p className="text-muted-foreground text-sm">Chào mừng bạn trở lại</p>
      </div>

      {/* <p className="bg-yellow-100/70 text-sm text-yellow-600 p-2 mb-2 rounded-md">
        Tài khoản E-mail đã đăng ký với mật khẩu. Vui lòng đăng nhập rồi liên
        kết với tài khoản google.
      </p>
*/}

      {signInMutation.data &&
      signInMutation.data.status == "ACTIVATE_REQUIRED" ? (
        <p className="bg-yellow-100/70 text-sm text-yellow-600 p-2 mb-2 rounded-md">
          Tài khoản của bạn đã vô hiệu hoá. Vui lòng{" "}
          <Link
            href={`/reactivate?token=${signInMutation.data.token}`}
            className="text-primary"
          >
            kích hoạt lại
          </Link>{" "}
          trước khi đăng nhập.
        </p>
      ) : null}

      {signInMutation.data && signInMutation.data.status == "ERROR" ? (
        <p className="bg-red-100/70 text-sm text-red-600 p-2 mb-2 rounded-md">
          {signInMutation.data.message}
        </p>
      ) : null}

      <form onSubmit={handleSubmit}>
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
                value={data.email}
                disabled={signInMutation.isPending}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Mật khẩu</Label>
                <Link
                  href={
                    emailSchema.safeParse(data.email).success
                      ? `${ROUTES.recover}?email=${data.email}`
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
                value={data.password}
                disabled={signInMutation.isPending}
              />
            </div>
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={signInMutation.isPending}
            >
              {signInMutation.isPending && (
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
};

const SignIn = ({
  email = "",
  statusError,
}: {
  email?: string;
  statusError?: string;
}) => {
  const { signInMutation } = useSignIn();

  if (signInMutation.data && signInMutation.data.status == "MFA_REQUIRED") {
    return <MFAForm />;
  }

  return <SignInForm />;
};

export default SignIn;
