import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { EllipsisIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
const DisplayList = () => {
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
          <TableRow>
            <TableCell className="font-medium">TONE UP SUNCREEN</TableCell>
            <TableCell>
              <div className="flex items-center">
                <div className="relative shrink-0 rounded-lg aspect-square h-10 w-10 overflow-hidden border-2 border-white -translate-x-0">
                  <Image
                    fill
                    src={
                      "https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792756/ich/z6113933456468_cadbdc1dd04475224e7c8632416aaa5d_kfsyxj.jpg"
                    }
                    alt={""}
                    sizes="100vw"
                  />
                </div>
                <div className="relative shrink-0 rounded-lg aspect-square h-10 w-10 overflow-hidden border-2 border-white -translate-x-1">
                  <Image
                    fill
                    src={
                      "https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792756/ich/z6113933456468_cadbdc1dd04475224e7c8632416aaa5d_kfsyxj.jpg"
                    }
                    alt={""}
                    sizes="100vw"
                  />
                </div>
                <div className="relative shrink-0 rounded-lg aspect-square h-10 w-10 overflow-hidden border-2 border-white -translate-x-2">
                  <Image
                    fill
                    src={
                      "https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792756/ich/z6113933456468_cadbdc1dd04475224e7c8632416aaa5d_kfsyxj.jpg"
                    }
                    alt={""}
                    sizes="100vw"
                  />
                </div>
                <div className="flex items-center justify-center rounded-lg shrink-0 h-10 w-10 bg-accent -translate-x-3 border-2 border-white">
                  <p className="text-muted-foreground font-semibold">+3</p>
                </div>
              </div>
            </TableCell>
            <TableCell>123</TableCell>
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
          <TableRow>
            <TableCell className="font-medium">TONE UP SUNCREEN</TableCell>
            <TableCell>
              <div className="flex items-center">
                <div className="relative shrink-0 rounded-lg aspect-square h-10 w-10 overflow-hidden border-2 border-white -translate-x-0">
                  <Image
                    fill
                    src={
                      "https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792756/ich/z6113933456468_cadbdc1dd04475224e7c8632416aaa5d_kfsyxj.jpg"
                    }
                    alt={""}
                    sizes="100vw"
                  />
                </div>
                <div className="relative shrink-0 rounded-lg aspect-square h-10 w-10 overflow-hidden border-2 border-white -translate-x-1">
                  <Image
                    fill
                    src={
                      "https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792756/ich/z6113933456468_cadbdc1dd04475224e7c8632416aaa5d_kfsyxj.jpg"
                    }
                    alt={""}
                    sizes="100vw"
                  />
                </div>
                <div className="relative shrink-0 rounded-lg aspect-square h-10 w-10 overflow-hidden border-2 border-white -translate-x-2">
                  <Image
                    fill
                    src={
                      "https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792756/ich/z6113933456468_cadbdc1dd04475224e7c8632416aaa5d_kfsyxj.jpg"
                    }
                    alt={""}
                    sizes="100vw"
                  />
                </div>
                <div className="flex items-center justify-center rounded-lg shrink-0 h-10 w-10 bg-accent -translate-x-3 border-2 border-white">
                  <p className="text-muted-foreground font-semibold">+3</p>
                </div>
              </div>
            </TableCell>
            <TableCell>123</TableCell>
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
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default DisplayList;
