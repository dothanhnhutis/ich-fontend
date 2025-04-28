import React from "react";
import UserApi from "@/lib/services/user";
import { Metadata } from "next";
import EmailModal from "./_components/EmailModal";
import PasswordModal from "./_components/PasswordModal";
import DisableAccountModal from "./_components/DisableAccountModal";
import { MFAModal } from "./_components/MFAModal";
import Linked from "./_components/Linked";

export const metadata: Metadata = {
  title: "Mật khẩu & Bảo mật",
};

const SecurityPage = async () => {
  const mfa = await UserApi.getMFA();
  const links = await UserApi.getLinked();
  return (
    <div className="w-full">
      <EmailModal />
      <PasswordModal />
      <Linked links={links} />
      <MFAModal mfa={mfa} />

      <DisableAccountModal />
    </div>
  );
};

export default SecurityPage;
