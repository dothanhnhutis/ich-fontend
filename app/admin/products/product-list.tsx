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
import Image from "next/image";
import { EllipsisIcon } from "lucide-react";
import { deleteProductById, Product } from "./actions";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";

const DisplayList = ({ products }: { products: Product[] }) => {
  const { mutate, isPending } = useMutation({
    mutationFn: async (facilityId: string) => {
      return await deleteProductById(facilityId);
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
    <div className="bg-white rounded-lg shadow-md max-w-full overflow-x-auto">
      <Table className="table-fixed p-2 px-3">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Tên sản phẩm</TableHead>
            <TableHead className="w-[300px]">Hình sản phẩm</TableHead>
            <TableHead className="w-[100px]">Quy cách</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length == 0 ? (
            <TableRow>
              <TableCell className="font-medium text-center" colSpan={4}>
                Chưa có sản phẩm
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium min-w-[300px]">
                  {product.prod_name}
                </TableCell>
                <TableCell className="w-[300px]">
                  <div className="flex items-center">
                    {product.images.map(
                      (img, idx) =>
                        idx < 3 && (
                          <div
                            key={idx}
                            style={{
                              transform:
                                idx > 0 ? `translateX(-${idx * 0.5}rem)` : "",
                            }}
                            className={cn(
                              `relative shrink-0 rounded-lg aspect-square h-10 w-10 overflow-hidden border-2 border-white`
                            )}
                          >
                            <Image
                              fill
                              src={img}
                              alt={""}
                              sizes="36px"
                              className="object-contain"
                            />
                          </div>
                        )
                    )}

                    {product.images.length > 3 && (
                      <div className="flex items-center justify-center rounded-lg shrink-0 h-10 w-10 bg-accent -translate-x-6 border-2 border-white">
                        <p className="text-muted-foreground font-semibold">
                          +{product.images.length - 3}
                        </p>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="w-[100px]">{product.pack_spec}</TableCell>
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
                            href={"/admin/products/" + product.id + "/edit"}
                          >
                            Chỉnh sửa
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={isPending}
                          onClick={() => mutate(product.id)}
                        >
                          Xoá
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DisplayList;
