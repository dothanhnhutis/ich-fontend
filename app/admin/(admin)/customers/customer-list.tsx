import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/commons/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/commons/dropdown-menu";
import { EllipsisIcon } from "lucide-react";
import Link from "next/link";
import { Customer } from "./actions";
import { toast } from "sonner";

const CustomerList = ({ customers }: { customers: Customer[] }) => {
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
          {customers.length > 0 ? (
            customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium w-full">
                  {customer.cusName}
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
                            navigator.clipboard.writeText(customer.id);
                            toast.info(
                              "Đã sao chép ID thành công. ID: " + customer.id
                            );
                          }}
                        >
                          Sao chép ID
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            className="cursor-pointer"
                            href={`/admin/customers/${customer.id}/products`}
                          >
                            Quản lý
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
              <TableCell className="font-medium text-center" colSpan={2}>
                Không tìm thấy kết quả nào.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomerList;
