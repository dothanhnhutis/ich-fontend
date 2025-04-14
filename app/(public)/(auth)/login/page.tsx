import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import SignInForm from "../../_components/forms/SignInForm";
export const metadata: Metadata = {
  title: "Đăng Nhập",
};
const LogInPage = () => {
  return (
    <div className="flex  flex-col items-center gap-6 bg-background p-2 sm:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-1.5 py-6">
          <h3 className="font-semibold tracking-tight text-2xl">Đăng nhập</h3>
          <p className="text-muted-foreground text-sm">Chào mừng bạn trở lại</p>
        </div>
        <SignInForm />
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary py-6">
          Bằng cách nhấp vào tiếp tục, bạn đồng ý với{" "}
          <Link href="#">Điều khoản dịch vụ</Link> và{" "}
          <Link href="#">Chính sách bảo mật</Link> của chúng tôi.
        </div>
      </div>
    </div>
  );
};

export default LogInPage;
