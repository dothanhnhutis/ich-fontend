import React from "react";
import { Customer } from "../../actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Grid2X2Icon,
  PlusIcon,
  SlidersHorizontalIcon,
  Table2Icon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

const OrdersBody = ({ customer }: { customer: Customer }) => {
  return (
    <div className="h-[calc(100vh_-_48px)] w-full overflow-y-scroll relative">
      <main className="max-w-7xl mx-auto px-2 w-full py-4">
        <div className="bg-white rounded-lg p-2 px-3 shadow-md">
          <div className="flex justify-between gap-2">
            <h3 className="font-bold lg:text-2xl text-lg">
              Danh sách đặt hàng
            </h3>
            <Button size="icon" variant="ghost" asChild>
              <Link href={`/admin/customers/${customer.id}/orders/create`}>
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
      </main>
    </div>
  );
};

export default OrdersBody;
