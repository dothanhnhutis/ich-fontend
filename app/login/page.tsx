import React from "react";
import { Metadata } from "next";
import { LoginForm } from "./form";
import Link from "next/link";
import Image from "next/image";
export const metadata: Metadata = {
  title: "Đăng Nhập",
};
const LogInPage = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <Image src="/logo2.png" alt="logo" width={300} height={100} />
        </Link>
        <LoginForm />
      </div>
    </div>
  );
};

export default LogInPage;
