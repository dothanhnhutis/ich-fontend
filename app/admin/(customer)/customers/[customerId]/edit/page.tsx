import React from "react";
import { Metadata } from "next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/commons/breadcrumb";
import { SidebarTrigger } from "@/components/commons/sidebar";
import { Separator } from "@/components/commons/separator";
import { getProductByIdAction } from "../../../../(admin)/customers/actions";
import { notFound } from "next/navigation";
import UpdateProductForm from "./form";
export const metadata: Metadata = {
  title: "Chỉnh sửa sản phẩm",
};
const UpdateProductPage = async (props: {
  params: Promise<{ productId: string }>;
}) => {
  const params = await props.params;
  const { data } = await getProductByIdAction(params.productId);
  if (!data) return notFound();

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
      </div>
      <div className="h-[calc(100vh_-_48px)] w-full overflow-y-scroll relative">
        <div className="max-w-3xl mx-auto px-2 w-full py-4">
          <div className="bg-white rounded-lg p-2 px-3 shadow-md">
            <h3 className="font-bold lg:text-2xl text-lg">
              Chỉnh sửa sản phẩm
            </h3>
            <UpdateProductForm product={data} />
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateProductPage;
