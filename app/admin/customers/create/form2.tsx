"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChevronRightIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useCreateCustomer } from "./create-customer-provider";

const Step1 = () => {
  const { step, formData, setCusName } = useCreateCustomer();
  if (step != 1) return;
  return (
    <div>
      <Label>Tên khách hàng</Label>
      <Input
        required
        value={formData.cus_name}
        onChange={(e) => setCusName(e.target.value)}
      />
    </div>
  );
};

const Step2 = () => {
  const { step } = useCreateCustomer();
  if (step != 2) return;
  return (
    <div>
      <Label>Danh sách kho</Label>
      <div className="grid gap-2">
        <div className="grid gap-1 border-b">
          <p>
            Thủ kho: <b>Nguyen Van A</b>
          </p>
          <p>
            SĐT: <b>0948548844</b>
          </p>
          <p>
            Đ/c:{" "}
            <b>
              Số 294, đường Trần Hưng Đạo, Ấp Nội Ô, Tt.Huỳnh Hữu Nghĩa, Huyện
              Mỹ Tú, Tỉnh Sóc Trăng, Việt Nam
            </b>
          </p>
        </div>

        <p className="text-muted-foreground text-sm text-center">
          Chưa có kho nào.{" "}
          <span className="font-bold cursor-pointer">Thêm</span>
        </p>
      </div>
    </div>
  );
};

const CreateCustomerForm = () => {
  const { step, hasNext, back, next } = useCreateCustomer();

  return (
    <form>
      <div className="flex gap-1 items-center text-xs min-[430px]:text-sm text-muted-foreground mt-2">
        <p className={step == 1 ? "text-black" : ""}>
          Bước 1: Thông tin khách hàng
        </p>
        <ChevronRightIcon className="shrink-0 w-4 h-4" />
        <p className={step == 2 ? "text-black" : ""}>Bước 2: Kho hàng</p>
        <ChevronRightIcon className="shrink-0 w-4 h-4" />
        <p className={step == 3 ? "text-black" : ""}>Bước 3: Sản phẩm</p>
        <ChevronRightIcon className="shrink-0 w-4 h-4" />
        <p className={step == 4 ? "text-black" : ""}>Bước 4: Hoàn Thành</p>
      </div>
      <Separator className="my-2" />
      <div className="grid gap-2">
        <Step1 />
        <Step2 />
        <div className="flex gap-2 justify-end items-center">
          <Button variant="ghost" type="button" asChild>
            <Link href="/admin/products">Huỷ</Link>
          </Button>
          {step > 1 && (
            <Button variant="ghost" type="button" onClick={back}>
              Trở về
            </Button>
          )}
          <Button onClick={next} type={!hasNext ? "submit" : "button"}>
            {hasNext ? "Kế tiếp" : "Tạo"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CreateCustomerForm;
