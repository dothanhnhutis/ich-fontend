import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Grid2X2Icon, SlidersHorizontalIcon } from "lucide-react";
import React from "react";

const TvFilter = () => {
  return (
    <>
      <div className="bg-white rounded-lg p-2 px-3 shadow-md">
        <div className="flex justify-between gap-2">
          <h3 className="font-bold lg:text-2xl text-lg">Danh sách hiển thị</h3>
          <Button size="icon" variant="ghost">
            <Grid2X2Icon className="size-4 shrink-0" />
          </Button>
        </div>
        <Separator className="my-1 h-4" />
        <p className="text-sm lg:text-base text-muted-foreground">Filter</p>
        <div className="flex gap-3 pt-1">
          <div className="flex gap-3  w-full">
            <Input placeholder="Tên khách hàng" />
            <Input placeholder="Độ ưu tiên" />
            <Input placeholder="trạng thái" />
          </div>
          <Button variant="outline" size="icon">
            <SlidersHorizontalIcon className="size-4 shrink-0" />
          </Button>
        </div>
      </div>
      <p className="text-muted-foreground px-2 py-1 lg:text-base text-sm">
        10 result
      </p>
    </>
  );
};

export default TvFilter;
