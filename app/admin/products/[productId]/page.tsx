import React from "react";
import { Metadata } from "next";
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
export const metadata: Metadata = {
  title: "Chỉnh sửa sản phẩm",
};
const EditProductPage = async (props: {
  params: Promise<{ productId: string }>;
}) => {
  const params = await props.params;

  return (
    <>
      <header className="sticky top-0 z-[5] bg-white flex shrink-0 items-center py-2 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1 size-8 [&_svg]:size-5" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block ">
                <BreadcrumbPage className="text-muted-foreground">
                  Sản phẩm
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/products">
                  Danh sách sản phẩm
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Chỉnh sửa sản phẩm</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-2 w-full py-4">
        {" "}
        {params.productId}
      </main>
    </>
  );
};

export default EditProductPage;
