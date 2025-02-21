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
import { getFacilityById } from "../../action";
import { notFound } from "next/navigation";
export const metadata: Metadata = {
  title: "Chỉnh Sửa Cơ Sở",
};
const UpdateFacilityPage = async (props: {
  params: Promise<{ facilityId: string }>;
}) => {
  const params = await props.params;

  const facility = await getFacilityById(params.facilityId);

  if (!facility.data) return notFound();
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
      </div>
      <div className="h-[calc(100vh_-_48px)] w-full overflow-y-scroll relative">
        <div className="max-w-3xl mx-auto px-2 w-full py-4">
          <div className="bg-white rounded-lg p-2 px-3 shadow-md">
            <h3 className="font-bold lg:text-2xl text-lg">Chỉnh sửa cơ sở</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Điền các trường bên dưới để chỉnh sửa cơ sở.
            </p>
            <UpdateFacilityForm
              data={{
                id: facility.data.id,
                location_name: facility.data.location_name,
                address: facility.data.address,
                location_type: facility.data.location_type,
                rooms: facility.data.rooms.map((room) => ({
                  room_id: room.id,
                  room_name: room.room_name,
                  type: "init",
                })),
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateFacilityPage;
