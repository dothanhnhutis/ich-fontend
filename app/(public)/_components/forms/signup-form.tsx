"use client";
import PasswordInput from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const SignUpForm = () => {
  const [hiddenPassword, setHiddenPassword] = React.useState<boolean>(true);

  return (
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
            Đăng ký bằng Google
          </Button>
        </div>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Hoặc tiếp tục với
          </span>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="username">Tên</Label>
            <Input
              id="username"
              type="text"
              name="username"
              placeholder="Nguyen Van A"
              required
            />
          </div>
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
            </div>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="off"
              placeholder="*********"
              required
              isPassword={hiddenPassword}
              onTypeChange={setHiddenPassword}
            />
            <div className="flex flex-col gap-y-1 text-xs">
              <p className="font-normal text-muted-foreground">
                Mật khẩu phải bao gồm:
              </p>
              <p
                className={cn(
                  "inline-flex gap-x-2 items-center text-gray-500",
                  true ? "" : "text-green-400"
                )}
              >
                <CheckIcon size={16} />
                <span>8 đến 40 ký tự.</span>
              </p>
              <p
                className={cn(
                  "inline-flex gap-x-2 items-center text-gray-500",
                  false ? "" : "text-green-400"
                )}
              >
                <CheckIcon size={16} />
                <span>Chữ cái, số và ký tự đặc biệt.</span>
              </p>
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Xác nhận mật khẩu</Label>
            </div>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="off"
              placeholder="*********"
              required
              isPassword={hiddenPassword}
              onTypeChange={setHiddenPassword}
            />
          </div>

          <Button type="submit" className="w-full cursor-pointer">
            {/* {isPending && <LoaderCircleIcon className="size-4 animate-spin" />} */}
            Đăng ký
          </Button>
        </div>
        <div className="text-center text-sm">
          Đã có tài khoản?{" "}
          <Link href="/login" className="underline underline-offset-4">
            Đăng nhập
          </Link>
        </div>

        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
          Bằng cách đăng ký tài khoản, bạn đồng ý với{" "}
          <Link href="#">Điều khoản dịch vụ</Link> và{" "}
          <Link href="#">Chính sách bảo mật</Link> của chúng tôi.
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
