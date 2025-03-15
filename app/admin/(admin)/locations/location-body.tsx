"use client";
import React from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  EllipsisIcon,
  Grid2X2Icon,
  PlusIcon,
  SlidersHorizontalIcon,
  Table2Icon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { deleteLocationByIdAction, Location } from "./action";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

const convertData = {
  Factory: "Nhà máy",
  Warehouse: "Nhà kho",
};

const LocationBody = ({ initData }: { initData: Location[] }) => {
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  const { mutate, isPending } = useMutation({
    mutationFn: async (facilityId: string) => {
      return await deleteLocationByIdAction(facilityId);
    },
    onSuccess(data) {
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    },
  });
  return (
    <div className="max-w-7xl mx-auto px-2 w-full py-4">
      <div className="bg-white rounded-lg p-2 px-3 shadow-md">
        <div className="flex justify-between gap-2">
          <h3 className="font-bold lg:text-2xl text-lg">Danh sách sản phẩm</h3>
          <Button size="icon" variant="ghost" asChild>
            <Link href="/admin/locations/create">
              <PlusIcon className="size-4 shrink-0" />
            </Link>
          </Button>
        </div>
        <Separator className="my-1 h-4" />
        <p className="text-sm lg:text-base text-muted-foreground">Bộ lọc</p>
        <div className="flex gap-3 pt-1">
          <div className="flex gap-3 w-full">
            <Input placeholder="Tên khách hàng" />
            <Input placeholder="Độ ưu tiên" />
            <Input placeholder="trạng thái" />
          </div>
          <Button variant="outline" size="icon">
            <SlidersHorizontalIcon className="size-4 shrink-0" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode(viewMode == "grid" ? "list" : "grid")}
          >
            {viewMode == "grid" ? (
              <Grid2X2Icon className="size-4 shrink-0" />
            ) : (
              <Table2Icon className="size-4 shrink-0" />
            )}
          </Button>
        </div>
      </div>
      <p className="text-muted-foreground px-2 py-1 lg:text-base text-sm">
        {initData.length} kết quả
      </p>

      <div className="bg-white rounded-lg shadow-md max-w-full overflow-x-auto">
        <Table className="table-fixed p-2 px-3">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Tên cơ sở</TableHead>
              <TableHead className="w-[300px]">Địa chỉ</TableHead>
              <TableHead className="w-[100px]">Loại</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initData.map((facility) => (
              <TableRow key={facility.id}>
                <TableCell className="font-medium min-w-[300px]">
                  {facility.locationName}
                </TableCell>
                <TableCell className="w-[300px]">{facility.address}</TableCell>
                <TableCell className="w-[100px]">
                  {convertData[facility.locationType]}
                </TableCell>

                <TableCell className="w-[50px]">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <EllipsisIcon className="w-5 h-5 shrink-0 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuLabel>Action</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => {
                            navigator.clipboard.writeText(facility.id);
                            toast.info(
                              "Đã sao chép ID thành công. ID: " + facility.id
                            );
                          }}
                        >
                          Sao chép ID
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            className="cursor-pointer"
                            href={"/admin/locations/" + facility.id + "/edit"}
                          >
                            Chỉnh sửa
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={isPending}
                          onClick={() => mutate(facility.id)}
                        >
                          Xoá
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {initData.length == 0 && (
              <TableRow>
                <TableCell className="font-medium text-center" colSpan={5}>
                  Không tìm thấy kết quả nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LocationBody;
