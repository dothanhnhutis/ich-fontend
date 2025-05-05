import React from "react";
import { Metadata } from "next";
import SignUp from "@/components/features/SignUp";

export const metadata: Metadata = {
  title: "Đăng Ký Tài Khoản",
};

const SignUpPage = () => {
  return <SignUp />;
};

export default SignUpPage;
