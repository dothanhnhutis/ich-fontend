import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import BrandLogo from "@/components/commons/brand-logo";

export const metadata: Metadata = {
  title: "Authentication Page",
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
