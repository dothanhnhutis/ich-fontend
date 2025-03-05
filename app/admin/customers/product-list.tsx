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
import { EllipsisIcon } from "lucide-react";
import Link from "next/link";

const DisplayList = () => {
  return (
    <div className="bg-white rounded-lg shadow-md max-w-full overflow-x-auto">
      <Table className="table-fixed p-2 px-3">
        <TableHeader>
          <TableRow>
            <TableHead className="w-full">Tên khách hàng</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium w-full">
              CÔNG TY TNHH MTV TM SẢN XUẤT I.C.H
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
                    <DropdownMenuItem className="cursor-pointer">
                      Sao chép ID
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        className="cursor-pointer"
                        href={"/admin/customers/123/edit"}
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
          <TableRow>
            <TableCell className="font-medium text-center" colSpan={2}>
              Chưa có sản phẩm
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default DisplayList;
