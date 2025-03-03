import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { EllipsisIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "./actions";
import { cn } from "@/lib/utils";
const DisplayList = ({ products }: { products: Product[] }) => {
  return (
    <div className="bg-white rounded-lg p-2 px-3 shadow-md">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="">Tên sản phẩm</TableHead>
            <TableHead>Hình sản phẩm</TableHead>
            <TableHead>Quy cách</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.prod_name}</TableCell>
              <TableCell>
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
                            sizes="100vw"
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
              <TableCell>{product.pack_spec}</TableCell>
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
          ))}

          <TableRow>
            <TableCell className="font-medium text-center" colSpan={4}>
              Chưa có sản phẩm
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default DisplayList;
