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
import { EllipsisIcon } from "lucide-react";
const ProductPage = () => {
  return (
    <>
      <p className="text-muted-foreground px-2 py-1 lg:text-base text-sm">
        1 kết quả
      </p>

      <div className="bg-white rounded-lg shadow-md max-w-full overflow-x-auto">
        <Table className="table-fixed p-2 px-3">
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
    </>
  );
};

export default ProductPage;
