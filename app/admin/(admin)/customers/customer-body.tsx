"use client";
import React from "react";
import { SearchIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import CustomerList from "./customer-list";
import { Customer } from "./actions";
import CustomerForm from "./customer-form";

const CustomerBody = ({ initData }: { initData: Customer[] }) => {
  return (
    <main className="max-w-7xl mx-auto px-2 w-full py-4">
      <div className="bg-white rounded-lg p-2 px-3 shadow-md">
        <div className="flex justify-between gap-2">
          <h3 className="font-bold lg:text-2xl text-lg">
            Danh sách khách hàng
          </h3>

          <CustomerForm />
        </div>
        <Separator className="my-1 h-4" />
        <p className="text-sm text-muted-foreground">Bộ lọc</p>

        <div className="flex items-center pt-1">
          <div className="rounded-md w-full sm:max-w-[300px] flex items-center gap-1 border py-1 px-2">
            <button
              type="button"
              className="cursor-pointer text-muted-foreground"
            >
              <SearchIcon className="shrink-0 w-5 h-5" />
            </button>
            <input
              placeholder="Tên khách hàng"
              type="text"
              className="h-[26px] w-full  focus-visible:ring-0 focus-visible:outline-0"
            />
          </div>
        </div>
      </div>
      <p className="text-muted-foreground px-2 py-1 lg:text-base text-sm">
        {initData.length} kết quả
      </p>

      <CustomerList customers={initData} />
    </main>
  );
};

export default CustomerBody;
