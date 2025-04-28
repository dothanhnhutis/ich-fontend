"use client";
import React from "react";
import PasswordInput from "@/components/password-input";
import { Button } from "@/components/commons/button";
import { Label } from "@/components/commons/label";
import cn from "@/utils/cn";
import { CheckIcon, LoaderCircleIcon } from "lucide-react";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { resetPasswordAction } from "../actions";
import Link from "next/link";

const passwordSchema = z
  .string({
    required_error: "Mật khẩu mới là bắt buộc",
    invalid_type_error: "Mật khẩu mới phải là chuỗi",
  })
  .min(8, "Mật khẩu mới quá ngắn")
  .max(60, "Mật khẩu mới quá dài")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/,
    "Mật khẩu mới phải có ký tự hoa, thường, sô và ký tự đặc biệt"
  );

const ResetPasswordForm = ({ token }: { token: string }) => {
  const [isResetPassswordSuccess, setIsResetPasswordSuccess] =
    React.useState<boolean>(false);
  const [hiddenPassword, setHiddenPassword] = React.useState<boolean>(true);
  const [focusAt, setFocusAt] = React.useState<string>("");
  const handleOnFocus = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    setFocusAt(e.target.name);
  };
  const handleOnBlur = () => {
    setFocusAt("");
  };

  const [formData, setFormData] = React.useState<{
    password: string;
    confirmPassword: string;
  }>({
    password: "",
    confirmPassword: "",
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    mutationFn: async () => {
      return await resetPasswordAction(token, formData);
    },
    onSettled() {
      setFormData({
        password: "",
        confirmPassword: "",
      });
    },
    onSuccess({ success, message }) {
      if (!success) {
        toast.error(message);
      } else {
        setIsResetPasswordSuccess(true);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <div className="flex flex-col flex-grow mx-auto w-full sm:max-w-[570px] p-4 transition-all">
      <div className="flex flex-col flex-grow space-y-6">
        <h1 className="text-4xl font-semibold tracking-tight text-center mt-4">
          Đặt lại mật khẩu tài khoản của bạn
        </h1>

        {isResetPassswordSuccess ? (
          <div className="flex flex-col justify-center gap-2">
            <p className="text-green-400 text-center">
              Khôi phục tài khoản thành công.{" "}
            </p>
            <Button asChild className="inline-flex">
              <Link href="/login">Về trang đăng nhập</Link>
            </Button>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground text-center">
              Nhập mật khẩu và khôi phục lại tài khoản của bạn
            </p>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-y-4 w-full"
            >
              <div className="flex flex-col gap-y-1.5">
                <Label htmlFor="password">Mật khẩu mới</Label>
                <PasswordInput
                  id="password"
                  name="password"
                  autoComplete="off"
                  placeholder="********"
                  required
                  isPassword={hiddenPassword}
                  onTypeChange={setHiddenPassword}
                  value={formData.password}
                  onChange={handleOnChange}
                  onBlur={handleOnBlur}
                  onFocus={handleOnFocus}
                  isError={isPasswordError}
                />

                <div className="flex flex-col gap-y-1 text-xs">
                  <p className="font-normal text-muted-foreground">
                    Mật khẩu của bạn phải bao gồm:
                  </p>
                  <p
                    className={cn(
                      "inline-flex gap-x-2 items-center text-muted-foreground",
                      isPasswordSchemaErrors.filter(
                        (err) =>
                          err.code == "too_small" || err.code == "too_big"
                      ).length > 0
                        ? ""
                        : "text-green-400"
                    )}
                  >
                    <CheckIcon size={16} />
                    <span>8 đến 40 ký tự</span>
                  </p>
                  <p
                    className={cn(
                      "inline-flex gap-x-2 items-center text-muted-foreground",
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
              <div className="flex flex-col gap-y-1.5">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>

                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  autoComplete="off"
                  placeholder="********"
                  required
                  isPassword={hiddenPassword}
                  onTypeChange={setHiddenPassword}
                  value={formData.confirmPassword}
                  onChange={handleOnChange}
                  onBlur={handleOnBlur}
                  onFocus={handleOnFocus}
                  isError={isConfirmNewPassword}
                />

                {isConfirmNewPassword ? (
                  <p className="text-red-500 text-xs">
                    Xác nhận mật khẩu không đúng.
                  </p>
                ) : null}
              </div>
              <Button
                disabled={isPending || isConfirmNewPassword || isPasswordError}
              >
                {isPending && (
                  <LoaderCircleIcon className="h-4 w-4 animate-spin flex-shrink-0 mr-2" />
                )}
                Khôi phục
              </Button>
            </form>{" "}
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordForm;
