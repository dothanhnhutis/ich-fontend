import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Khách Hàng | Nguyễn Văn A",
};

const CustomerDetailPage = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <div className="bg-white flex shrink-0 items-center py-2 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1 size-8 [&_svg]:size-5" />
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block ">
                <BreadcrumbPage className="text-muted-foreground">
                  Khách hàng
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Danh sách khách hàng</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Nguyen Van A</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className="h-[calc(100vh_-_48px)] w-full overflow-y-scroll relative">
        <main className="max-w-7xl mx-auto px-2 w-full py-4">
          <div className="bg-white rounded-lg py-2 px-3 shadow-md">
            <div className="flex justify-between gap-2">
              <h3 className="font-bold lg:text-2xl text-lg">Nguyễn Văn A</h3>
            </div>
            <Separator className="my-1 h-4" />
            <div className="flex items-center text-sm gap-0.5">
              <button className="p-2 rounded-md hover:bg-accent">
                Sản phẩm (3)
              </button>
              <button className="p-2 rounded-md bg-accent">Kho (1)</button>
            </div>
          </div>
          {children}
        </main>
      </div>
    </>
  );
};

export default CustomerDetailPage;
