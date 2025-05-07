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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../commons/dialog";
import { Input } from "../commons/input";

const VerifyEmail = () => {
  const [data, setData] = useStore1<Record<string, number>>("reSendEmailStore");
  const {
    isPending: userLoading,
    user,
    handleReSendVerifyEmail,
    handleUpdateOrSendOTPUpdateEmail,
  } = useUser();
  const [countDown, setCountDown] = React.useState<number>(0);
  const [isPendindReSendVerifyEmail, startTransition] = React.useTransition();

  const handleReSendEmail = () => {
    startTransition(async () => {
      const { isSuccess, message } = await handleReSendVerifyEmail();
      if (isSuccess) {
        setData({ ...data, [user!.email]: Date.now() });
        toast.success(message);
      } else {
        toast.error(message);
      }
    });
  };

  React.useEffect(() => {
    let timeId: NodeJS.Timeout | undefined;
    const time = user && data && data[user.email];
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
  }, [countDown, data, user]);

  const [email, setEmail] = React.useState<string>("");
  const [open, setOpen] = React.useState<boolean>(false);

  const [isPendindUpdateEmail, startTransition1] = React.useTransition();

  const handleUpdateEmail = () => {
    startTransition1(async () => {
      const { isSuccess, message } = await handleUpdateOrSendOTPUpdateEmail(
        email
      );
      if (isSuccess) {
        setEmail("");
        setOpen(false);
        toast.success(message);
      } else {
        toast.error(message);
      }
    });
  };

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
              <div className="flex flex-col items-center justify-center gap-6">
                <div className="flex flex-col min-[400px]:justify-center min-[400px]:flex-row gap-2">
                  <Skeleton className="h-9 w-[200px] min-[400px]:w-[80px] rounded-full" />
                  <Skeleton className="h-9 w-[200px] rounded-full" />
                </div>
                <Skeleton className="h-4 w-[200px] rounded-full" />
              </div>
            ) : (
              <div className=" flex flex-col items-center justify-center gap-6">
                <div className="flex flex-col min-[400px]:justify-center min-[400px]:flex-row gap-2">
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
                    onClick={handleReSendEmail}
                    disabled={
                      countDown > 0 ||
                      isPendindReSendVerifyEmail ||
                      !!user?.emailVerified
                    }
                    variant="outline"
                    className="rounded-full border-2 border-primary !text-primary font-bold"
                  >
                    Gửi lại
                    {isPendindReSendVerifyEmail ? (
                      <LoaderCircleIcon className="h-4 w-4 mr-2 animate-spin flex-shrink-0" />
                    ) : (
                      `${countDown > 0 ? ` (${countDown}s)` : ""} `
                    )}
                  </Button>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                  <Button
                    asChild
                    disabled={isPendindUpdateEmail}
                    variant="link"
                    className="cursor-pointer p-0 h-auto"
                    onClick={() => {
                      setEmail("");
                      setOpen(true);
                    }}
                  >
                    <p>Không nhận được email?</p>
                  </Button>
                  <DialogContent className="sm:max-w-screen-md gap-0">
                    <DialogHeader>
                      <DialogTitle className="text-xl">
                        Không nhận được email?
                      </DialogTitle>
                      <DialogDescription>
                        Dưới đây là một số lời khuyên để giúp bạn tìm thấy nó.
                      </DialogDescription>
                    </DialogHeader>

                    <ol className="[&>li]:mt-3 [&>li>span]:font-semibold">
                      <li>
                        <span>1. Gửi lại email</span>
                      </li>
                      <li>
                        <span>2. Tìm kiếm email</span>
                        <p className="text-muted-foreground text-sm">
                          Chúng tôi sẽ gửi email từ &#39;ICH&#39;, để bạn có thể
                          nhanh chóng tìm kiếm nó. Nếu nó không có trong hộp thư
                          đến của bạn, hãy kiểm tra các thư mục của bạn. Nếu bộ
                          lọc thư rác hoặc quy tắc email đã di chuyển email thì
                          email đó có thể nằm trong thư mục Thư rác (Spam or
                          Junk), Thùng rác (Trash), Mục đã xóa (Deleted Items)
                          hoặc Lưu trữ (Archive folder).
                        </p>
                      </li>
                      <li>
                        <span>3. Làm cách nào để xác nhận email của tôi?</span>
                        <p className="text-muted-foreground text-sm">
                          Nếu bạn không thể nhấp vào liên kết, hãy sao chép URL
                          đầy đủ từ email và dán vào cửa sổ trình duyệt web mới.
                        </p>
                      </li>
                      <li>
                        <span>4. Thay đổi email của bạn</span>
                      </li>
                    </ol>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdateEmail();
                      }}
                      className="flex flex-col sm:flex-row gap-2 mt-4"
                    >
                      <div>
                        <Input
                          name="email"
                          disabled={isPendindUpdateEmail}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          type="text"
                          placeholder="Email address"
                          className={cn(
                            user?.email === email
                              ? "focus-visible:ring-red-100 border-red-500 focus-visible:border-red-500 bg-red-50"
                              : ""
                          )}
                        />
                        {false && (
                          <p className="text-destructive font-light text-sm mt-1">
                            E-mail này đã được sử dụng
                          </p>
                        )}
                      </div>

                      <Button
                        disabled={isPendindUpdateEmail || user?.email === email}
                        variant="outline"
                        className="rounded-full border-2 border-primary !text-primary font-bold cursor-pointer"
                      >
                        {isPendindUpdateEmail && (
                          <LoaderCircleIcon className="h-4 w-4 animate-spin flex-shrink-0 mr-2" />
                        )}
                        Cập nhật
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
