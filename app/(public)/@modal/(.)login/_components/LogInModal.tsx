"use client";
import PasswordInput from "@/components/password-input";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

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
            <Image src="/logo.png" alt="logo" width={100} height={100} />
          </Link>
          <DialogTitle className="text-xl">Chào mừng trở lại</DialogTitle>
          <DialogDescription>
            Đăng nhập bằng tài khoản Google của bạn
          </DialogDescription>
        </DialogHeader>
        <form>
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              <Button variant="outline" className="w-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Đăng nhập bằng Google
              </Button>
            </div>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Hoặc tiếp tục với
              </span>
            </div>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Quên mật khẩu?
                  </a>
                </div>
                {/* <Input
                  id="password"
                  type="password"
                  name="password"
                  autoComplete="off"
                  placeholder="*********"
                  required
                /> */}

                <PasswordInput
                  id="password"
                  type="password"
                  name="password"
                  autoComplete="off"
                  placeholder="*********"
                  required
                />
              </div>
              <Button type="submit" className="w-full cursor-pointer">
                Đăng nhập
              </Button>
            </div>
            <div className="text-center text-sm">
              Không có tài khoản?{" "}
              <a href="#" className="underline underline-offset-4">
                Đăng ký
              </a>
            </div>
          </div>
        </form>
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
