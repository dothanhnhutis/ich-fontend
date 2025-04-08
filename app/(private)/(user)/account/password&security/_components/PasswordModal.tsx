"use client";
import React from "react";
import { Button } from "@/components/ui/button";

import { CheckIcon, LoaderCircleIcon, XIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import PasswordInput from "@/components/password-input";
import { useUser } from "@/app/(private)/user-provider";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";

const newPasswordSchema = z
  .string({
    required_error: "Mật khẩu mới là bắt buộc",
    invalid_type_error: "Mật khẩu mới phải là chuỗi",
  })
  .min(8, "Mật khẩu mới quá ngắn (min: 8)")
  .max(125, "Mật khẩu mới quá dài (max: 125)")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/,
    "Mật khẩu mới phải có ký tự hoa, thường, sô và ký tự đặc biệt"
  );

const PasswordModal = () => {
  const { user, isPending: isPendingUser, refetch } = useUser();
  const [open, setOpen] = React.useState<boolean>(false);
  const [hiddenPassword, setHiddenPassword] = React.useState<boolean>(true);

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

  const isNewPasswordError = React.useMemo(() => {
    const { success, error } = newPasswordSchema.safeParse(
      formData.newPassword
    );
    if (success) return [];
    return error.issues;
  }, [formData.newPassword]);

  console.log(isNewPasswordError);

  const handleInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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

          <form className="flex flex-col gap-4">
            {user?.hasPassword ? (
              <div className="grid gap-1.5">
                <Label htmlFor="oldPassword">Mật khẩu cũ</Label>
                <PasswordInput
                  id="oldPassword"
                  name="oldPassword"
                  autoComplete="off"
                  spellCheck="false"
                  placeholder="********"
                  isPassword={hiddenPassword}
                  onTypeChange={setHiddenPassword}
                  onChange={handleInputOnChange}
                  value={formData.oldPassword}
                />
                <p className="text-xs">
                  <span className="text-red-500">Mật khẩu cũ không đúng.</span>{" "}
                  <span className="text-primary cursor-pointer hover:underline">
                    Quyên mật khẩu
                  </span>
                </p>
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
                isPassword={hiddenPassword}
                onTypeChange={setHiddenPassword}
                onChange={handleInputOnChange}
                value={formData.newPassword}
              />

              <div className="flex flex-col gap-y-1 text-xs">
                <p className="font-normal text-muted-foreground">
                  Mật khẩu mới phải bao gồm:
                </p>
                <p
                  className={cn(
                    "inline-flex gap-x-2 items-center text-gray-500",
                    true ? "" : "text-green-400"
                  )}
                >
                  <CheckIcon size={16} />
                  <span>8 đến 40 ký tự.</span>
                </p>
                <p
                  className={cn(
                    "inline-flex gap-x-2 items-center text-gray-500",
                    false ? "" : "text-green-400"
                  )}
                >
                  <CheckIcon size={16} />
                  <span>Chữ cái, số và ký tự đặc biệt.</span>
                </p>

                {user?.hasPassword ? (
                  <p className="text-red-500 text-xs flex gap-2 items-center">
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
                isPassword={hiddenPassword}
                onTypeChange={setHiddenPassword}
                onChange={handleInputOnChange}
                value={formData.confirmNewPassword}
              />
              <p className="text-red-500 text-xs">
                Xác nhận mật khẩu không đúng.
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <Checkbox id="signOut" />
              <Label
                htmlFor="signOut"
                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Đăng xuất tất cả các thiết bị
              </Label>
            </div>
            <div className="flex gap-4 flex-col sm:flex-row justify-end">
              <Button className="sm:order-last">
                <LoaderCircleIcon className="h-4 w-4 animate-spin flex-shrink-0 mr-2 " />
                Save
              </Button>
              <Button type="button" variant="outline">
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
