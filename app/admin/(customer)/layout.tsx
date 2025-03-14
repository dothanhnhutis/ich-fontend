import React from "react";
import { cookies } from "next/headers";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftToLineIcon,
  ShoppingBagIcon,
  SprayCanIcon,
  WarehouseIcon,
} from "lucide-react";

const CustomerManagerLayout = async (
  props: Readonly<{
    children: React.ReactNode;
  }>
) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen} className="bg-gray-100">
      <Sidebar className="[&_>_div[data-sidebar='sidebar']]:bg-white">
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="logo.png"
              width="100"
              height="100"
              className="size-14 shrink-0"
            />
            <h3 className="text-lg font-bold text-back">
              Công ty TNHH MTV TM Sản Xuất I.C.H
            </h3>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Quản trị</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="[&>svg:first-child]:size-5"
                  >
                    <Link href={"/admin"}>
                      <SprayCanIcon />
                      <span>Sản phẩm</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="[&>svg:first-child]:size-5"
                  >
                    <Link href={"/admin/locations"}>
                      <WarehouseIcon />
                      <span>Kho</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="[&>svg:first-child]:size-5"
                  >
                    <Link href={"/admin/locations"}>
                      <ShoppingBagIcon />
                      <span>Đặt hàng</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="[&>svg:first-child]:size-5"
                  >
                    <Link href={"/admin/customers"}>
                      <ArrowLeftToLineIcon />
                      <span>Trở về</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarRail />
      </Sidebar>
      <SidebarInset className="bg-transparent overflow-x-hidden">
        {props.children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default CustomerManagerLayout;
