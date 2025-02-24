"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import Image from "next/image";
import { Button } from "@/components/ui/button";
const customers = [
  {
    id: "1",
    cus_name: "Thanh To",
    phone_number: "123456789",
    address: ["address 1", "address 2", "address 3"],
  },
  {
    id: "2",
    cus_name: "Nam",
    phone_number: "123456789",
    address: ["address 4", "address 5"],
  },
];

const product: {
  prod_name: string;
  prod_img: string;
  unit: "PACKAGED_GOODS" | "CARTON";
  pack_spec: number;
  quantity: number;
} = {
  pack_spec: 10,
  prod_img:
    "https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792756/ich/z6113933456468_cadbdc1dd04475224e7c8632416aaa5d_kfsyxj.jpg",
  prod_name: "Face / Kem Face",
  quantity: 10,
  unit: "CARTON",
};

type DisplayOrderProduct = {
  prod_name: string;
  prod_img: string;
  unit: "PACKAGED_GOODS" | "CARTON";
  pack_spec: number;
  quantity: number;
};

type CreateDisplayOrderData = {
  cus_name: string;
  priority: number;
  status: "TO_DO" | "ON_PROGRESS" | "COMPLETED";
  address?: string;
  phone_number?: string;
  products: DisplayOrderProduct[];
  rooms_ids: string[];
};

const CreateDisplayOrderForm = () => {
  const [formData, setFormData] = React.useState<CreateDisplayOrderData>({
    cus_name: "",
    address: "",
    phone_number: "",
    priority: 0,
    status: "TO_DO",
    products: [],
    rooms_ids: [],
  });

  const [selectdId, setSelectedId] = React.useState<string>("");

  const cusSelected = React.useMemo(() => {
    return customers.find((cus) => cus.id == selectdId);
  }, [selectdId]);

  console.log(selectdId);

  return (
    <form>
      <div className="flex gap-2 items-center">
        <Label htmlFor="cus_name_select">Khách hàng</Label>
        <Select onValueChange={(v) => setSelectedId(v)}>
          <SelectTrigger id="cus_name_select">
            <SelectValue placeholder="Khách hàng" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Khách hàng</SelectLabel>
              {customers.map((cus) => (
                <SelectItem key={cus.id} value={cus.id}>
                  {cus.cus_name}
                </SelectItem>
              ))}
              <SelectItem value={"null"}>Khách hàng mới</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Separator className="my-2" />
      <h4 className="font-semibold text-sm lg:text-base mb-4">
        Thông tin khách hàng
      </h4>
      <div className="grid gap-2">
        <div className="grid gap-1">
          <Label>Tên khách hàng</Label>
          <Input value={cusSelected?.cus_name || ""} onChange={() => {}} />
        </div>

        <div className="grid gap-1">
          <Label>Số điện thoại</Label>
          <Input value={cusSelected?.phone_number || ""} onChange={() => {}} />
        </div>

        <div className="grid gap-1">
          <Label htmlFor="address">Địa chỉ</Label>

          <RadioGroup defaultValue="option-one">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-one" id="option-one" />
              <Label htmlFor="option-one">Option One</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-two" id="option-two" />
              <Label htmlFor="option-two">Option Two</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" className="hidden" />
              <Label htmlFor="other">Khác</Label>
            </div>
          </RadioGroup>
          <Input value={cusSelected?.address || ""} onChange={() => {}} />
        </div>

        <div className="grid gap-1">
          <Label htmlFor="priority">Ưu tiên</Label>
          <Input id="priority" />
          <p className="text-muted-foreground text-xs">
            Ưu tiên càng cao thì đơn hàng sẽ được hiển thị lên đầu.
          </p>
        </div>
        <div className="grid gap-1">
          <Label htmlFor="status">Trạng thái đơn hàng</Label>
          <Select defaultValue="TO_DO">
            <SelectTrigger id="status">
              <SelectValue placeholder="Trạng thái đơn hàng" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Trạng thái đơn hàng</SelectLabel>
                <SelectItem value="TO_DO">Đơn hàng sắp tới</SelectItem>
                <SelectItem value="ON_PROGRESS">Đang làm hàng</SelectItem>
                <SelectItem value="COMPLETED">Đã giao hàng</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <p className="text-muted-foreground text-xs">
            <b>Lưu ý:</b> Trạng thái đơn hàng <b>Đơn hàng sắp tới</b> và{" "}
            <b>Đang làm hàng</b> sẽ hiển thị trên màn hình
          </p>
        </div>
      </div>

      <Separator className="my-2" />
      <div>
        <h4 className="font-semibold text-sm lg:text-base mb-4">
          Thông tin đơn hàng
        </h4>
        <div className="grid gap-2">
          <div className="flex gap-2">
            <div className="relative shrink-0 rounded-lg aspect-square h-16 w-16 overflow-hidden">
              <Image
                fill
                src={product.prod_img}
                alt={product.prod_name}
                sizes="100vw"
              />
            </div>
            <div className="w-full">
              <p className="text-sm lg:text-base font-semibold line-clamp-2">
                123
              </p>
              <p className="text-sm">
                {product.quantity}{" "}
                {product.unit == "CARTON" ? (
                  <span>
                    thùng{" "}
                    {`(${product.quantity}T x ${product.pack_spec}SP = ${
                      product.quantity * product.pack_spec
                    } SP)`}
                  </span>
                ) : (
                  <span>sản phẩm</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="relative shrink-0 rounded-lg aspect-square h-16 w-16 overflow-hidden">
              <Image
                fill
                src={product.prod_img}
                alt={product.prod_name}
                sizes="100vw"
              />
            </div>
            <div className="w-full">
              <p className="text-sm lg:text-base font-semibold line-clamp-2">
                123
              </p>
              <p className="text-sm">
                {product.quantity}{" "}
                {product.unit == "CARTON" ? (
                  <span>
                    thùng{" "}
                    {`(${product.quantity} x ${product.pack_spec} = ${
                      product.quantity * product.pack_spec
                    } sản phẩm)`}
                  </span>
                ) : (
                  <span>sản phẩm</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button variant="ghost" type="button">
          Huỷ
        </Button>
        <Button>Tạo</Button>
      </div>
    </form>
  );
};

export default CreateDisplayOrderForm;
