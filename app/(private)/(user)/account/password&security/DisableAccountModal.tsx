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

const DisableAccountModal = () => {
  return (
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
        <AlertDialogFooter>
          <AlertDialogAction className="bg-destructive hover:bg-destructive/80 text-background">
            Vô hiệu hoá
          </AlertDialogAction>
          <AlertDialogCancel>Huỷ</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DisableAccountModal;
