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

const CreateDisplayOrderForm = () => {
  const [newCus, setNewCus] = React.useState<boolean>(false);

  return (
    <form>
      <div className="flex gap-2 items-center">
        <button>Mặc định</button>
        <button>Tuỳ chỉnh</button>
      </div>
      <Separator className="my-2" />
      {newCus ? (
        <div className="grid gap-2">
          <div>
            <Label>Tên khách hàng</Label>
            <Input />
          </div>
          <div>
            <Label>Số điện thoại</Label>
            <Input />
          </div>
          <div>
            <Label>Địa chỉ</Label>
            <Input />
          </div>
        </div>
      ) : (
        <div className="grid gap-2">
          <p>
            Tên khách hàng: <span>123</span>
          </p>
          <p>
            Số điện thoại: <span>123</span>
          </p>
          <div>
            <Label>Địa chỉ:</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Địa chỉ" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Địa chỉ</SelectLabel>
                  <SelectItem value="Factory">Nhà máy</SelectItem>
                  <SelectItem value="Warehouse">Nhà kho</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <Separator className="my-2" />
      <div>
        <p>Sản phẩm</p>
      </div>
    </form>
  );
};

export default CreateDisplayOrderForm;
