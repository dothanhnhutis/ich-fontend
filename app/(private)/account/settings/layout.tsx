"use client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/commons/avatar";

import cn from "@/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { DEFAULT_AVATAR, USERNAME_MAX_LENGTH } from "@/constants/user";
import { useUser } from "@/libs/hooks/use-user";
import { Skeleton } from "@/components/commons/skeleton";

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
              src={user?.avatar || DEFAULT_AVATAR}
              alt={user?.username}
            />
            <AvatarFallback className="h-16 w-16 rounded-full">
              <Skeleton className="h-16 w-16 rounded-full" />
            </AvatarFallback>
          </Avatar>
          <div className="text-muted-foreground">
            <div className="flex items-center gap-2">
              <p className="text-xl font-semibold text-black relative">
                <span>
                  {user
                    ? user.username.length <= USERNAME_MAX_LENGTH
                      ? user.username
                      : `${user.username
                          .substring(0, USERNAME_MAX_LENGTH)
                          .trim()}...`
                    : "Me"}
                </span>
                <span className="px-2">/</span>
                {nav ? <span>{nav.label}</span> : null}
              </p>
            </div>

            <p className="text-sm">{nav?.description}</p>
          </div>
        </div>
        <div className="md:flex md:gap-4">
          <div className="flex gap-2 overflow-x-scroll md:overflow-visible md:block md:w-[200px] pb-1 mb-4">
            {navs.map((nav1, index) => (
              <Link
                key={index}
                href={nav1.link}
                className={cn(
                  "md:py-2 md:px-0 px-2 py-1 rounded-lg text-[15px] whitespace-nowrap block",
                  nav1.link == nav?.link
                    ? "font-bold bg-accent md:bg-transparent"
                    : ""
                )}
              >
                {nav1.label}
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
