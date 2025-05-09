import React from "react";
import Image from "next/image";

import { cookies } from "next/headers";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/commons/sidebar";
import Link from "next/link";
import {
  BoxesIcon,
  ChevronRight,
  MapPinHouseIcon,
  MonitorIcon,
  NewspaperIcon,
  ShoppingBagIcon,
  SirenIcon,
  TvIcon,
  UsersIcon,
  UsersRoundIcon,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/commons/collapsible";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/commons/sidebar";
import AdminSidebarFooter from "./siderbar-footer";

const AdminLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
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
                      <MonitorIcon />
                      <span>Bảng điều khiển</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="[&>svg:first-child]:size-5"
                  >
                    <Link href={"/admin/locations"}>
                      <MapPinHouseIcon />
                      <span>Cơ sở</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="[&>svg:first-child]:size-5"
                  >
                    <Link href={"/admin/displays"}>
                      <TvIcon />
                      <span>Trình chiếu TV</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="[&>svg:first-child]:size-5"
                  >
                    <Link href={"/admin/customers"}>
                      <UsersRoundIcon />
                      <span>Khách hàng</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="[&>svg:first-child]:size-5"
                  >
                    <Link href={"/admin/orders"}>
                      <ShoppingBagIcon />
                      <span>Đơn hàng</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <Collapsible className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={"Đồng hồ"}
                        className="[&>svg:first-child]:size-5"
                      >
                        <SirenIcon className="shrink-0" />
                        <span>Đồng hồ</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <Link href={"/admin/clock/alarms"}>
                              <span>Báo thức</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <Link href={"/admin/clock/timers"}>
                              <span>Hẹn giờ</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
                <Collapsible className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={"Tivi"}
                        className="[&>svg:first-child]:size-5"
                      >
                        <UsersIcon className="shrink-0" />
                        <span>Người dùng & Vai trò</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <Link href={"/admin"}>
                              <span>Người dùng</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <Link href={"/admin"}>
                              <span>Vai trò</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
                <Collapsible className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={"Tivi"}
                        className="[&>svg:first-child]:size-5"
                      >
                        <NewspaperIcon className="shrink-0" />
                        <span>Bài viết</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <Link href={"/admin"}>
                              <span>Thể loại</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <Link href={"/admin"}>
                              <span>Blog</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <Link href={"/admin"}>
                              <span>Sản phẩm</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
                <SidebarMenuItem>
                  <SidebarMenuButton className="[&>svg:first-child]:size-5">
                    <BoxesIcon />
                    <span>Warehose</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <AdminSidebarFooter />
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="bg-transparent overflow-x-hidden">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
