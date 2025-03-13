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
import UpdateLocationForm from "./form";
import { getLocationByIdAction, getRoomsOfLocationAction } from "../../action";
import { notFound } from "next/navigation";
export const metadata: Metadata = {
  title: "Chỉnh Sửa Cơ Sở",
};
const UpdateLocationPage = async (props: {
  params: Promise<{ locationId: string }>;
}) => {
  const params = await props.params;

  const location = await getLocationByIdAction(params.locationId);

  if (!location) return notFound();

  const rooms = await getRoomsOfLocationAction(params.locationId);

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
              <BreadcrumbLink href="/admin/locations">
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
            <UpdateLocationForm
              data={{
                ...location,
                rooms: rooms.map((room) => ({
                  roomId: room.id,
                  roomName: room.roomName,
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

export default UpdateLocationPage;
