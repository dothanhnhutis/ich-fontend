"use client";
import React from "react";
import { useUser } from "../../../../UserProvider";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/commons/avatar";
import { Button } from "@/components/commons/button";
import { Input } from "@/components/commons/input";
import { Label } from "@/components/commons/label";

const ProfileForm = () => {
  const { user } = useUser();
  return (
    <div className="w-full">
      <div className="flex gap-2 items-center mb-4">
        <Avatar className="h-16 w-16 rounded-full">
          <AvatarImage
            src={user?.avatar?.url || "/user-picture.jpg"}
            alt={user?.username}
          />
          <AvatarFallback className="h-16 w-16 rounded-full">CN</AvatarFallback>
        </Avatar>
        <Button
          variant={"outline"}
          className="hover:bg-transparent cursor-pointer rounded-full shadow-none"
        >
          Upload new picture
        </Button>
        <Button variant={"secondary"} className="cursor-pointer rounded-full">
          Delete
        </Button>
      </div>
      <form className="grid gap-4">
        <div>
          <Label
            htmlFor="username"
            className="after:content-['*'] after:text-red-500"
          >
            Tên
          </Label>
          <Input id="username" name="username" />
        </div>
        <div>
          <Label htmlFor="birthday">Số điện thoại</Label>
          <Input id="birthday" name="birthday" />
        </div>
        <div>
          <Label htmlFor="birthday">Ngày sinh</Label>
          <Input id="birthday" name="birthday" />
        </div>
        <div>
          <Label htmlFor="birthday">Giới tính</Label>
          <Input id="birthday" name="birthday" />
        </div>
        <div className="flex items-center justify-end">
          <Button>Lưu thay đổi</Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
