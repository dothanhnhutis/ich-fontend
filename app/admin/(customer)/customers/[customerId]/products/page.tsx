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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ProductPage = () => {
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
                  Khách hàng
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Nguyen Van A</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Sản phẩm</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className="h-[calc(100vh_-_48px)] w-full overflow-y-scroll relative">
        <main className="max-w-7xl mx-auto px-2 w-full py-4">
          <div className="bg-white rounded-lg p-2 px-3 shadow-md">
            <div className="flex justify-between gap-2">
              <h3 className="font-bold lg:text-2xl text-lg">
                Danh sách sản phẩm
              </h3>
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

          <div className="bg-white rounded-lg shadow-md max-w-full overflow-x-auto">
            <Table className="table-fixed  p-2 px-3">
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[300px] w-full">
                    Tên sản phẩm
                  </TableHead>
                  <TableHead className="w-[300px]">Hình</TableHead>
                  <TableHead className="w-[100px]">Quy cách</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium min-w-[300px] w-full">
                    adasd
                  </TableCell>
                  <TableCell className="w-[300px]">123</TableCell>
                  <TableCell className="w-[100px]">123</TableCell>

                  <TableCell className="w-[50px]">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <EllipsisIcon className="w-5 h-5 shrink-0 cursor-pointer" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuLabel>Action</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem className="cursor-pointer">
                            Sao chép ID
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link className="cursor-pointer" href={""}>
                              Chỉnh sửa
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Xoá</DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium text-center" colSpan={5}>
                    Chưa có cơ sở
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </>
  );
};

export default ProductPage;
