"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const EmailModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-full cursor-pointer" variant="outline">
          Thay đổi
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thay đổi địa chỉ email</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-6 items-center gap-4">
            <Label htmlFor="name" className="text-right col-span-2">
              Địa chỉ email mới
            </Label>
            <Input id="name" className="col-span-4" />
          </div>
          <div className="grid grid-cols-6 items-center gap-4">
            <Label htmlFor="username" className="text-right col-span-2">
              Mã xác thực
            </Label>
            <div className="flex items-center gap-2 col-span-4 px-3 py-1 h-9 border rounded-md focus-within:ring-4 focus-within:outline-1 ring-ring/10">
              <input
                type="text"
                className="w-full h-full text-base md:text-sm focus-visible:ring-0 focus-visible:outline-0"
              />
              <button
                type="button"
                className="text-primary cursor-pointer text-sm "
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Lưu thay đổi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailModal;
