"use client";
import React from "react";
import { Button } from "@/components/ui/button";

import { CheckIcon, LoaderCircleIcon, XIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import PasswordInput from "@/components/password-input";

const PasswordModal = ({ hasPassword }: { hasPassword?: boolean }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [hiddenPassword, setHiddenPassword] = React.useState<boolean>(true);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full cursor-pointer" variant="outline">
          {hasPassword ? "Thay đổi" : "Thiết lập"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-screen-sm">
        <DialogHeader>
          <DialogTitle>
            {hasPassword ? "Thay đổi mật khẩu" : "Thiết lập mật khẩu"}
          </DialogTitle>
        </DialogHeader>

        <form className="flex flex-col gap-4">
          {hasPassword ? (
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
              {hasPassword ? "Mật khẩu mới" : "Mật khẩu"}
            </Label>
            <PasswordInput
              id="newPassword"
              name="newPassword"
              autoComplete="off"
              spellCheck="false"
              placeholder="********"
              isPassword={hiddenPassword}
              onTypeChange={setHiddenPassword}
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

              {hasPassword ? (
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
            />
            <p className="text-red-500 text-xs">
              Xác nhận mật khẩu không đúng.
            </p>
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
      </DialogContent>
    </Dialog>
  );
};
export default PasswordModal;
