import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import CreateLocationForm from "./form";
export const metadata: Metadata = {
  title: "Tạo Cơ Sở",
};
const CreateLocationPage = () => {
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
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbPage className="text-muted-foreground">
                  Cơ sở
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbLink href="/admin/locations">
                Danh sách cơ sở
              </BreadcrumbLink>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Tạo cơ sở mới</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className="h-[calc(100vh_-_48px)] w-full overflow-y-scroll relative">
        <div className="max-w-3xl mx-auto px-2 w-full py-4">
          <div className="bg-white rounded-lg p-2 px-3 shadow-md">
            <h3 className="font-bold lg:text-2xl text-lg">Tạo cơ sở mới</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Điền các trường bên dưới để tạo cơ sở.
            </p>
            <CreateLocationForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateLocationPage;
