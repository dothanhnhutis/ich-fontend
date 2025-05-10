"use client";
import React, { FormEvent } from "react";
import * as z from "zod";
import { toast } from "sonner";
import { LoaderCircleIcon } from "lucide-react";

import cn from "@/utils/cn";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/commons/alert-dialog";
import { Button } from "@/components/commons/button";
import { Label } from "@/components/commons/label";
import { Input } from "@/components/commons/input";
import { useStore1 } from "@/libs/hooks/use-store";
import { useUser } from "@/libs/hooks/use-user";
import {
  sendOTPUpdateEmailAction,
  updateEmailByOTPAction,
} from "@/libs/actions/UserActions";

const formSchema = z.object({
  email: z.string().email("E-mail không hợp lệ"),
  otp: z.string().length(6, "Mã xác thực không hợp lệ"),
});

function EmailModal() {
  const { user } = useUser();
  const [emailLocalStore, setEmailLocalStore] =
    useStore1<Record<string, number>>("changeEmail");
  const [emailExists, setEmailExists] = React.useState<string[]>([]);
  const [countDown, setCountDown] = React.useState<number>(0);
  const [open, setOpen] = React.useState<boolean>(false);
  const [otpError, setOTPError] = React.useState<boolean>(false);

  const [formData, setFormData] = React.useState<{
    email: string;
    otp: string;
  }>({
    email: "",
    otp: "",
  });

  React.useEffect(() => {
    let timeId: NodeJS.Timeout | undefined;
    const time =
      formData.email && emailLocalStore && emailLocalStore[formData.email];
    if (time && 60 - Math.ceil((Date.now() - time) / 1000) > 0) {
      timeId = setInterval(() => {
        setCountDown(60 - Math.ceil((Date.now() - time) / 1000));
      });
    } else {
      setCountDown(0);
      if (timeId) clearInterval(timeId);
    }
    return () => {
      if (timeId) clearInterval(timeId);
    };
  }, [countDown, emailLocalStore, formData.email]);

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.name == "otp") {
      const numberRegex = /^\d{0,6}$/;
      const number = numberRegex.test(e.target.value)
        ? e.target.value
        : formData.otp;
      setFormData((prev) => ({ ...prev, otp: number }));
    } else {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
    setOTPError(false);
  }

  const emailError = React.useMemo(() => {
    return (
      user?.email == formData.email || emailExists.includes(formData.email)
    );
  }, [formData.email, emailExists]);

  const [isSendOTPPending, startTransition] = React.useTransition();

  function handleSendOTP() {
    startTransition(async () => {
      if (emailError) return;
      const invalidEmail = formSchema.shape.email.safeParse(formData.email);
      if (invalidEmail.success == false) {
        toast.error(invalidEmail.error.issues[0].message);
        return;
      }

      const { isSuccess, message } = await sendOTPUpdateEmailAction(
        formData.email
      );
      if (isSuccess) {
        setEmailLocalStore({
          ...emailLocalStore,
          [formData.email]: Date.now(),
        });
        toast.success(message);
      } else {
        setEmailExists((prev) => [...prev, formData.email]);
        toast.error(message);
      }
    });
  }

  const [isSubmitting, startTransitionSubmit] = React.useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const invalidEmail = formSchema.shape.otp.safeParse(formData.otp);
    if (invalidEmail.success == false) {
      toast.error(invalidEmail.error.issues[0].message);
      setOTPError(true);
      return;
    }
    startTransitionSubmit(async () => {
      const { isSuccess, message } = await updateEmailByOTPAction(formData);
      if (!isSuccess) {
        toast.error(message);
        setOTPError(true);
      } else {
        setOpen(false);
        setFormData({ email: "", otp: "" });
        toast.success(message);
      }
    });
  };

  return (
    <div className="flex flex-col lg:flex-row w-full gap-4 border-b py-4">
      <div className="w-full">
        <p className="font-bold">Email address</p>
        <p className="text-xs font-normal leading-snug text-muted-foreground">
          Quản lý email đăng nhập và liên kết với tài khoản của bạn.
        </p>
      </div>

      <div className="flex gap-4 items-center justify-between w-full">
        {user ? (
          <div className="text-sm">
            {user.emailVerified ? (
              <>
                <p className="font-medium">{user.email}</p>
                <p className="font-medium text-green-500">Đã xác thực</p>
              </>
            ) : (
              <>
                <p className="font-medium">{user.email}</p>
                <p className="font-medium text-destructive">
                  Chưa xác thực
                </p>{" "}
              </>
            )}
          </div>
        ) : (
          <LoaderCircleIcon className="text-muted-foreground shrink w-4 h-4 animate-spin" />
        )}

        <AlertDialog
          open={open}
          onOpenChange={(v) => {
            if (isSubmitting) return;
            setOpen(v);
          }}
        >
          <AlertDialogTrigger asChild>
            <Button className="rounded-full cursor-pointer" variant="outline">
              Thay đổi
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <AlertDialogHeader>
                <AlertDialogTitle>Thay đổi địa chỉ email</AlertDialogTitle>
                <AlertDialogDescription className="hidden"></AlertDialogDescription>
              </AlertDialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid min-[400px]:grid-cols-4 items-center min-[400px]:gap-4 gap-2">
                  <Label
                    htmlFor="email"
                    className="inline min-[400px]:text-right"
                  >
                    E-mail
                  </Label>
                  <Input
                    required
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleOnChange}
                    className={cn(
                      "min-[400px]:col-span-3",
                      emailError
                        ? "border-red-500 bg-red-50 ring-red-50 focus-visible:border-red-500 focus-visible:ring-red-100"
                        : ""
                    )}
                  />
                </div>

                <div className="grid min-[400px]:grid-cols-4 items-center min-[400px]:gap-4 gap-2">
                  <Label
                    htmlFor="otp"
                    className="inline min-[400px]:text-right"
                  >
                    Mã xác thực
                  </Label>
                  <div
                    className={cn(
                      "flex items-center gap-3 border rounded-md h-9 py-1 px-3 min-[400px]:col-span-3 focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
                      otpError
                        ? "border-red-500 focus-within:border-red-500 bg-red-50 focus-within:ring-red-100"
                        : ""
                    )}
                  >
                    <input
                      required
                      type="text"
                      id="otp"
                      name="otp"
                      maxLength={6}
                      value={formData.otp}
                      onChange={handleOnChange}
                      className="h-full w-full focus-within:outline-none"
                    />

                    {countDown > 0 ? (
                      <p className="shrink-0 text-muted-foreground text-sm">
                        {`Gửi (${countDown}s)`}
                      </p>
                    ) : (
                      <button
                        onClick={handleSendOTP}
                        tabIndex={-1}
                        disabled={emailError || isSendOTPPending}
                        type="button"
                        className="shrink-0 flex items-center gap-2 text-sm text-primary cursor-pointer disabled:text-muted-foreground disabled:cursor-not-allowed"
                      >
                        Gửi
                        {isSendOTPPending ? (
                          <LoaderCircleIcon className="h-4 w-4 animate-spin flex-shrink-0" />
                        ) : null}
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Huỷ</AlertDialogCancel>
                <Button
                  className="cursor-pointer"
                  disabled={isSubmitting || emailError || otpError}
                >
                  Cập nhật
                  {isSubmitting ? (
                    <LoaderCircleIcon className="h-4 w-4 animate-spin flex-shrink-0" />
                  ) : null}
                </Button>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default EmailModal;
