"use client";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useUser } from "@/app/(private)/user-provider";
import { useMutation } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { sendOTPUpdateEmailAction, updateEmailByOTPAction } from "./actions";
import { LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";

function SendBtn({ email, disabled }: { email: string; disabled?: boolean }) {
  const [countDown, setCountDown] = React.useState<number>(0);
  const [emailLocalStore, setEmailLocalStore] = useStore("changeEmail");

  const emailStore: { [index: string]: number } = React.useMemo(() => {
    const regex =
      /^\{\s*("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"\s*:\s*\d+\s*,\s*)*("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"\s*:\s*\d+)\s*\}$/;
    if (
      emailLocalStore &&
      typeof emailLocalStore == "string" &&
      regex.test(emailLocalStore)
    )
      return JSON.parse(emailLocalStore);
    return {};
  }, [emailLocalStore]);

  const { isPending, mutate } = useMutation({
    mutationFn: async function () {
      await sendOTPUpdateEmailAction(email);
    },
    onSuccess() {
      setEmailLocalStore(
        JSON.stringify({ ...emailStore, [email]: Date.now() })
      );
    },
  });

  React.useEffect(() => {
    let timeId: NodeJS.Timeout | undefined;
    if (
      emailStore[email] &&
      60 - Math.ceil((Date.now() - emailStore[email]) / 1000) > 0
    ) {
      timeId = setInterval(() => {
        setCountDown(60 - Math.ceil((Date.now() - emailStore[email]) / 1000));
      });
    } else {
      setCountDown(0);
      if (timeId) clearInterval(timeId);
    }
    return () => {
      if (timeId) clearInterval(timeId);
    };
  }, [email, emailStore, countDown]);

  const handleSend = () => {
    if (!disabled) {
      mutate();
    }
  };

  if (countDown > 0) {
    return (
      <span className="shrink-0 text-xs text-muted-foreground">{`Gửi (${countDown})`}</span>
    );
  }

  return (
    <button
      onClick={handleSend}
      disabled={disabled || isPending}
      type="button"
      className="text-primary inline-flex gap-0.5 cursor-pointer text-xs disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Gửi
      {isPending ? (
        <LoaderCircleIcon className="shrink w-4 h-4 animate-spin" />
      ) : null}
    </button>
  );
}

const EmailModal = () => {
  const { user, isPending: isPendingUser, refetch } = useUser();
  const [open, setOpen] = React.useState<boolean>(false);

  const [formData, setFormData] = React.useState<{
    email: string;
    otp: string;
  }>({
    email: "",
    otp: "",
  });

  const { data, isPending, mutate, reset } = useMutation({
    mutationFn: async function () {
      return await updateEmailByOTPAction(formData);
    },
    onSuccess({ success, message }) {
      if (!success) {
        toast.error(message);
      } else {
        refetch();
        toast.success(message);
        setOpen(false);
        setFormData({ email: "", otp: "" });
      }
    },
  });
  const handleOnChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name == "otp") {
      reset();
    }
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
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
        <div className="text-sm">
          <p className="font-medium">
            {isPendingUser ? (
              <LoaderCircleIcon className="text-muted-foreground shrink w-4 h-4 animate-spin" />
            ) : (
              user?.email
            )}
          </p>
          <div className="text-green-500">Verified</div>
        </div>

        <AlertDialog
          open={open}
          onOpenChange={(open) => {
            if (open) {
              setFormData({ email: "", otp: "" });
              setOpen(open);
            }
          }}
        >
          <AlertDialogTrigger asChild>
            <Button className="rounded-full cursor-pointer" variant="outline">
              Thay đổi
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Thay đổi địa chỉ email</AlertDialogTitle>
              <AlertDialogDescription className="hidden"></AlertDialogDescription>
            </AlertDialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-6 items-center gap-4">
                  <Label htmlFor="email" className="text-right col-span-2">
                    E-mail
                  </Label>
                  <Input
                    value={formData.email}
                    onChange={handleOnChangeInput}
                    id="email"
                    name="email"
                    required
                    className={cn(
                      "col-span-4",
                      user?.email == formData.email
                        ? "border-red-500 bg-red-50 outline-red-50 ring-red-50"
                        : ""
                    )}
                    type="email"
                  />
                </div>
                <div className="grid grid-cols-6 items-center gap-4">
                  <Label htmlFor="otp" className="text-right col-span-2">
                    Mã xác thực
                  </Label>

                  <div
                    className={cn(
                      "flex items-center gap-2 col-span-4 px-3 py-1 h-9 border rounded-md focus-within:ring-4 focus-within:outline-1 ring-ring/10",
                      data && !data.success
                        ? "border-red-500 bg-red-50 outline-red-50 ring-red-50"
                        : ""
                    )}
                  >
                    <input
                      value={formData.otp}
                      onChange={handleOnChangeInput}
                      id="otp"
                      name="otp"
                      required
                      maxLength={6}
                      type="text"
                      className={cn(
                        "w-full h-full text-base md:text-sm focus-visible:ring-0 focus-visible:outline-0"
                      )}
                    />
                    <SendBtn
                      email={formData.email}
                      disabled={
                        !formData.email || user?.email == formData.email
                      }
                    />
                  </div>
                </div>
              </div>

              <AlertDialogFooter className="[&>button]:cursor-pointer">
                <AlertDialogCancel
                  disabled={isPending}
                  onClick={() => setOpen(false)}
                >
                  Huỷ
                </AlertDialogCancel>
                <AlertDialogAction
                  type="submit"
                  disabled={
                    user?.email == formData.email ||
                    isPending ||
                    (data && !data.success)
                  }
                >
                  Lưu
                  {isPending ? (
                    <LoaderCircleIcon className="shrink w-4 h-4 animate-spin" />
                  ) : null}
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default EmailModal;
