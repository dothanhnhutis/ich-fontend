"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { LoaderCircleIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { Button, buttonVariants } from "@/components/commons/button";
import { Input } from "@/components/commons/input";
import { Label } from "@/components/commons/label";
import { sendRecoverAccountAction } from "@/libs/actions/AuthActions";
type RecoverFormProps = {
  email?: string;
};

const RecoverForm = ({ email }: RecoverFormProps) => {
  const [formData, setFormData] = React.useState<string>(email || "");

  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      return await sendRecoverAccountAction(formData);
    },
    onSuccess({ isSuccess, message }) {
      setFormData("");
      if (isSuccess) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };
  return (
    <div
      className="flex flex-col flex-grow sm:flex-grow-0 sm:grid grid-cols-12 transition-all
  "
    >
      <div className="flex flex-col flex-grow sm:flex-grow-0 sm:col-start-3 sm:col-end-11 mx-auto w-full sm:max-w-[570px] p-4">
        <div className="flex flex-col flex-grow space-y-6">
          <div className="mt-10 mb-6 text-center">
            <div className="inline-flex w-[145px] h-[130px] min-w-[145px] min-h-[130px]">
              <Image
                src={"/mail.svg"}
                alt="mail"
                width={100}
                height={100}
                className="shrink-0 size-auto"
              />
            </div>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-center mt-4">
            <span>Lấy lại mật khẩu</span>
          </h1>
          <p className="text-center text-muted-foreground text-base">
            Nhập địa chỉ email tài khoản của bạn và chọn <strong>Gửi</strong>.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                value={formData}
                onChange={(e) => {
                  setFormData(e.target.value);
                }}
                id="email"
                type="email"
                required
                placeholder="example@gmail.com"
                className="focus-visible:ring-offset-0 focus-visible:ring-transparent"
              />
            </div>
            <div className="flex gap-1 justify-end items-center mt-4">
              <Link
                prefetch
                href="/login"
                className={buttonVariants({ variant: "link" })}
              >
                Huỷ bỏ
              </Link>

              <Button variant="default" disabled={isPending}>
                {isPending && (
                  <LoaderCircleIcon className="h-4 w-4 animate-spin flex-shrink-0 mr-2" />
                )}
                Gửi
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecoverForm;
