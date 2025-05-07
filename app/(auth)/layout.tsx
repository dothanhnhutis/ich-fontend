import React from "react";
import { Metadata } from "next";
import AuthLayout from "@/components/layouts/AuthLayout";

export const metadata: Metadata = {
  title: {
    default: "Nhà Máy Sản Xuất Gia Công Mỹ Phẩm I.C.H",
    template: "%s | Nhà Máy Sản Xuất Gia Công Mỹ Phẩm I.C.H",
  },
  description:
    "Công ty TNHH MTV Sản Xuất I.C.H chuyên cung cấp các dịch vụ gia công, sản xuất mỹ phẩm và phát triển sản phẩm theo trend trên thị trường.",
  robots: {
    index: false,
    follow: false,
  },
};

const AuthLayoutPage = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <AuthLayout>{children}</AuthLayout>;
};

export default AuthLayoutPage;
