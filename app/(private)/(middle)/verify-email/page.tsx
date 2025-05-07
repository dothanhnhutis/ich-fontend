import React from "react";
import { Metadata } from "next";
import VerifyEmail from "@/components/features/VerifyEmail";

export const metadata: Metadata = {
  title: "Xác Minh Tài Khoản",
};

const VerifyEmailPage = async () => {
  return <VerifyEmail />;
};

export default VerifyEmailPage;
