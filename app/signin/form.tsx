"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInAction } from "@/actions/signin";
import { useMutation } from "@tanstack/react-query";
import FetchAPI from "@/lib/fetchApi";
import { LoaderCircleIcon } from "lucide-react";

export const SignInServerActionForm = () => {
  const [state, formAction, pending] = React.useActionState<
    {
      message: string | null;
    },
    FormData
  >(signInAction, {
    message: null,
  });

  return (
    <form className="grid gap-2" action={formAction}>
      <Input
        name="email"
        type="email"
        id="email"
        placeholder="abc@example.com"
        disabled={pending}
      />
      <Input
        name="password"
        type="password"
        id="password"
        placeholder="******"
        disabled={pending}
      />
      {state.message && <p>{state.message}</p>}

      <Button disabled={pending}>Sign In</Button>
    </form>
  );
};

type SignInFormData = {
  email: string;
  password: string;
};

const authApi = FetchAPI.createInstance({
  baseUrl: "http://localhost:4000" + "/api/v1/users",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const SignInForm = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const [formData, setFormData] = React.useState<SignInFormData>({
    email: "",
    password: "",
  });

  const { error, mutate, isPending, reset } = useMutation({
    mutationFn: async () => {
      await authApi.post<{
        status: number;
        success: boolean;
        message: string;
      }>("/signin", formData);
    },
    onSuccess() {
      console.log("first");
    },
    onSettled() {
      setFormData({
        email: "",
        password: "",
      });
    },
  });

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    reset();
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.email != "" && formData.password != "") {
      mutate();
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Chào mừng trở lại</CardTitle>
          <CardDescription>
            Đăng nhập bằng tài khoản Google của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
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
                    onChange={handleOnchange}
                    value={formData.email}
                    disabled={isPending}
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
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    autoComplete="off"
                    placeholder="*********"
                    required
                    onChange={handleOnchange}
                    value={formData.password}
                    disabled={isPending}
                  />
                  {error && (
                    <p className="text-destructive text-sm">{error?.message}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={isPending}
                >
                  {isPending && (
                    <LoaderCircleIcon className="size-4 animate-spin" />
                  )}
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
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        Bằng cách nhấp vào tiếp tục, bạn đồng ý với{" "}
        <a href="#">Điều khoản dịch vụ</a> và <a href="#">Chính sách bảo mật</a>{" "}
        của chúng tôi.
      </div>
    </div>
  );
};
