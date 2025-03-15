"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {
  EllipsisIcon,
  Grid2X2Icon,
  PlusIcon,
  SlidersHorizontalIcon,
  Table2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Product } from "./action";
import { toast } from "sonner";
const ProductBody = ({
  customerId,
  products,
}: {
  customerId: string;
  products: Product[];
}) => {
  return (
    <div className="h-[calc(100vh_-_48px)] w-full overflow-y-scroll relative">
      <main className="max-w-7xl mx-auto px-2 w-full py-4">
        <div className="bg-white rounded-lg p-2 px-3 shadow-md">
          <div className="flex justify-between gap-2">
            <h3 className="font-bold lg:text-2xl text-lg">
              Danh sách sản phẩm
            </h3>
            <Button size="icon" variant="ghost" asChild>
              <Link href={`/admin/customers/${customerId}/products/create`}>
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
            <Button variant="outline" size="icon">
              {true ? (
                <Grid2X2Icon className="size-4 shrink-0" />
              ) : (
                <Table2Icon className="size-4 shrink-0" />
              )}
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground px-2 py-1 lg:text-base text-sm">
          1 kết quả
        </p>

        <div className="bg-white rounded-lg shadow-md max-w-full overflow-x-auto whitespace-nowrap">
          <Table className="p-2 px-3">
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[500px] w-[calc(5/12 * 100%)]">
                  Tên sản phẩm
                </TableHead>
                <TableHead className="min-w-[500px] w-[calc(5/12 * 100%)]">
                  Hình
                </TableHead>
                <TableHead className="min-w-[100px] w-[calc(1/12 * 100%)]">
                  Quy cách
                </TableHead>
                <TableHead className="min-w-[50px] w-[calc(1/12 * 100%)]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length > 0 ? (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.prodName}</TableCell>
                    <TableCell>imggggg</TableCell>
                    <TableCell>{product.packSpec}</TableCell>
                    <TableCell>
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
                                navigator.clipboard.writeText(product.id);
                                toast.info(
                                  "Đã sao chép ID thành công. ID: " + product.id
                                );
                              }}
                            >
                              Sao chép ID
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                className="cursor-pointer"
                                href={`/admin/customers/${customerId}/products/${product.id}/edit`}
                              >
                                Chỉnh sửa
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Xoá</DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="font-medium text-center" colSpan={5}>
                    Không tìm thấy kết quả nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default ProductBody;
