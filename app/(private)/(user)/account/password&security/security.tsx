"use client";
import React from "react";
import EmailModal from "./_components/EmailModal";
import PasswordModal from "./_components/PasswordModal";
import { MFAContainer, MFAProvider } from "./_components/MFAModal";
import DisableAccountModal from "./_components/DisableAccountModal";
import { CurrentUser, MFA } from "@/data/user";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Security = ({ mfa }: { mfa: MFA | null }) => {
  return (
    <div className="w-full">
      <EmailModal />
      <PasswordModal />
      <div className="block w-full border-b py-4">
        <p className="font-bold">Tài khoản được kết nối</p>
        <p className="text-xs font-normal leading-snug text-muted-foreground">
          Đăng nhập nhanh chóng bằng các tài khoản khác.
        </p>
        <div className="grid gap-2 mt-2">
          <div className="flex items-center gap-4 justify-between">
            <div className={cn("flex items-center gap-2")}>
              <div className="p-0.5 bg-white rounded-full shadow dark:shadow-none text-primary">
                <FcGoogle className="size-9" />
              </div>
              <p className="font-medium">Facebook</p>
            </div>
            <Button className="rounded-full cursor-pointer" variant="outline">
              Ngắt kết nối
            </Button>
          </div>
          <div className="flex items-center gap-4 justify-between">
            <div className={cn("flex items-center gap-2", "opacity-50")}>
              <div className="p-0.5 bg-white rounded-full shadow dark:shadow-none text-primary">
                <FcGoogle className="size-9" />
              </div>
              <p className="font-medium">Facebook</p>
            </div>
            <Button className="rounded-full cursor-pointer" variant="outline">
              Kết nối
            </Button>
          </div>
        </div>
      </div>
      <div className="flex w-full gap-4 border-b py-4">
        <div className="w-full">
          <p className="font-bold after:content-['*'] after:text-red-500">
            Xác thực yếu tố đa yếu tố (MFA)
          </p>
          <p className="text-xs font-normal leading-snug text-muted-foreground">
            Bảo mật cao hơn với mã xác thực khi đăng nhập.
          </p>
        </div>

        <MFAProvider mfa={mfa}>
          <MFAContainer />
        </MFAProvider>
      </div>
      <div className="flex w-full gap-4 py-4">
        <div className="w-full">
          <p className="font-bold">Vô hiệu hoá tài khoản của tôi</p>
          <p className="text-xs font-normal leading-snug text-muted-foreground">
            Tạm thời đóng tài khoản, có thể kích hoạt lại khi cần.
          </p>
        </div>

        <DisableAccountModal />
      </div>
    </div>
  );
};

export default Security;
