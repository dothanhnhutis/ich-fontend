"use client";
import PasswordInput from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { CheckIcon, LoaderCircleIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import * as z from "zod";
import { registerAction } from "../actions";
import { toast } from "sonner";

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

const SignUpForm = () => {
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

  const { isPending, mutate } = useMutation({
    mutationFn: async function () {
      return await registerAction(formData);
    },
    onSuccess({ success, message }) {
      if (success) {
        toast.success(message);
      } else {
        setEmailExists(true);
      }
    },
    onSettled() {
      setFormData((prev) => ({
        ...prev,
        username: "",
        password: "",
        confirmPassword: "",
      }));
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6">
        <div className="flex flex-col gap-4">
          <Button variant="outline" className="w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Đăng ký bằng Google
          </Button>
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
                      err.code == "invalid_string" && err.validation == "regex"
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
  );
};

export default SignUpForm;
