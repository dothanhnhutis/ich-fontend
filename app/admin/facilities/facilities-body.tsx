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

const FacilitiesBody = () => {
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  return (
    <main className="max-w-7xl mx-auto px-2 w-full py-4">
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

      <div className="bg-white rounded-lg p-2 px-3 shadow-md">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-full">Tên cơ sở</TableHead>
              <TableHead className="w-full">Địa chỉ</TableHead>
              <TableHead className="w-[150px]">Loại</TableHead>
              <TableHead className="w-[100px]">Phòng ban</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">
                Công ty TNHH MTV TM Sản Xuất I.C.H
              </TableCell>
              <TableCell>
                Số 159 Nguyễn Đình Chiểu, Khóm 3, Phường 4, Thành phố Sóc Trăng,
                Tỉnh Sóc Trăng
              </TableCell>
              <TableCell>Factory</TableCell>
              <TableCell>2</TableCell>
              <TableCell>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="cursor-pointer"
                >
                  <EllipsisIcon className="w-5 h-5 shrink-0" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </main>
  );
};

export default FacilitiesBody;
