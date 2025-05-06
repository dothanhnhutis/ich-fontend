"use client";
import { Button } from "@/components/commons/button";
import { Account } from "@/types/user";
import cn from "@/utils/cn";
import React from "react";
import { FcGoogle } from "react-icons/fc";

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
} from "@/components/commons/alert-dialog";
import { toast } from "sonner";
import { useUser } from "@/libs/hooks/use-user";

function LinkGoogleAccount({
  linkData,
  hasPassword,
}: {
  linkData?: Account;
  hasPassword?: boolean;
}) {
  // const { isPending, mutate } = useMutation({
  //   mutationFn: async () => {
  //     return await disableAccountAction();
  //   },
  //   onSuccess({ success, message }) {
  //     if (success) {
  //       toast.success(message);
  //     } else {
  //       toast.error(message);
  //     }
  //   },
  // });

  return (
    <div className="flex items-center gap-4 justify-between">
      <div
        className={cn("flex items-center gap-2", linkData ? "" : "opacity-50")}
      >
        <div className="p-0.5 bg-white rounded-full shadow dark:shadow-none text-primary">
          <FcGoogle className="size-9" />
        </div>
        <p className="font-medium">Google</p>
      </div>
      {linkData ? (
        hasPassword ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="rounded-full cursor-pointer" variant="outline">
                Ngắt kết nối
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bạn có chắc chắn không?</AlertDialogTitle>
                <AlertDialogDescription>
                  Thao tác này sẽ xoá liên kết tài khoản của bạn với google và
                  bạn không thể đăng nhập bằng google.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction className="bg-destructive hover:bg-destructive/80 text-background">
                  Ngắt kết nối
                </AlertDialogAction>
                <AlertDialogCancel>Huỷ</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Button
            onClick={() => {
              toast.warning(
                "Ngắt liên kết với Google thất bại. Thiết lập mật khẩu trước khi ngắt liên kết."
              );
            }}
            className="rounded-full cursor-pointer"
            variant="outline"
          >
            Ngắt kết nối
          </Button>
        )
      ) : (
        <Button className="rounded-full cursor-pointer" variant="outline">
          Kết nối
        </Button>
      )}
    </div>
  );
}

const Linked = ({ links }: { links: Account[] }) => {
  const { user } = useUser();
  return (
    <div className="block w-full border-b py-4">
      <p className="font-bold">Tài khoản được kết nối</p>
      <p className="text-xs font-normal leading-snug text-muted-foreground">
        Đăng nhập nhanh chóng bằng các tài khoản khác.
      </p>
      <div className="grid gap-2 mt-2">
        <LinkGoogleAccount
          linkData={links.find(({ provider }) => provider == "google")}
          hasPassword={user?.hasPassword}
        />
      </div>
    </div>
  );
};

export default Linked;
