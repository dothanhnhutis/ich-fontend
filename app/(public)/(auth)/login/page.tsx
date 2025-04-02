import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SignInForm from "../../_components/forms/signin-form";
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
          <Image src="/logo2.png" priority alt="logo" width={300} height={85} />
        </Link>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Chào mừng trở lại</CardTitle>
              <CardDescription>
                Đăng nhập bằng tài khoản Google của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignInForm />
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
            Bằng cách nhấp vào tiếp tục, bạn đồng ý với{" "}
            <Link href="#">Điều khoản dịch vụ</Link> và{" "}
            <Link href="#">Chính sách bảo mật</Link> của chúng tôi.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogInPage;
