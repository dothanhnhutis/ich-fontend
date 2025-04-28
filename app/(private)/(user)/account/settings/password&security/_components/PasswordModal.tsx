"use client";
import React, { use } from "react";
import { Button } from "@/components/commons/button";

import { CheckIcon, LoaderCircleIcon, XIcon } from "lucide-react";
import { Label } from "@/components/commons/label";
import cn from "@/utils/cn";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/commons/alert-dialog";

import PasswordInput from "@/components/password-input";
import { useUser } from "@/app/(private)/UserProvider";
import { Checkbox } from "@/components/commons/checkbox";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import {
  createPasswordAction,
  forgotPasswordAction,
  updatePasswordAction,
} from "./actions";
import { toast } from "sonner";

const newPasswordSchema = z
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

const OldPasswordAlert = ({ handleCancel }: { handleCancel?: () => void }) => {
  const { user } = useUser();
  const { isPending, mutate } = useMutation({
    mutationFn: async function () {
      return await forgotPasswordAction(user!.email);
    },
    onSuccess({ success, message }) {
      if (success) {
        if (handleCancel) handleCancel();
        toast.success(message);
      } else {
        toast.error(message);
      }
    },
  });

  return (
    <p className="text-xs inline-flex">
      <span className="text-red-500">Mật khẩu cũ không đúng.</span>{" "}
      {isPending ? (
        <LoaderCircleIcon className="h-4 w-4 animate-spin shrink-0 text-primary" />
      ) : (
        <span
          onClick={() => {
            mutate();
          }}
          className="text-primary cursor-pointer hover:underline"
        >
          Quyên mật khẩu
        </span>
      )}
    </p>
  );
};

