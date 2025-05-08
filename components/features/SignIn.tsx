"use client";
import React from "react";
import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoaderCircleIcon } from "lucide-react";

import GoogleButton from "../commons/GoogleButton";
import PasswordInput from "../PasswordInput";
import { Label } from "../commons/label";
import { Input } from "../commons/input";
import { Button } from "../commons/button";
import { ROUTES } from "@/constants/routes";
import { SignInActionRes, SignInFormData } from "@/types/auth";
import {
  clearOAuthErrorData,
  signInAction,
  signInMFAAction,
} from "@/libs/actions/AuthActions";
import { SignInProvider, useSignIn } from "@/libs/contexts/signin-context";

const emailSchema = z.string().email();

type OAuthError =
  | {
      type: "SIGNED_UP_WITH_PASSWORD";
    }
  | {
      type: "USER_BANNED";
      banReason: string;
    }
  | {
      type: "USER_DISABLED";
      token: string;
    };

function SignInForm({
  email,
  oAuthError,
}: {
  email?: string;
  oAuthError?: string;
}) {
  const router = useRouter();
  const [formData, setFormData] = React.useState<SignInFormData>({
    email: email || "",
    password: "",
  });
  const [error, setError] = React.useState<SignInActionRes | null>(null);
  const [isPending, startTransition] = React.useTransition();
  const { handleMFAToken } = useSignIn();

  const [oAuthErr, setOAuthErr] = React.useState<OAuthError | null>(() => {
    if (!oAuthError) return null;
    try {
      return JSON.parse(oAuthError);
    } catch (error) {
      return null;
    }
  });

  React.useEffect(() => {
    const handleClear = async () => {
      await clearOAuthErrorData();
    };
    handleClear();
  }, [oAuthErr]);

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (oAuthErr) {
      setOAuthErr(null);
      // document.cookie =
      //   "oauth2_error_type=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    if (error) {
      setError(null);
    }
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await signInAction(formData);
      switch (res.status) {
        case "SUCCESS":
          router.refresh();
          toast.success(res.message);
          break;
        case "MFA_REQUIRED":
          handleMFAToken({ email: formData.email, token: res.token });
          break;
        case "ACTIVATE_REQUIRED":
          setFormData((prev) => ({ ...prev, password: "" }));
          break;
        default:
          setFormData({ email: "", password: "" });
          break;
      }
      setError(res);
    });
  };

  return (
    <div className="w-full max-w-sm">
      <div className="flex flex-col gap-1.5 py-6">
        <h1 className="font-semibold tracking-tight text-2xl">Đăng nhập</h1>
        <p className="text-muted-foreground text-sm">Chào mừng bạn trở lại</p>
      </div>

      {error && error.status == "ACTIVATE_REQUIRED" ? (
        <p className="bg-yellow-100/70 text-sm text-yellow-600 p-2 mb-2 rounded-md">
          Tài khoản của bạn đã vô hiệu hoá. Vui lòng{" "}
          <Link
            href={`/reactivate?token=${error.token}`}
            className="text-primary"
          >
            kích hoạt lại
          </Link>{" "}
          trước khi đăng nhập.
        </p>
      ) : null}

      {error && error.status == "ERROR" ? (
        <p className="bg-red-100/70 text-sm text-red-600 p-2 mb-2 rounded-md">
          {error.message}
        </p>
      ) : null}

      {oAuthErr && oAuthErr.type == "USER_BANNED" ? (
        <p className="bg-red-100/70 text-sm text-red-600 p-2 mb-2 rounded-md">
          {oAuthErr.banReason}
        </p>
      ) : null}

      {oAuthErr && oAuthErr.type == "USER_DISABLED" ? (
        <p className="bg-yellow-100/70 text-sm text-yellow-600 p-2 mb-2 rounded-md">
          Tài khoản của bạn đã vô hiệu hoá. Vui lòng{" "}
          <Link
            href={`/reactivate?token=${oAuthErr.token}`}
            className="text-primary"
          >
            kích hoạt lại
          </Link>{" "}
          trước khi đăng nhập.
        </p>
      ) : null}
      {oAuthErr && oAuthErr.type == "SIGNED_UP_WITH_PASSWORD" ? (
        <p className="bg-blue-100/70 text-sm text-blue-600 p-2 mb-2 rounded-md">
          Tài khoản đã đăng ký bằng mật khẩu
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
}

function MFAForm() {
  const router = useRouter();
  const { mfaToken, handleMFAToken } = useSignIn();
  const [code, setCode] = React.useState<string>("");
  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<null | Awaited<
    ReturnType<typeof signInMFAAction>
  >>(null);

  if (!mfaToken) return;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await signInMFAAction({
        ...mfaToken,
        code,
      });

      if (res.status == "SUCCESS") {
        router.refresh();
        toast.success(res.message);
      } else if (res.status == "ERROR") {
        setCode("");
        setError(res);
      }
    });
  };

  return (
    <div className="w-full max-w-sm">
      <div className="flex flex-col gap-1.5 py-6">
        <h1 className="font-semibold tracking-tight text-2xl">
          Xác thực đa yếu tố (MFA)
        </h1>
        <p className="text-muted-foreground text-sm">
          Tài khoản của bạn được đảm bảo bằng xác thực đa yếu tố (MFA). Để hoàn
          tất đăng nhập, hãy bật hoặc xem thiết bị MFA của bạn và nhập mã xác
          thực bên dưới.
        </p>
      </div>

      {error && error.status == "ERROR" ? (
        <p className="bg-red-100/70 text-sm text-red-600 p-2 mb-2 rounded-md">
          {error.message}
        </p>
      ) : null}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <div className="grid gap-6">
            <div className="grid gap-2">
              <p>
                <span className="font-medium text-sm">E-mail</span>:{" "}
                {mfaToken.email}
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
                onChange={(e) => {
                  setError(null);
                  setCode(e.target.value);
                }}
                value={code}
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
            onClick={() => {
              handleMFAToken(null);
            }}
          >
            Đăng nhập với tài khoản khác
          </button>
        </div>
      </form>
    </div>
  );
}

function SignInWrapper({
  email,
  oAuthError,
}: {
  email?: string;
  oAuthError?: string;
}) {
  const { mfaToken } = useSignIn();
  if (mfaToken) return <MFAForm />;

  return <SignInForm email={email} oAuthError={oAuthError} />;
}

export default function SignIn({
  email,
  oAuthError,
}: {
  email?: string;
  oAuthError?: string;
}) {
  return (
    <SignInProvider>
      <SignInWrapper email={email} oAuthError={oAuthError} />
    </SignInProvider>
  );
}
