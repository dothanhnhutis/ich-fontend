"use client";
import React from "react";
import Link from "next/link";
import * as z from "zod";
import { toast } from "sonner";
import { CheckIcon, LoaderCircleIcon } from "lucide-react";

import cn from "@/utils/cn";
import GoogleButton from "../commons/GoogleButton";
import PasswordInput from "@/components/password-input";
import { Button } from "@/components/commons/button";
import { Input } from "@/components/commons/input";
import { Label } from "@/components/commons/label";
import { signUpAction } from "@/libs/actions/AuthActions";

const passwordSchema = z
  .string({
    required_error: "Mật khẩu mới là bắt buộc",
    invalid_type_error: "Mật khẩu mới phải là chuỗi",
  })
  .min(8, "Mật khẩu mới quá ngắn (min: 8)")
  .max(60, "Mật khẩu mới quá dài (max: 60)")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/,
    "Mật khẩu mới phải có ký tự hoa, thường, sô và ký tự đặc biệt"
  );

const SignUp = () => {
  const [hiddenPassword, setHiddenPassword] = React.useState<boolean>(true);
  const [emailExists, setEmailExists] = React.useState<boolean>(false);

  const [formData, setFormData] = React.useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [focusAt, setFocusAt] = React.useState<string>("");

  const handleOnFocus = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    setFocusAt(e.target.name);
  };

  const handleOnBlur = () => {
    setFocusAt("");
  };

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name == "email") setEmailExists(false);
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isPasswordSchemaErrors = React.useMemo(() => {
    const { success, error } = passwordSchema.safeParse(formData.password);
    if (success) return [];
    return error.issues;
  }, [formData.password]);

  const isPasswordError = React.useMemo(() => {
    return (
      formData.password.length > 0 &&
      focusAt != "password" &&
      isPasswordSchemaErrors.length > 0
    );
  }, [formData, focusAt]);

  const isConfirmNewPassword = React.useMemo(() => {
    return (
      formData.password.length > 0 &&
      formData.confirmPassword.length > 0 &&
      focusAt != "confirmPassword" &&
      focusAt != "password" &&
      formData.password != formData.confirmPassword
    );
  }, [formData, focusAt]);

  const [isPending, startTransition] = React.useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      const { isSuccess, message } = await signUpAction(formData);
      if (isSuccess) {
        toast.success(message);
        setFormData({
          email: "",
          username: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        setEmailExists(true);
        setFormData((prev) => ({
          ...prev,
          username: "",
          password: "",
          confirmPassword: "",
        }));
      }
    });
  };

  return (
    <div className="w-full max-w-sm">
      <div className="flex flex-col gap-1.5 py-6">
        <h1 className="font-semibold tracking-tight text-2xl">Đăng ký</h1>
        <p className="text-muted-foreground text-sm">Chào mừng bạn trở lại</p>
      </div>
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
              <Label htmlFor="username">Tên</Label>
              <Input
                value={formData.username}
                onChange={handleOnchange}
                id="username"
                type="text"
                name="username"
                placeholder="Nguyen Van A"
                required
                onBlur={handleOnBlur}
                onFocus={handleOnFocus}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleOnchange}
                placeholder="m@example.com"
                required
                onBlur={handleOnBlur}
                onFocus={handleOnFocus}
                className={
                  emailExists
                    ? "border-red-500 bg-red-50 outline-red-50 ring-red-50"
                    : ""
                }
              />
              {emailExists && (
                <p className={"font-bold text-xs text-destructive"}>
                  Email này đã đăng ký.{" "}
                  <Link
                    className="text-primary text-xs"
                    href={`/login${
                      formData.email == "" ? "" : "?email=" + formData.email
                    }`}
                  >
                    Đăng nhập
                  </Link>
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Mật khẩu</Label>
              </div>
              <PasswordInput
                id="password"
                name="password"
                autoComplete="off"
                placeholder="*********"
                value={formData.password}
                onChange={handleOnchange}
                required
                isPassword={hiddenPassword}
                onTypeChange={setHiddenPassword}
                onBlur={handleOnBlur}
                onFocus={handleOnFocus}
                isError={isPasswordError}
              />
              <div className="flex flex-col gap-y-1 text-xs">
                <p className="font-normal text-muted-foreground">
                  Mật khẩu phải bao gồm:
                </p>
                <p
                  className={cn(
                    "inline-flex gap-x-2 items-center text-gray-500",
                    isPasswordSchemaErrors.filter(
                      (err) => err.code == "too_small" || err.code == "too_big"
                    ).length > 0
                      ? ""
                      : "text-green-400"
                  )}
                >
                  <CheckIcon size={16} />
                  <span>8 đến 60 ký tự.</span>
                </p>
                <p
                  className={cn(
                    "inline-flex gap-x-2 items-center text-gray-500",
                    isPasswordSchemaErrors.filter(
                      (err) =>
                        err.code == "invalid_string" &&
                        err.validation == "regex"
                    ).length > 0
                      ? ""
                      : "text-green-400"
                  )}
                >
                  <CheckIcon size={16} />
                  <span>Chữ cái, số và ký tự đặc biệt @$!%*?&</span>
                </p>
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              </div>
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                autoComplete="off"
                placeholder="*********"
                required
                isPassword={hiddenPassword}
                onTypeChange={setHiddenPassword}
                value={formData.confirmPassword}
                onChange={handleOnchange}
                isError={isConfirmNewPassword}
                onBlur={handleOnBlur}
                onFocus={handleOnFocus}
              />
              {isConfirmNewPassword ? (
                <p className="text-red-500 text-xs">
                  Xác nhận mật khẩu không đúng.
                </p>
              ) : null}
            </div>

            <Button
              disabled={
                isPending ||
                emailExists ||
                isConfirmNewPassword ||
                isPasswordError
              }
              type="submit"
              className="w-full cursor-pointer"
            >
              {isPending ? (
                <LoaderCircleIcon className="h-4 w-4 animate-spin flex-shrink-0" />
              ) : null}
              Đăng ký
            </Button>
          </div>
          <div className="text-center text-sm">
            Đã có tài khoản?{" "}
            <Link href="/login" className="underline underline-offset-4">
              Đăng nhập
            </Link>
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

export default SignUp;