const PasswordModal = () => {
  const { user, isPending: isPendingUser, refetch } = useUser();
  const [open, setOpen] = React.useState<boolean>(false);
  const [hiddenPassword, setHiddenPassword] = React.useState<boolean>(true);
  const [focusAt, setFocusAt] = React.useState<string>("");

  const [formData, setFormData] = React.useState<{
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
    isSignOut: boolean;
  }>({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    isSignOut: false,
  });

  const handleOnFocus = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    setFocusAt(e.target.name);
  };
  const handleOnBlur = () => {
    setFocusAt("");
  };

  const isNewPasswordSchemaErrors = React.useMemo(() => {
    const { success, error } = newPasswordSchema.safeParse(
      formData.newPassword
    );
    if (success) return [];
    return error.issues;
  }, [formData.newPassword]);

  const isNewPasswordError = React.useMemo(() => {
    return (
      (formData.newPassword.length > 0 &&
        focusAt != "newPassword" &&
        isNewPasswordSchemaErrors.length > 0) ||
      (formData.oldPassword.length > 0 &&
        formData.newPassword.length > 0 &&
        focusAt != "oldPassword" &&
        focusAt != "newPassword" &&
        formData.oldPassword == formData.newPassword)
    );
  }, [formData, focusAt]);

  const [oldPasswordError, setOldPasswordError] =
    React.useState<boolean>(false);

  const isConfirmNewPassword = React.useMemo(() => {
    return (
      formData.newPassword.length > 0 &&
      formData.confirmNewPassword.length > 0 &&
      focusAt != "confirmNewPassword" &&
      focusAt != "newPassword" &&
      formData.newPassword != formData.confirmNewPassword
    );
  }, [formData, focusAt]);

  const handleInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const { isPending, mutate, data } = useMutation({
    mutationFn: async () => {
      if (user!.hasPassword) {
        return await updatePasswordAction(formData);
      } else {
        return await createPasswordAction(formData);
      }
    },
    onSuccess({ success, message }) {
      if (success) {
        handleCancel();
        toast.success(message);
        if (!user!.hasPassword) {
          refetch();
        }
      } else {
        setOldPasswordError(true);
      }
    },
  });

  const handleCancel = () => {
    setOpen(false);
    setFormData({
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      isSignOut: false,
    });
    setOldPasswordError(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user) mutate();
  };

  return (
    <div className="flex items-center w-full gap-4 border-b py-4">
      <div className="w-full">
        <p className="font-bold">Mật khẩu</p>
        <p className="text-xs font-normal leading-snug text-muted-foreground">
          Tạo mật khẩu mạnh để bảo vệ tài khoản an toàn hơn.
        </p>
      </div>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            disabled={isPendingUser}
            className="rounded-full cursor-pointer"
            variant="outline"
          >
            {user?.hasPassword ? "Thay đổi" : "Thiết lập"}
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent className="sm:max-w-screen-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {user?.hasPassword ? "Thay đổi mật khẩu" : "Thiết lập mật khẩu"}
            </AlertDialogTitle>
            <AlertDialogDescription className="hidden"></AlertDialogDescription>
          </AlertDialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {user?.hasPassword ? (
              <div className="grid gap-1.5">
                <Label htmlFor="oldPassword">Mật khẩu cũ</Label>
                <PasswordInput
                  id="oldPassword"
                  name="oldPassword"
                  autoComplete="off"
                  spellCheck="false"
                  placeholder="********"
                  required
                  isPassword={hiddenPassword}
                  onTypeChange={setHiddenPassword}
                  onChange={handleInputOnChange}
                  value={formData.oldPassword}
                  onBlur={handleOnBlur}
                  onFocus={handleOnFocus}
                  isError={oldPasswordError}
                />
                {oldPasswordError ? (
                  <OldPasswordAlert handleCancel={handleCancel} />
                ) : null}
              </div>
            ) : null}

            <div className="grid gap-1.5">
              <Label htmlFor="newPassword">
                {user?.hasPassword ? "Mật khẩu mới" : "Mật khẩu"}
              </Label>
              <PasswordInput
                id="newPassword"
                name="newPassword"
                autoComplete="off"
                spellCheck="false"
                placeholder="********"
                required
                isPassword={hiddenPassword}
                onTypeChange={setHiddenPassword}
                onChange={handleInputOnChange}
                value={formData.newPassword}
                onBlur={handleOnBlur}
                onFocus={handleOnFocus}
                isError={isNewPasswordError}
              />

              <div className="flex flex-col gap-y-1 text-xs">
                <p className="font-normal text-muted-foreground">
                  Mật khẩu mới phải bao gồm:
                </p>
                <p
                  className={cn(
                    "inline-flex gap-x-2 items-center text-muted-foreground",
                    isNewPasswordSchemaErrors.filter(
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
                    "inline-flex gap-x-2 items-center text-muted-foreground",
                    isNewPasswordSchemaErrors.filter(
                      (err) =>
                        err.code == "invalid_string" &&
                        err.validation == "regex"
                    ).length > 0
                      ? ""
                      : "text-green-400"
                  )}
                >
                  <CheckIcon size={16} />
                  <span>Chữ cái, số và ký tự đặc biệt.</span>
                </p>

                {user?.hasPassword ? (
                  <p
                    className={cn(
                      "text-xs flex gap-2 items-center",
                      formData.oldPassword.length > 0 &&
                        formData.newPassword.length > 0 &&
                        focusAt != "oldPassword" &&
                        focusAt != "newPassword" &&
                        formData.oldPassword == formData.newPassword
                        ? "text-destructive"
                        : "text-muted-foreground"
                    )}
                  >
                    <XIcon className="size-4 flex flex-shrink-0" />
                    <span>Mật khẩu mới trùng với mật khẩu cũ</span>
                  </p>
                ) : null}
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="confirmNewPassword">Xác nhận mật khẩu</Label>
              <PasswordInput
                id="confirmNewPassword"
                name="confirmNewPassword"
                autoComplete="off"
                spellCheck="false"
                placeholder="********"
                required
                isPassword={hiddenPassword}
                onTypeChange={setHiddenPassword}
                onChange={handleInputOnChange}
                value={formData.confirmNewPassword}
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
            {user?.hasPassword ? (
              <div className="flex items-center gap-1.5">
                <Checkbox
                  id="signOut"
                  checked={formData.isSignOut}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      isSignOut: checked == "indeterminate" ? false : checked,
                    }))
                  }
                />
                <Label
                  htmlFor="signOut"
                  className="text-sm font-normal text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Đăng xuất tất cả các thiết bị
                </Label>
              </div>
            ) : null}
            <div className="flex gap-4 flex-col sm:flex-row justify-end [&>button]:cursor-pointer">
              <Button
                className="sm:order-last gap-0.5"
                disabled={
                  user?.hasPassword
                    ? isNewPasswordError ||
                      isConfirmNewPassword ||
                      oldPasswordError
                    : isNewPasswordError || isConfirmNewPassword
                }
              >
                {isPending ? (
                  <LoaderCircleIcon className="h-4 w-4 animate-spin flex-shrink-0" />
                ) : null}
                Save
              </Button>
              <Button onClick={handleCancel} type="button" variant="outline">
                Cancel
              </Button>
            </div>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
export default PasswordModal;
