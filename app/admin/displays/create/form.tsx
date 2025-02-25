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
import { cn } from "@/lib/utils";
import { EllipsisIcon } from "lucide-react";
const customers = [
  {
    id: "1",
    cus_name: "Thanh To",
    phone_number: "123456789",
    address: ["address 1", "address 2", "address 3", "address 6"],
  },
  {
    id: "2",
    cus_name: "Nam",
    phone_number: "123456789",
    address: ["address 4", "address 5"],
  },
  {
    id: "3",
    cus_name: "Cần",
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
  id: string | null;
  cus_name: string;
  priority: number;
  status: "TO_DO" | "ON_PROGRESS" | "COMPLETED";
  address?: string;
  phone_number?: string;
  products: DisplayOrderProduct[];
  rooms_ids: string[];
};

type DisplayOrderContextData = {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  data: CreateDisplayOrderData;
  setData: React.Dispatch<React.SetStateAction<CreateDisplayOrderData>>;
};

const DisplayOrderContext = React.createContext<DisplayOrderContextData | null>(
  null
);

export const useDisplayOrder = () => {
  const context = React.useContext(DisplayOrderContext);
  if (!context) {
    throw new Error(
      "useDisplayOrder must be used within a DisplayOrderProvider."
    );
  }
  return context;
};

export const DisplayOrderProvider = ({
  children,
}: Readonly<{ children?: React.ReactNode }>) => {
  const [step, setStep] = React.useState<number>(1);
  const [data, setData] = React.useState<CreateDisplayOrderData>({
    id: null,
    cus_name: "",
    phone_number: "",
    address: "",
    status: "TO_DO",
    priority: 0,
    products: [],
    rooms_ids: [],
  });

  const contextValue = React.useMemo(
    () => ({
      step,
      setStep,
      data,
      setData,
    }),
    [step, setStep, data, setData]
  );

  return (
    <DisplayOrderContext.Provider value={contextValue}>
      {children}
    </DisplayOrderContext.Provider>
  );
};

const Step1 = ({
  customers,
}: {
  customers: {
    id: string;
    cus_name: string;
    phone_number?: string;
    address?: string[];
  }[];
}) => {
  const { step, setData, data } = useDisplayOrder();

  if (step != 1) return;

  return (
    <div className="grid gap-2 items-center">
      <Label htmlFor="cus_name">Khách hàng</Label>
      <Select
        value={data.id || "other"}
        onValueChange={(v) => {
          const cus = customers.find((cus) => cus.id == v);
          setData((prev) => ({
            ...prev,
            id: cus?.id || null,
            cus_name: cus?.cus_name || "",
            phone_number: cus?.cus_name || "",
            address: cus?.address?.[0] || "",
          }));
        }}
      >
        <SelectTrigger id="cus_name">
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
            <SelectItem value={"other"}>Khách hàng mới</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

const Step2 = () => {
  const { step, data, setData } = useDisplayOrder();

  if (step != 2) return;
  return (
    <>
      <Separator className="my-2" />
      <h4 className="font-semibold mb-4">Thông tin khách hàng</h4>
      <div className="grid gap-2">
        <div className="grid gap-1">
          <Label>Tên khách hàng</Label>
          <Input
            required
            value={data.cus_name || ""}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                cus_name: e.target.value,
              }))
            }
          />
        </div>

        <div className="grid gap-1">
          <Label>Số điện thoại</Label>
          <Input
            value={data.phone_number || ""}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                phone_number: e.target.value,
              }))
            }
          />
        </div>

        <div className="grid gap-1">
          <Label htmlFor="address">Địa chỉ</Label>

          <RadioGroup
            onValueChange={(v) => {
              setData((prev) => ({
                ...prev,
                address: v,
              }));
            }}
            value={selectdAddressId}
            className="max-h-[144px] overflow-y-scroll"
          >
            {cusSelected &&
              cusSelected.address &&
              cusSelected.address.map((address, idx) => (
                <Label
                  htmlFor={`address_${idx}`}
                  key={idx}
                  className="flex items-center space-x-2 py-3 px-2 border cursor-pointer rounded-lg [&:has([data-state=checked])]:border-primary text-muted-foreground [&:has([data-state=checked])>p]:text-black"
                >
                  <RadioGroupItem
                    value={address}
                    id={`address_${idx}`}
                    className="hidden"
                  />
                  <p>{address}</p>
                </Label>
              ))}
          </RadioGroup>
          <Input
            className={cn(
              "focus-visible:outline-0 focus-visible:ring-0",
              selectdAddressId != "other"
                ? "text-muted-foreground"
                : cusSelected
                ? "border-primary"
                : ""
            )}
            required={selectdAddressId == "other"}
            placeholder="Địa chỉ khác"
            type="text"
            onFocus={() => {
              setSelectedAddressId("other");
              setFormData((prev) => ({
                ...prev,
                address: addressOtherValue,
              }));
            }}
            value={addressOtherValue}
            onChange={(e) => {
              setAddressOtherValue(e.target.value);
              setFormData((prev) => ({
                ...prev,
                address: e.target.value,
              }));
            }}
          />
        </div>
      </div>
    </>
  );
};

