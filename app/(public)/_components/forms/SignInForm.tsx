"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { LognIn } from "@/data/auth";
import PasswordInput from "@/components/password-input";
import { lognInAction } from "../actions";
import Link from "next/link";
import GoogleButton from "./GoogleButton";
import { z } from "zod";

const emailSchema = z.string().email();

const SignInForm = ({
  email = "",
  statusError,
}: {
  email?: string;
  statusError?: string;
}) => {
  const router = useRouter();

  const [formData, setFormData] = React.useState<LognIn>({
    email,
    password: "",
  });

  React.useEffect(() => {
    if (statusError) {
      document.cookie =
        "oauth2_error_type=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  }, [statusError]);

  const {
    data: resData,
    mutate,
    isPending,
    reset,
  } = useMutation({
    mutationFn: async () => {
      return await lognInAction(formData);
    },
    onSuccess({ success }) {
      if (success) {
        router.refresh();
      }
    },
    onSettled() {
      setFormData({
        email: "",
        password: "",
      });
    },
  });

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    reset();
    if (statusError == "USER_SIGN_IN_PASSWORD") {
      document.cookie =
        "oauth2_error_type=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.email != "" && formData.password != "") {
      mutate();
    }
  };

  return (
    <>
      {statusError == "USER_SIGN_IN_PASSWORD" ? (
        <p className="bg-yellow-100/70 text-sm text-yellow-600 p-2 mb-2 rounded-md">
          Tài khoản E-mail đã đăng ký với mật khẩu. Vui lòng đăng nhập rồi liên
          kết với tài khoản google.
        </p>
      ) : statusError == "USER_DISABLED" ? (
        <p className="bg-yellow-100/70 text-sm text-yellow-600 p-2 mb-2 rounded-md">
          Tài khoản của bạn đã vô hiệu hoá. Vui lòng{" "}
          <Link href={"/reactivate"} className="text-primary">
            kích hoạt lại
          </Link>{" "}
          trước khi đăng nhập.
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
                      ? `/recover?email=${formData.email}`
                      : "/recover"
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
              {/* {resData && !resData.success ? (
                resData.data.isDisabled ? (
                  <p className="text-destructive text-xs">
                    Tài khoản của bạn đã vô hiệu hoá. Vui lòng{" "}
                    <Link href="/reactivate" className="text-primary">
                      kích hoạt lại
                    </Link>{" "}
                    trước khi đăng nhập.
                  </p>
                ) : (
                  <p className="text-destructive text-xs">{resData.message}</p>
                )
              ) : null} */}
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
    </>
  );
};

export default SignInForm;
