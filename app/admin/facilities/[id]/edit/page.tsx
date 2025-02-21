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
import UpdateFacilityForm from "./form";
export const metadata: Metadata = {
  title: "Cập Nhật Cơ Sở",
};
const EditFacilityPage = () => {
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
              <BreadcrumbItem className="hidden md:block ">
                <BreadcrumbPage className="text-muted-foreground">
                  Cơ sở
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbLink href="/admin/facilities">
                Danh sách cơ sở
              </BreadcrumbLink>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Cập nhật cơ sở</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-2 w-full py-4">
        <div className="bg-white rounded-lg p-2 px-3 shadow-md">
          <h3 className="font-bold lg:text-2xl text-lg">Cập nhật cơ sở</h3>
          <UpdateFacilityForm
            data={{
              address:
                "Số 159 Nguyễn Đình Chiểu, Khóm 3, Phường 4, Thành phố Sóc Trăng, Tỉnh Sóc Trăng",
              location_name: "Công ty TNHH MTV TM Sản Xuất I.C.H	",
              location_type: "Factory",
              rooms: [
                {
                  room_id: "1",
                  room_name: "phong 1",
                  type: "init",
                },
                {
                  room_id: "2",
                  room_name: "phong 2",
                  type: "init",
                },
                {
                  room_id: "3",
                  room_name: "phong 3",
                  type: "init",
                },
              ],
              id: "test-123",
            }}
          />
        </div>
      </main>
    </>
  );
};

export default EditFacilityPage;
