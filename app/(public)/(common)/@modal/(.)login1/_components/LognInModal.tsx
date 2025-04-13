"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SignInForm from "@/app/(public)/_components/forms/SignInForm";

const LogInModal = () => {
  const router = useRouter();
  return (
    <Dialog
      defaultOpen={true}
      onOpenChange={(value) => {
        if (!value) {
          router.back();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="sm:text-center">
          <Link
            href="/"
            className="flex items-center gap-2 self-center font-medium"
          >
            <Image
              src="/logo.png"
              priority
              alt="logo"
              width={100}
              height={100}
            />
          </Link>
          <DialogTitle className="text-xl">Chào mừng trở lại</DialogTitle>
          <DialogDescription>
            Đăng nhập bằng tài khoản Google của bạn
          </DialogDescription>
        </DialogHeader>
        <SignInForm />
        <DialogFooter>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
            Bằng cách nhấp vào tiếp tục, bạn đồng ý với{" "}
            <a href="#">Điều khoản dịch vụ</a> và{" "}
            <a href="#">Chính sách bảo mật</a> của chúng tôi.
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogInModal;
