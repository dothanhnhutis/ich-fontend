"use client";
import { Button, buttonVariants } from "@/components/commons/button";
import cn from "@/utils/cn";
import { LoaderCircleIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";
// import { reSendEmailAction } from "../actions";
import { useUser } from "@/libs/hooks/use-user";

const SendVerifyEmail = () => {
  const { user } = useUser();
  // const [time, setTime] = useCountDown("reSendEmail", user?.email || "");

  const [countDown, setCountDown] = React.useState<number>(0);

  const [message, formAction, isPending] = React.useActionState<string | null>(
    () => {
      return null;
    },
    null
  );
  React.useEffect(() => {
    if (message && countDown == 0) {
      setCountDown(60);
      toast.success(message);
    }
  }, [message, countDown, setCountDown]);
  console.log(message);

  return (
    <form action={formAction} className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-center mt-4">
        <span>Xác minh email của bạn để tiếp tục</span>
      </h1>
      <div className="text-center text-muted-foreground text-base">
        Chúng tôi vừa gửi email đến địa chỉ:{" "}
        <strong className="block md:inline">{user?.email}</strong>
      </div>
      <p className="text-center text-muted-foreground text-base">
        Vui lòng kiểm tra email của bạn và bấm liên kết được cung cấp để xác
        minh địa chỉ của bạn.
      </p>
      <div className="flex flex-col sm:justify-center sm:flex-row gap-2">
        <Link
          target="_blank"
          href="https://gmail.com/"
          className={cn(
            buttonVariants({ variant: "default" }),
            "rounded-full order-last font-bold"
          )}
        >
          Đi tới Hộp thư đến Gmail
        </Link>
        <Button
          disabled={countDown > 0 || isPending}
          variant="outline"
          className="rounded-full border-2 border-primary !text-primary font-bold"
        >
          {isPending && (
            <LoaderCircleIcon className="h-4 w-4 mr-2 animate-spin flex-shrink-0" />
          )}
          Gửi lại {countDown > 0 && `(${countDown}s)`}
        </Button>
      </div>
    </form>
  );
};

export default SendVerifyEmail;
