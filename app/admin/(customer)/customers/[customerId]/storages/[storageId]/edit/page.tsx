import React from "react";
import StorageForm from "../../storage-form";
import { getStorageOfCustomer } from "../../actions";
import { notFound } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/commons/breadcrumb";
import { SidebarTrigger } from "@/components/commons/sidebar";
import { Separator } from "@/components/commons/separator";

const EditCustomerStoragePage = async (props: {
  params: Promise<{ customerId: string; storageId: string }>;
}) => {
  const params = await props.params;

  const storage = await getStorageOfCustomer(
    params.customerId,
    params.storageId
  );

  if (!storage) return notFound();

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
              {/* <BreadcrumbItem>
          <BreadcrumbPage className="text-muted-foreground">
            Khách hàng
          </BreadcrumbPage>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Nguyen Van A</BreadcrumbPage>
        </BreadcrumbItem>
        <BreadcrumbSeparator /> */}
              <BreadcrumbItem>
                <BreadcrumbPage>Kho</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Chỉnh sửa kho</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className="h-[calc(100vh_-_48px)] w-full overflow-y-scroll relative">
        <div className="max-w-3xl mx-auto px-2 w-full py-4">
          <div className="bg-white rounded-lg p-2 px-3 shadow-md">
            <h3 className="font-bold lg:text-2xl text-lg">Chỉnh sửa kho</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Chỉnh sửa thông tin kho hàng của khách
            </p>
            <StorageForm customerId={params.customerId} storage={storage} />
          </div>
        </div>
      </div>
    </>
  );
};

export default EditCustomerStoragePage;
