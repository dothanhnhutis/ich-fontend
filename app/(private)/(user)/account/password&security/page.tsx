"use client";
import React from "react";
// import DeactivateBtn from "./deactivate-btn";
// import MFASwitch from "./mfa-switch";
// import { PasswordBtn } from "./password-btn";
// import ProviderList from "./provider-list";
import { LoaderCircleIcon, LoaderPinwheelIcon, Trash2Icon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import EmailModal from "./EmailModal";
import { PasswordModal } from "./PasswordModal";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import DisableAccountModal from "./DisableAccountModal";

const SecurityPage = () => {
  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row w-full gap-4 border-b py-4">
        <div className="w-full">
          <p className="font-bold">Email address</p>
          <p className="text-xs font-normal leading-snug text-muted-foreground">
            Quản lý email đăng nhập và liên kết với tài khoản của bạn.
          </p>
        </div>
        <div className="flex gap-4 items-center justify-between w-full">
          <div className="text-sm">
            <p className="font-medium">gaconght@gmail.com</p>
            <div className="text-green-500">Verified</div>
          </div>
          <EmailModal />
        </div>
      </div>
      <div className="flex items-center w-full gap-4 border-b py-4">
        <div className="w-full">
          <p className="font-bold">Mật khẩu</p>
          <p className="text-xs font-normal leading-snug text-muted-foreground">
            Tạo mật khẩu mạnh để bảo vệ tài khoản an toàn hơn.
          </p>
        </div>

        <PasswordModal hasPassword />
      </div>
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
        {/* <MFASwitch /> */}
        <Switch />
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

export default SecurityPage;
