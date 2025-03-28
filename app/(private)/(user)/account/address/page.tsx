import React from "react";
import { Metadata } from "next";
import { cn } from "@/lib/utils";
import { PlusCircleIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Địa chỉ",
};

const SessionsPage = async () => {
  return (
    <div className="w-full">
      <p className="text-sm font-normal leading-snug text-muted-foreground border-b pb-4">
        Đây là danh sách các thiết bị đã đăng nhập vào tài khoản của bạn.
      </p>
      <div className="grid w-full gap-4 py-4">
        <Address isDefault />
        <Address />
        <Address />
        <button
          type="button"
          className="cursor-pointer border border-primary text-primary px-2 py-1 rounded-lg flex items-center justify-center gap-1"
        >
          <PlusCircleIcon className="shrink-0 h-5 w-5" />
          <p>Thêm</p>
        </button>
      </div>
    </div>
  );
};

const Address = ({ isDefault }: { isDefault?: boolean }) => {
  return (
    <div
      className={cn(
        "flex flex-col min-[400px]:flex-row gap-2 border-b p-2 relative",
        false ? "animate-pulse" : ""
      )}
    >
      <div className="text-muted-foreground text-sm sm:text-base w-full cursor-pointer">
        <p>
          <b className="text-black">Thanh Nhụt</b>{" "}
          <span className="mx-1">|</span>
          <span>0948548844</span>
        </p>
        <p>320/8, Ấp khu 1</p>
        <p>Xã Thạnh Phú, Huyện Mỹ Xuyên, Sóc Trăng</p>
        {isDefault ? (
          <div className="inline-block text-primary border-primary border py-0.5 px-2 rounded-sm">
            <p className="text-xs">Mặc định</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SessionsPage;