const Step3 = () => {
  const { step } = useDisplayOrder();

  if (step != 3) return;
  return (
    <div>
      <h4 className="font-semibold mb-4">Thông tin đơn hàng</h4>
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
          <div>
            <button className="text-muted-foreground cursor-pointer">
              <EllipsisIcon className="h-5 w-5 shrink-0" />
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="relative shrink-0 rounded-lg aspect-square h-20 w-20 overflow-hidden">
            <Image
              fill
              src={product.prod_img}
              alt={product.prod_name}
              sizes="100vw"
            />
          </div>
          <div className="w-full">
            <Input placeholder="Tên sản phẩm" />
            <Input placeholder="Tên sản phẩm" />
          </div>
        </div>
      </div>
    </div>
  );
};

const Step4 = () => {
  const { step, setData } = useDisplayOrder();

  if (step != 4) return;
  return (
    <div>
      <h4 className="font-semibold mb-4">Thông tin đơn hàng</h4>
      <div className="grid gap-2">
        <div className="grid gap-1">
          <Label htmlFor="priority">Ưu tiên</Label>
          <Input
            id="priority"
            required
            value={formData.priority}
            onChange={handleChange}
          />
          <p className="text-muted-foreground text-xs">
            Ưu tiên càng cao thì đơn hàng sẽ được hiển thị lên đầu.
          </p>
        </div>
        <div className="grid gap-1">
          <Label htmlFor="status">Trạng thái đơn hàng</Label>
          <Select
            defaultValue="TO_DO"
            onValueChange={(v) =>
              setData((prev) => ({
                ...prev,
                status: v as CreateDisplayOrderData["status"],
              }))
            }
          >
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
            <b>Lưu ý:</b> Trạng thái đơn hàng là <b>Đơn hàng sắp tới</b> hoặc{" "}
            <b>Đang làm hàng</b> sẽ hiển thị trên màn hình.
          </p>
        </div>
      </div>
    </div>
  );
};

const CreateDisplayOrderForm = () => {
  const { step, setStep, data } = useDisplayOrder();

  //   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const rawValue = e.target.value;
  //     const numbersOnly = rawValue.replace(/[^0-9]/g, "");
  //     const processedValue = numbersOnly.replace(/^0+/, "") || "";
  //     setFormData((prev) => ({
  //       ...prev,
  //       priority: Math.min(Number(processedValue), 100),
  //     }));
  //   };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Step1 customers={customers} />
      <Step2 />
      <Step3 />
      <Step4 />

      <div className="flex items-center justify-end gap-2 mt-4">
        <Button variant="ghost" type="button">
          Huỷ
        </Button>
        {step != 1 && (
          <Button
            variant="ghost"
            type="button"
            onClick={() =>
              setStep((prev) => (prev == 3 ? 2 : prev == 2 ? 1 : 1))
            }
          >
            Trở về
          </Button>
        )}

        <Button
          onClick={() => setStep((prev) => (prev == 1 ? 2 : prev == 2 ? 3 : 1))}
          type={step == 3 ? "submit" : "button"}
        >
          {step == 1 || step == 2 ? "Next" : "Tạo"}
        </Button>
      </div>
    </form>
  );
};

export default CreateDisplayOrderForm;
