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
import { cn } from "@/lib/utils";
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
import { usePathname } from "next/navigation";
import React from "react";
import { useUser } from "../user-provider";

const navs = [
  {
    label: "Profile",
    link: "/account",
    description: "Update your username and manage your account",
  },
  {
    label: "Password & Security",
    link: "/account/password&security",
    description: "Manage your password",
  },
  {
    label: "Address",
    link: "/account/address",
    description: "Manage your address",
  },
  {
    label: "Notification",
    link: "/account/notification",
    description: "Get notified of activity",
  },
  {
    label: "Sessions",
    link: "/account/session",
    description: "Manage your sessions",
  },
];

const PrivateUserLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const { state } = useUser();
  const currentUser = {
    username: "Do Thanh Nhut",
    image:
      "https://res.cloudinary.com/dr1ntj4ar/image/upload/v1724856906/avatar.jpg",
    email: "dothanhnhutis@gmail.com",
  };
  const pathName = usePathname();

  const nav = React.useMemo(() => {
    return navs.find((nav) => nav.link == pathName);
  }, [pathName]);

  return (
    <div>
      <div className="sticky top-0 left-0 right-0 flex items-center justify-between gap-2 px-2 sm:px-3 py-1 h-[64px] bg-accent-foreground">
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
          <button type="button" className="p-2 bg-white rounded-full">
            <ShoppingBagIcon className="shrink-0 w-5 h-5" />
          </button>
          <button type="button" className="p-2 bg-white rounded-full">
            <BellIcon className="shrink-0 w-5 h-5 " />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-9 w-9 rounded-full">
                <AvatarImage
                  src={currentUser?.image || "/user-picture.jpg"}
                  alt={currentUser?.username}
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
                      src={currentUser?.image || "/user-picture.jpg"}
                      alt={currentUser?.username}
                    />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {currentUser?.username}
                    </span>
                    <span className="truncate text-xs">
                      {currentUser?.email}
                    </span>
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

      <div className="p-4 sm:p-8 pb-10">
        <div className="mx-auto max-w-3xl py-8">
          <div className="flex items-center gap-2 mb-4">
            <Avatar className="h-16 w-16 rounded-full">
              <AvatarImage
                src={currentUser?.image || "/user-picture.jpg"}
                alt={currentUser?.username}
              />
              <AvatarFallback className="h-16 w-16 rounded-full">
                CN
              </AvatarFallback>
            </Avatar>
            <div className="text-muted-foreground">
              <h4 className="text-2xl font-bold text-black">
                {state?.username}
              </h4>
              <p className="text-sm">{nav?.description}</p>
            </div>
          </div>
          <div className="md:flex md:gap-4">
            <div className="flex gap-2 overflow-x-scroll md:overflow-visible md:block md:w-[200px] pb-1 mb-4">
              {navs.map((nav, index) => (
                <Link
                  key={index}
                  href={nav.link}
                  className={cn(
                    "md:py-2 md:px-0 px-2 py-1 rounded-lg text-[15px] whitespace-nowrap block",
                    pathName == nav.link
                      ? "font-bold bg-accent md:bg-transparent"
                      : ""
                  )}
                >
                  {nav.label}
                </Link>
              ))}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateUserLayout;
