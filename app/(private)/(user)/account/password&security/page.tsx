import React from "react";
import { getMFA } from "@/data/user";
import { Metadata } from "next";
import Security from "./security";

export const metadata: Metadata = {
  title: "Mật khẩu & Bảo mật",
};

const SecurityPage = async () => {
  const mfa = await getMFA();

  return <Security mfa={mfa} />;
};

export default SecurityPage;
