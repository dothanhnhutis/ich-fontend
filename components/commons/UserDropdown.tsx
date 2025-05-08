"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { LogOutIcon, SettingsIcon } from "lucide-react";

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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/commons/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/commons/dropdown-menu";
import { Skeleton } from "@/components/commons/skeleton";
import { useUser } from "@/libs/hooks/use-user";
import { DEFAULT_LOGOUT_REDIRECT } from "@/constants/routes";

const UserDropdownMenu = () => {
  const router = useRouter();
  const { user, isPending, logOut } = useUser();
  const [open, setOpen] = React.useState<boolean>(false);

  const handleSignOut = async () => {
    await logOut();
    router.push(DEFAULT_LOGOUT_REDIRECT);
  };
  if (isPending) return <Skeleton className="h-10 w-10 rounded-full" />;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="outline-none">
        <Avatar className="h-10 w-10">
          <AvatarImage
            referrerPolicy="no-referrer"
            src={user?.avatar || "/images/user-picture.jpg"}
          />
          <AvatarFallback className="bg-transparent">
            <Skeleton className="h-10 w-10 rounded-full" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent avoidCollisions align="end" className="w-[200px]">
        <DropdownMenuLabel className="flex flex-col items-center">
          <Avatar className="w-24 h-24">
            <AvatarImage
              referrerPolicy="no-referrer"
              src={user?.avatar || "/images/user-picture.jpg"}
            />
            <AvatarFallback className="bg-transparent">
              <Skeleton className="w-24 h-24 rounded-full" />
            </AvatarFallback>
          </Avatar>
          <p className="font-medium text-lg">{user?.username || "Error"}</p>
        </DropdownMenuLabel>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={(e) => e.preventDefault()}
            >
              <SettingsIcon className="h-4 w-4" />
              <span>Đóng tài khoản</span>
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will deactivate your account
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOutIcon className="h-4 w-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdownMenu;
