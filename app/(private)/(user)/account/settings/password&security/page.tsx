import React from "react";
import { getMFA } from "@/data/user";
import { Metadata } from "next";
import EmailModal from "./_components/EmailModal";
import PasswordModal from "./_components/PasswordModal";
import DisableAccountModal from "./_components/DisableAccountModal";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MFAModal as MFAModal2 } from "./_components/MFAModal";

export const metadata: Metadata = {
  title: "Mật khẩu & Bảo mật",
};

const SecurityPage = async () => {
  const mfa = await getMFA();
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
      {/* <MFAModal mfa={mfa} /> */}
      {/* <MFAModal1 mfa={mfa} /> */}
      <MFAModal2 mfa={mfa} />

      <DisableAccountModal />
    </div>
  );
};

export default SecurityPage;
