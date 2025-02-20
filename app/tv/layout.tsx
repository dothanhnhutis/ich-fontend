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
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import { PinIcon, PinOffIcon } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { cn } from "@/lib/utils";
import AdminSidebarFooter from "../admin/siderbar-footer";
const TvLayout = async ({
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
            <SidebarGroupLabel>Phòng ban</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="[&>svg:first-child]:size-5"
                  >
                    <div className="flex items-center group/item">
                      <p className="w-full">dsdssd</p>
                      <button
                        type="button"
                        className={cn(
                          true ? "" : "group-hover/item:block hidden"
                        )}
                      >
                        {true ? (
                          <PinOffIcon className="shrink-0 size-4" />
                        ) : (
                          <PinIcon className="shrink-0 size-4" />
                        )}
                      </button>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <AdminSidebarFooter />
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="bg-transparent">{children}</SidebarInset>
    </SidebarProvider>
  );
};

export default TvLayout;
