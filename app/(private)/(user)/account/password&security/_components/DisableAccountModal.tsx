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
import { useMutation } from "@tanstack/react-query";
import { disableAccountAction } from "../../actions";
import { toast } from "sonner";
import { LoaderCircleIcon } from "lucide-react";

const DisableAccountModal = () => {
  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      return await disableAccountAction();
    },
    onSuccess({ success, message }) {
      if (success) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    },
  });
  return (
    <div className="flex w-full gap-4 py-4">
      <div className="w-full">
        <p className="font-bold">Vô hiệu hoá tài khoản của tôi</p>
        <p className="text-xs font-normal leading-snug text-muted-foreground">
          Tạm thời đóng tài khoản, có thể kích hoạt lại khi cần.
        </p>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            disabled={false}
            className="rounded-full cursor-pointer"
            variant="destructive"
          >
            Vô hiệu hoá
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn không?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ vô hiệu hóa tài khoản của bạn. Tài khoản của bạn
              phải được kích hoạt khi bạn đăng nhập lại
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="[&>button]:cursor-pointer ">
            <AlertDialogAction
              onClick={() => mutate()}
              disabled={isPending}
              className="bg-destructive hover:bg-destructive/80 text-background"
            >
              {isPending ? (
                <LoaderCircleIcon className="size-4 animate-spin" />
              ) : null}
              Vô hiệu hoá
            </AlertDialogAction>
            <AlertDialogCancel disabled={isPending}>Huỷ</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DisableAccountModal;
