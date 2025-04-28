"use client";
import cn from "@/utils/cn";
import { SettingsIcon } from "lucide-react";
import React from "react";

function Order() {
  return (
    <div className="grid p-2 bg-white rounded-md basis-1/2">
      <p>Tên Khách Hàng</p>
      <div className="grid gap-2">
        <div className="flex gap-2 items-center">
          <div className="bg-green-300 h-12 w-12"></div>
          <div>
            <p>Tên Sản Phẩm</p>
            <div className="flex items-center gap-2">
              <div>Default</div> <p>10 Thùng x 100SP = 1000SP </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="bg-green-300 h-12 w-12"></div>
          <div>
            <p>Tên Sản Phẩm</p>
            <div className="flex items-center gap-2">
              <div>SKU</div> <p>1000SP </p>
            </div>
          </div>
        </div>
      </div>
      <p>Đ/c: 159 Nguyễn Đình Chiểu, Phường 4, Tp. Sóc Trăng, T. Sóc Trăng</p>
      <p>SĐT: 0948548844 - 094000000</p>
    </div>
  );
}

function Product() {
  return (
    <div className="flex gap-2 items-center bg-white p-2 rounded-md ">
      <div className="bg-green-300 h-12 w-12 shrink-0"></div>
      <div className="w-full">
        <p>Tên Sản Phẩm</p>
        <div>Default</div>
      </div>
      <p className="shrink-0">2000 sp</p>
    </div>
  );
}
const TVPage = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [column, setColumn] = React.useState<number>(1);
  return (
    <div className="flex w-full relative h-svh overflow-hidden">
      <div
        className={cn("basis-full  bg-green-500", open ? "2xl:basis-2/3" : "")}
      >
        <div className="flex gap-2 p-2 bg-white z-[1] relative">
          <p className="w-full">Danh sách đơn hàng</p>

          <SettingsIcon
            className="shrink-0 h-5 w-5"
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className="flex gap-2 p-2 ">
          <div
            className="flex flex-col gap-2 w-full "
            style={{ transform: "translateY(-100px)" }}
          >
            <Order />
            <Order />
            <Order />
            <Order />
            <Order />
            <Order />
            <Order />
            <Order />
            <Order />
          </div>
          <div className="flex flex-col gap-2 w-full ">
            <Order />
            <Order />
            <Order />
            <Order />
            <Order />
            <Order />
            <Order />
            <Order />
            <Order />
          </div>
        </div>
      </div>
      {open ? (
        <>
          <div className="fixed top-0 left-0 right-0 bottom-0 z-[2] bg-black/30 2xl:hidden"></div>
          <div
            className={cn(
              "absolute top-0 right-0 bottom-0 z-[3] w-full max-w-lg 2xl:max-w-none 2xl:static 2xl:basis-1/3 bg-blue-500"
            )}
          >
            <p>Tổng hợp</p>
            <div className="grid gap-2 p-1">
              <div className="grid gap-2 ">
                <Product />
                <Product />
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default TVPage;
