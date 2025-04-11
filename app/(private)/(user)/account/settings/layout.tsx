"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useUser } from "../../../UserProvider";
import { DEFAULT_AVATAR } from "@/configs/constant";

const navs = [
  {
    label: "Hồ sơ",
    link: "/account/settings/profile",
    regex: /^\/account(\/settings(\/profile)?)?$/,
    description: "Cập nhật tên người dùng và quản lý tài khoản của bạn",
  },
  {
    label: "Mật khẩu & Bảo mật",
    link: "/account/settings/password&security",
    regex: /^\/account\/settings\/password&security$/,
    description: "Quản lý bảo mật tài khoản của bạn",
  },
  {
    label: "Địa chỉ",
    link: "/account/settings/address",
    regex: /^\/account\/settings\/address$/,
    description: "Quản lý địa chỉ của bạn",
  },
  {
    label: "Thông báo",
    link: "/account/settings/notifications",
    regex: /^\/account\/settings\/notifications$/,
    description: "Nhận thông báo về hoạt động",
  },
  {
    label: "Phiên đăng nhập",
    link: "/account/settings/sessions",
    regex: /^\/account\/settings\/sessions$/,
    description: "Quản lý phiên đăng nhập của bạn",
  },
];
const PrivateUserLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const { user } = useUser();

  const pathName = usePathname();

  const nav = React.useMemo(() => {
    return navs.find((nav) => nav.regex.test(pathName));
  }, [pathName]);

  return (
    <div className="p-4 sm:p-8 pb-10">
      <div className="mx-auto max-w-3xl py-8">
        <div className="flex items-center gap-2 mb-4">
          <Avatar className="h-16 w-16 rounded-full">
            <AvatarImage
              src={user?.avatar?.url || DEFAULT_AVATAR}
              alt={user?.username}
            />
            <AvatarFallback className="h-16 w-16 rounded-full">
              CN
            </AvatarFallback>
          </Avatar>
          <div className="text-muted-foreground">
            <div className="flex items-center gap-2">
              <p className="text-xl font-semibold text-black">
                {user?.username}
                {nav ? (
                  <>
                    <span className="mx-2 text-lg text-muted-foreground">
                      /
                    </span>
                    <span>{nav.label}</span>
                  </>
                ) : null}
              </p>
            </div>

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
  );
};

export default PrivateUserLayout;
