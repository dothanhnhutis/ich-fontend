import React from "react";
import { Metadata } from "next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/commons/breadcrumb";
import { SidebarTrigger } from "@/components/commons/sidebar";
import { Separator } from "@/components/commons/separator";
export const metadata: Metadata = {
  title: "Màn Hình Trình Chiếu",
};
const TvPage = () => {
  return (
    <>
      <header className="sticky top-0 z-[5] bg-white flex shrink-0 items-center py-2 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1 size-8 [&_svg]:size-5" />
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Phòng1</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
    </>
  );
};

export default TvPage;
