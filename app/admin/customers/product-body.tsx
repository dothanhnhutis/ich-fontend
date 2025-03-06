"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Grid2X2Icon,
  PlusIcon,
  SlidersHorizontalIcon,
  Table2Icon,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import DisplayList from "./product-list";
import { Product } from "./actions";
import { Label } from "@/components/ui/label";
const ProductBody = ({ initData }: { initData: Product[] }) => {
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  return (
    <main className="max-w-7xl mx-auto px-2 w-full py-4">
      <div className="bg-white rounded-lg p-2 px-3 shadow-md">
        <div className="flex justify-between gap-2">
          <h3 className="font-bold lg:text-2xl text-lg">
            Danh sách khách hàng
          </h3>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="icon" variant="ghost">
                <PlusIcon className="size-4 shrink-0" />
              </Button>
            </DialogTrigger>
            <DialogContent className=" min-[456px]:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Tạo khách hàng mới</DialogTitle>
                <DialogDescription>
                  Tạo hồ sơ khách hàng để quản lý sản phẩm mà khách muốn gia
                  công
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-2">
                <Label htmlFor="cus_name">Tên khách hàng</Label>
                <Input id="cus_name" />
              </div>
              <DialogFooter>
                <Button type="submit">Tạo</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
        {initData.length} kết quả
      </p>

      <DisplayList products={initData} />
    </main>
  );
};

export default ProductBody;
