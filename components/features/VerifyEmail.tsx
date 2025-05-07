"use client";
import { useUser } from "@/libs/hooks/use-user";
import Image from "next/image";
import React from "react";
import { Skeleton } from "../commons/skeleton";
import Link from "next/link";
import cn from "@/utils/cn";
import { Button, buttonVariants } from "../commons/button";
import { LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { useStore, useStore1 } from "@/libs/hooks/use-store";

const VerifyEmail = () => {
  const [data, setData] = useStore1("reSendEmailStore");
  const { isPending: userLoading, user, handleReSendVerifyEmail } = useUser();
  const [countDown, setCountDown] = React.useState<number>(0);
  const [isPendindReSendVerifyEmail, startTransition] = React.useTransition();

  setData("adasd");

  const handleReSendEmail = () => {
    startTransition(async () => {
      setCountDown(60);

      //   const { isSuccess, message } = await handleReSendVerifyEmail();
      //   if (isSuccess) {
      //     setCountDown(60);
      //     toast.success(message);
      //   } else {
      //     toast.error(message);
      //   }
    });
  };

  React.useEffect(() => {
    let timeId: NodeJS.Timeout;
    timeId = setTimeout(() => {
      if (countDown == 1) {
        setCountDown(0);
        clearTimeout(timeId);
      } else {
        setCountDown(countDown - 1);
      }
    }, 1000);
    return () => {
      clearTimeout(timeId);
    };
  }, [countDown]);

  return (
    <div className="flex flex-col flex-grow sm:flex-grow-0 sm:grid grid-cols-12 transition-all">
      <div className="flex flex-col flex-grow sm:flex-grow-0 sm:col-start-3 sm:col-end-11 mx-auto w-full sm:max-w-screen-sm p-4">
        <div className="flex flex-col flex-grow space-y-6">
          <div className="mt-10 mb-6 text-center">
            <div className="inline-flex w-[145px] h-[130px] min-w-[145px] min-h-[130px]">
              <Image
                src={"/verify-mail.svg"}
                alt="mail"
                width={100}
                height={100}
                className="shrink-0 size-auto"
              />
            </div>
          </div>
          <div className="space-y-6">
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
              Vui lòng kiểm tra email của bạn và bấm liên kết được cung cấp để
              xác minh địa chỉ của bạn.
            </p>
            {userLoading ? (
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
                  onClick={handleReSendEmail}
                  disabled={countDown > 0 || isPendindReSendVerifyEmail}
                  variant="outline"
                  className="rounded-full border-2 border-primary !text-primary font-bold w-[80px]"
                >
                  {isPendindReSendVerifyEmail && (
                    <LoaderCircleIcon className="h-4 w-4 mr-2 animate-spin flex-shrink-0" />
                  )}
                  Gửi lại {countDown > 0 && `(${countDown}s)`}
                </Button>
              </div>
            )}
          </div>
          {/* <ReplaceEmailForm /> */}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
