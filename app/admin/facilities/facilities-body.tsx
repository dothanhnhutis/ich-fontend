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
import { Input } from "@/components/ui/input";

type Facility = {
  id: string;
  location_name: string;
  address: string;
  location_type: "Factory" | "Warehouse";
  created_at: string;
  updated_at: string;
  rooms: {
    id: string;
    room_name: string;
    location_id: string;
    created_at: string;
    updated_at: string;
  }[];
};

const FacilitiesBody = () => {
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  const data: Facility[] = [
    {
      id: "1",
      location_name: "Công ty TNHH MTV TM Sản Xuất I.C.H",
      address:
        "Số 159 Nguyễn Đình Chiểu, Khóm 3, Phường 4, Thành phố Sóc Trăng, Tỉnh Sóc Trăng",
      location_type: "Factory",
      created_at: "",
      updated_at: "",
      rooms: [],
    },
    {
      id: "2",
      location_name: "Công ty TNHH MTV TM Sản Xuất I.C.H",
      address:
        "Số 159 Nguyễn Đình Chiểu, Khóm 3, Phường 4, Thành phố Sóc Trăng, Tỉnh Sóc Trăng",
      location_type: "Factory",
      created_at: "",
      updated_at: "",
      rooms: [],
    },
    {
      id: "3",
      location_name: "Công ty TNHH MTV TM Sản Xuất I.C.H",
      address:
        "Số 159 Nguyễn Đình Chiểu, Khóm 3, Phường 4, Thành phố Sóc Trăng, Tỉnh Sóc Trăng",
      location_type: "Factory",
      created_at: "",
      updated_at: "",
      rooms: [],
    },
    {
      id: "4",
      location_name: "Công ty TNHH MTV TM Sản Xuất I.C.H",
      address:
        "Số 159 Nguyễn Đình Chiểu, Khóm 3, Phường 4, Thành phố Sóc Trăng, Tỉnh Sóc Trăng",
      location_type: "Factory",
      created_at: "",
      updated_at: "",
      rooms: [],
    },
    {
      id: "5",
      location_name: "Công ty TNHH MTV TM Sản Xuất I.C.H",
      address:
        "Số 159 Nguyễn Đình Chiểu, Khóm 3, Phường 4, Thành phố Sóc Trăng, Tỉnh Sóc Trăng",
      location_type: "Factory",
      created_at: "",
      updated_at: "",
      rooms: [],
    },
    {
      id: "6",
      location_name: "Công ty TNHH MTV TM Sản Xuất I.C.H",
      address:
        "Số 159 Nguyễn Đình Chiểu, Khóm 3, Phường 4, Thành phố Sóc Trăng, Tỉnh Sóc Trăng",
      location_type: "Factory",
      created_at: "",
      updated_at: "",
      rooms: [],
    },
    {
      id: "7",
      location_name: "Công ty TNHH MTV TM Sản Xuất I.C.H",
      address:
        "Số 159 Nguyễn Đình Chiểu, Khóm 3, Phường 4, Thành phố Sóc Trăng, Tỉnh Sóc Trăng",
      location_type: "Factory",
      created_at: "",
      updated_at: "",
      rooms: [],
    },
    {
      id: "8",
      location_name: "Công ty TNHH MTV TM Sản Xuất I.C.H",
      address:
        "Số 159 Nguyễn Đình Chiểu, Khóm 3, Phường 4, Thành phố Sóc Trăng, Tỉnh Sóc Trăng",
      location_type: "Factory",
      created_at: "",
      updated_at: "",
      rooms: [],
    },
    {
      id: "9",
      location_name: "Công ty TNHH MTV TM Sản Xuất I.C.H",
      address:
        "Số 159 Nguyễn Đình Chiểu, Khóm 3, Phường 4, Thành phố Sóc Trăng, Tỉnh Sóc Trăng",
      location_type: "Factory",
      created_at: "",
      updated_at: "",
      rooms: [],
    },
    {
      id: "10",
      location_name: "Công ty TNHH MTV TM Sản Xuất I.C.H",
      address:
        "Số 159 Nguyễn Đình Chiểu, Khóm 3, Phường 4, Thành phố Sóc Trăng, Tỉnh Sóc Trăng",
      location_type: "Factory",
      created_at: "",
      updated_at: "",
      rooms: [],
    },
    {
      id: "11",
      location_name: "Công ty TNHH MTV TM Sản Xuất I.C.H",
      address:
        "Số 159 Nguyễn Đình Chiểu, Khóm 3, Phường 4, Thành phố Sóc Trăng, Tỉnh Sóc Trăng",
      location_type: "Factory",
      created_at: "",
      updated_at: "",
      rooms: [],
    },
    {
      id: "12",
      location_name: "Công ty TNHH MTV TM Sản Xuất I.C.H",
      address:
        "Số 159 Nguyễn Đình Chiểu, Khóm 3, Phường 4, Thành phố Sóc Trăng, Tỉnh Sóc Trăng",
      location_type: "Factory",
      created_at: "",
      updated_at: "",
      rooms: [],
    },
    {
      id: "13",
      location_name: "Công ty TNHH MTV TM Sản Xuất I.C.H",
      address:
        "Số 159 Nguyễn Đình Chiểu, Khóm 3, Phường 4, Thành phố Sóc Trăng, Tỉnh Sóc Trăng",
      location_type: "Factory",
      created_at: "",
      updated_at: "",
      rooms: [],
    },
  ];
  return (
    <div className="max-w-7xl mx-auto px-2 w-full py-4">
      <div className="bg-white rounded-lg p-2 px-3 shadow-md">
        <div className="flex justify-between gap-2">
          <h3 className="font-bold lg:text-2xl text-lg">Danh sách sản phẩm</h3>
          <Button size="icon" variant="ghost" asChild>
            <Link href="/admin/facilities/create">
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
        10 kết quả
      </p>

      <div className="bg-white rounded-lg p-2 px-3 shadow-md max-w-full overflow-x-auto">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Tên cơ sở</TableHead>
              <TableHead className="w-[300px]">Địa chỉ</TableHead>
              <TableHead className="w-[300px]">Loại</TableHead>
              <TableHead className="w-[300px]">Phòng ban</TableHead>
              <TableHead className="w-[300px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((facility) => (
              <TableRow key={facility.id}>
                <TableCell className="font-medium min-w-[300px]">
                  {facility.location_name}
                </TableCell>
                <TableCell className="w-[300px]">{facility.address}</TableCell>
                <TableCell className="w-[300px]">
                  {facility.location_type}
                </TableCell>
                <TableCell className="w-[300px]">
                  {facility.rooms.length}
                </TableCell>
                <TableCell className="w-[300px]">
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    className="cursor-pointer"
                  >
                    <EllipsisIcon className="w-5 h-5 shrink-0" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FacilitiesBody;
