"use client";
import React from "react";
import { useUser } from "../../user-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ProfileForm = () => {
  const { state } = useUser();
  return (
    <div className="w-full">
      <div className="flex gap-2 items-center mb-4">
        <Avatar className="h-16 w-16 rounded-full">
          <AvatarImage
            src={state?.avatar?.url || "/user-picture.jpg"}
            alt={state?.username}
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
            User name
          </Label>
          <Input id="username" name="username" />
        </div>
        <div>
          <Label htmlFor="birthday">Email</Label>
          <Input id="birthday" name="birthday" />
        </div>
        <div>
          <Label htmlFor="birthday">Phone number</Label>
          <Input id="birthday" name="birthday" />
        </div>
        <div>
          <Label htmlFor="birthday">Birthday</Label>
          <Input id="birthday" name="birthday" />
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
