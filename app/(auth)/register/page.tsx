import React from "react";
import Link from "next/link";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import SignUpForm from "../../(public)/_components/forms/SignUpForm";

export const metadata: Metadata = {
  title: "Đăng Ký Tài Khoản",
};

const SignUpPage = () => {
  return (
    // <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
    //   <div className="flex w-full max-w-sm flex-col gap-6">
    //     <Link
    //       href="/"
    //       className="flex items-center gap-2 self-center font-medium"
    //     >
    //       <Image src="/logo2.png" priority alt="logo" width={300} height={85} />
    //     </Link>
    //     <div className="flex flex-col gap-6">
    //       <Card>
    //         <CardHeader className="text-center">
    //           <CardTitle className="text-xl">Chào mừng trở lại</CardTitle>
    //           <CardDescription>
    //             Đăng ký bằng tài khoản Google của bạn
    //           </CardDescription>
    //         </CardHeader>
    //         <CardContent>
    //           <SignUpForm />
    //         </CardContent>
    //       </Card>
    //     </div>
    //   </div>
    // </div>

    <div className="flex  flex-col items-center gap-6 bg-background p-2 sm:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-1.5 py-6">
          <h3 className="font-semibold tracking-tight text-2xl">Đăng ký</h3>
          <p className="text-muted-foreground text-sm">Chào mừng bạn trở lại</p>
        </div>
        <SignUpForm />
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary py-6">
          Bằng cách nhấp vào tiếp tục, bạn đồng ý với{" "}
          <Link href="#">Điều khoản dịch vụ</Link> và{" "}
          <Link href="#">Chính sách bảo mật</Link> của chúng tôi.
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
