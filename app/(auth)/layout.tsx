import React from "react";
import { Metadata } from "next";
import BrandLogo from "@/components/commons/brand-logo";

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

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <div className="sticky top-0 left-0 right-0 z-50 bg-accent-foreground">
        <div className="flex items-center justify-between gap-2 px-2 sm:px-3 py-1 h-[64px] mx-auto max-w-7xl">
          <BrandLogo />
        </div>
      </div>
      <section className="flex flex-col items-center gap-6 bg-background p-2 sm:p-10">
        {children}
      </section>
    </>
  );
};

export default AuthLayout;
