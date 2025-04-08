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

function SendBtn({ email, disabled }: { email: string; disabled?: boolean }) {
  const [countDown, setCountDown] = React.useState<number>(0);
  const [emailLocalStore, setEmailLocalStore] = useStore("changeEmail");

  const emailStore: { [index: string]: number } = React.useMemo(() => {
    console.log("emailLocalStore", emailLocalStore);
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
      setEmailLocalStore(
        JSON.stringify({ ...emailStore, [email]: Date.now() })
      );
    },
  });

  React.useEffect(() => {
    let timeId: NodeJS.Timeout;
    if (
      emailStore[email] &&
      Math.ceil((Date.now() - emailStore[email]) / 1000) > 0
    ) {
      timeId = setInterval(() => {
        setCountDown(60 - Math.ceil((Date.now() - emailStore[email]) / 1000));
      });
    } else {
      setCountDown(0);
    }

    return () => {
      clearInterval(timeId);
    };
  }, [email, emailStore, countDown]);

  const handleSend = () => {
    if (!disabled) {
      mutate();
    }
  };
  return (
    <button
      onClick={handleSend}
      disabled={disabled || countDown > 0}
      type="button"
      className="text-primary inline-block cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {countDown > 0 ? `Gửi ${countDown}` : "Gửi"}
    </button>
  );
}

const EmailModal = () => {
  const { state } = useUser();
  const [open, setOpen] = React.useState<boolean>(false);

  const [formData, setFormData] = React.useState<{
    email: string;
    otp: string;
  }>({
    email: "",
    otp: "",
  });
  const handleOnChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const { isPending, mutate } = useMutation({
    mutationFn: async function () {},
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("first");
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
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
                  state?.email == formData.email
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
                  true
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
                  disabled={!formData.email || state?.email == formData.email}
                />
              </div>
            </div>
          </div>

          <AlertDialogFooter className="[&>button]:cursor-pointer">
            <AlertDialogCancel>Huỷ</AlertDialogCancel>
            <AlertDialogAction
              type="submit"
              disabled={state?.email == formData.email}
            >
              Lưu
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EmailModal;
