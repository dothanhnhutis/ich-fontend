"use client";
import React from "react";
// import DeactivateBtn from "./deactivate-btn";
// import MFASwitch from "./mfa-switch";
// import { PasswordBtn } from "./password-btn";
// import ProviderList from "./provider-list";
import { Trash2Icon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import EmailModal from "./email-modal";
import { PasswordModal } from "./password-btn";

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
      <div className="flex w-full gap-4 border-b py-4">
        <div className="w-full">
          <p className="font-bold">Mật khẩu</p>
          <p className="text-xs font-normal leading-snug text-muted-foreground">
            Tạo mật khẩu mạnh để bảo vệ tài khoản an toàn hơn.
          </p>
        </div>

        <PasswordModal hasPassword />
      </div>
      <div className="flex flex-col lg:flex-row w-full gap-4 border-b py-4">
        <div className="w-full">
          <p className="font-bold">Tài khoản được kết nối</p>
          <p className="text-xs font-normal leading-snug text-muted-foreground">
            Đăng nhập nhanh chóng bằng các tài khoản khác.
          </p>
        </div>
        {/* <ProviderList
          oauthProviders={[
            { id: "123123", provider: "google", providerId: "Asdasd" },
            { id: "123123", provider: "facebook", providerId: "Asdasd" },
          ]}
        /> */}
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

        {/* <DeactivateBtn /> */}
        <button>
          <Trash2Icon className="text-red-500 shrink-0 size-5" />
        </button>
      </div>
    </div>
  );
};

export default SecurityPage;
