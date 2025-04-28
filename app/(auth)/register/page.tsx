import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import SignUpForm from "@/components/commons/authForms/SignUpForm";

export const metadata: Metadata = {
  title: "Đăng Ký Tài Khoản",
};

const SignUpPage = () => {
  return <SignUpForm />;
};

export default SignUpPage;
