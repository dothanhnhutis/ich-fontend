"use client";
import React from "react";
import { Button } from "@/components/commons/button";
import { Input } from "@/components/commons/input";
import { Label } from "@/components/commons/label";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/password-input";
import Link from "next/link";
import GoogleButton from "./GoogleButton";
import { z } from "zod";
import { signInAction } from "./actions";
import { SignIn } from "@/types/auth";
import { AUTH_MESSAGES } from "@/constants/systemMessages";
import { ROUTES } from "@/constants/routes";
import { toast } from "sonner";

const emailSchema = z.string().email();

const SignInForm = ({
  email = "",
  statusError,
}: {
  email?: string;
  statusError?: string;
}) => {
  const router = useRouter();

  const [formData, setFormData] = React.useState<SignIn>({
    email,
    password: "",
  });

  const [mfaCode, setMfaCode] = React.useState<string>("");

  React.useEffect(() => {
    if (statusError) {
      document.cookie =
        "oauth2_error_type=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  }, [statusError]);

  const { data, mutate, isPending, reset } = useMutation({
    mutationFn: async () => {
      return await signInAction(formData);
    },
    onSuccess({ status, token, message }) {
      if (status == "SUCCESS") {
        router.refresh();
        toast.success(message);
      }
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
    if (statusError == "USER_SIGN_IN_PASSWORD") {
      document.cookie =
        "oauth2_error_type=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.email != "" && formData.password != "") {
      mutate();
    }
  };

  if (data && data.status == "MFA_REQUIRED") {
    return (
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-1.5 py-6">
          <h1 className="font-semibold tracking-tight text-2xl">
            Xác thực đa yếu tố (MFA)
          </h1>
          <p className="text-muted-foreground text-sm">
            Tài khoản của bạn được đảm bảo bằng xác thực đa yếu tố (MFA). Để
            hoàn tất đăng nhập, hãy bật hoặc xem thiết bị MFA của bạn và nhập mã
            xác thực bên dưới.
          </p>
        </div>

        <form>
          <div className="grid gap-6">
            <div className="grid gap-6">
              <div className="grid gap-2">
                <p>
                  <span className="font-medium text-sm">E-mail</span>:
                  dothanhnhutis@gmail.com
                </p>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="code">Mã xác thực</Label>
                  <button
                    type="button"
                    className="text-primary text-sm cursor-pointer hover:underline"
                  >
                    Khắc phục sự cố MFA
                  </button>
                </div>
                <Input
                  id="code"
                  name="code"
                  placeholder="123456"
                  maxLength={6}
                  required
                  onChange={(e) => setMfaCode(e.target.value)}
                  value={mfaCode}
                  disabled={isPending}
                />
              </div>
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isPending}
              >
                {isPending && (
                  <LoaderCircleIcon className="size-4 animate-spin" />
                )}
                Xác thực
              </Button>
            </div>
            <button
              type="button"
              className="text-primary justify-self-start cursor-pointer text-sm hover:underline"
            >
              Đăng nhập với tài khoản khác
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="flex flex-col gap-1.5 py-6">
        <h1 className="font-semibold tracking-tight text-2xl">Đăng nhập</h1>
        <p className="text-muted-foreground text-sm">Chào mừng bạn trở lại</p>
      </div>

      {/* <p className="bg-yellow-100/70 text-sm text-yellow-600 p-2 mb-2 rounded-md">
        Tài khoản E-mail đã đăng ký với mật khẩu. Vui lòng đăng nhập rồi liên
        kết với tài khoản google.
      </p>
*/}

      {data && data.status == "ACTIVATE_REQUIRED" ? (
        <p className="bg-yellow-100/70 text-sm text-yellow-600 p-2 mb-2 rounded-md">
          Tài khoản của bạn đã vô hiệu hoá. Vui lòng{" "}
          <Link
            href={`/reactivate?token=${data.token}`}
            className="text-primary"
          >
            kích hoạt lại
          </Link>{" "}
          trước khi đăng nhập.
        </p>
      ) : null}
      {data && data.status == "ERROR" ? (
        <p className="bg-red-100/70 text-sm text-red-600 p-2 mb-2 rounded-md">
          {data?.message ?? AUTH_MESSAGES.USER_BANNED}
        </p>
      ) : null}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <div className="flex flex-col gap-4">
            <GoogleButton />
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
                <Link
                  href={
                    emailSchema.safeParse(formData.email).success
                      ? `${ROUTES.recover}?email=${formData.email}`
                      : ROUTES.recover
                  }
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <PasswordInput
                id="password"
                name="password"
                autoComplete="off"
                placeholder="*********"
                required
                onChange={handleOnchange}
                value={formData.password}
                disabled={isPending}
              />
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
            <a href="/register" className="underline underline-offset-4">
              Đăng ký
            </a>
          </div>
        </div>
      </form>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary py-6">
        Bằng cách nhấp vào tiếp tục, bạn đồng ý với{" "}
        <Link href="#">Điều khoản dịch vụ</Link> và{" "}
        <Link href="#">Chính sách bảo mật</Link> của chúng tôi.
      </div>
    </div>
  );
};

export default SignInForm;
