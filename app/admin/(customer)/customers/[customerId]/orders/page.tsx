"use server";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/commons/breadcrumb";
import { Separator } from "@/components/commons/separator";
import { SidebarTrigger } from "@/components/commons/sidebar";

import { getCustomerById } from "../../actions";
import { notFound } from "next/navigation";
import OrdersBody from "./order-body";

const OrdersPage = async (props: {
  params: Promise<{ customerId: string }>;
}) => {
  const params = await props.params;

  const customer = await getCustomerById(params.customerId);
  if (!customer) return notFound();
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
              <BreadcrumbItem>
                <BreadcrumbPage className="text-muted-foreground">
                  Khách hàng
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-muted-foreground">
                  {customer.cusName}
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Đặt hàng</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <OrdersBody customer={customer} />
    </>
  );
};

export default OrdersPage;
