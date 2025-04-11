"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DEFAULT_AVATAR } from "@/configs/constant";
import {
  Bell,
  BellIcon,
  CreditCard,
  LogOut,
  SettingsIcon,
  ShoppingBagIcon,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useUser } from "../../UserProvider";
import { usePathname } from "next/navigation";

const AccountLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const { user } = useUser();
  const pathName = usePathname();

  return (
    <>
      <div className="sticky top-0 left-0 right-0 z-50 bg-accent-foreground">
        <div className="flex items-center justify-between gap-2 px-2 sm:px-3 py-1 h-[64px] mx-auto max-w-7xl">
          <Link href={"/"}>
            <Image
              priority
              className="object-cover"
              src="/logo2.png"
              alt="logo"
              width={200}
              height={56}
            />
          </Link>

          <div className="flex items-center gap-2">
            {pathName != "/account/cart" ? (
              <button type="button" className="p-2 bg-white rounded-full">
                <ShoppingBagIcon className="shrink-0 w-5 h-5" />
              </button>
            ) : null}

            {pathName != "/account/notifications" ? (
              <button type="button" className="p-2 bg-white rounded-full">
                <BellIcon className="shrink-0 w-5 h-5 " />
              </button>
            ) : null}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 rounded-full">
                  <AvatarImage
                    src={user?.avatar?.url || DEFAULT_AVATAR}
                    alt={user?.username}
                  />
                  <AvatarFallback className="h-9 w-9 rounded-full">
                    CN
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="min-w-56 rounded-lg"
                side={"bottom"}
                align="end"
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={user?.avatar?.url || DEFAULT_AVATAR}
                        alt={user?.username}
                      />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.username}
                      </span>
                      <span className="truncate text-xs">{user?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Sparkles />
                    Upgrade to Pro
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <SettingsIcon />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      {children}
    </>
  );
};

export default AccountLayout;
