"use client";
import { Button, buttonVariants } from "@/components/commons/button";
import cn from "@/utils/cn";
import { LoaderCircleIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";
// import { reSendEmailAction } from "../actions";
import { useUser } from "@/libs/hooks/use-user";
import { Skeleton } from "@/components/commons/skeleton";

const SendVerifyEmail = () => {
  const { user, isPending: userLoading } = useUser();
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

  return (
    <form action={formAction} className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-center mt-4">
        <span>Xác minh email của bạn để tiếp tục</span>
      </h1>
      <div className="text-center text-muted-foreground text-base flex items-center justify-center flex-wrap gap-2">
        <p>Chúng tôi vừa gửi email đến địa chỉ:</p>
        {userLoading ? (
          <Skeleton className="h-4 w-40 block md:inline-block" />
        ) : (
          <strong className="block md:inline truncate max-w-[300px]">
            {user?.email}
          </strong>
        )}
      </div>
      <p className="text-center text-muted-foreground text-base">
        Vui lòng kiểm tra email của bạn và bấm liên kết được cung cấp để xác
        minh địa chỉ của bạn.
      </p>
      {true ? (
        <div className="flex flex-col sm:justify-center sm:flex-row gap-2">
          <Skeleton className="h-9 w-[80px] rounded-full" />
          <Skeleton className="h-9 w-[200px] rounded-full" />
        </div>
      ) : (
        <div className="flex flex-col sm:justify-center sm:flex-row gap-2">
          <Link
            target="_blank"
            href="https://gmail.com/"
            className={cn(
              buttonVariants({ variant: "default" }),
              "rounded-full order-last font-bold w-[200px]"
            )}
          >
            Đi tới Hộp thư đến Gmail
          </Link>
          <Button
            disabled={countDown > 0 || isPending}
            variant="outline"
            className="rounded-full border-2 border-primary !text-primary font-bold w-[80px]"
          >
            {isPending && (
              <LoaderCircleIcon className="h-4 w-4 mr-2 animate-spin flex-shrink-0" />
            )}
            Gửi lại {countDown > 0 && `(${countDown}s)`}
          </Button>
        </div>
      )}
    </form>
  );
};

export default SendVerifyEmail;
