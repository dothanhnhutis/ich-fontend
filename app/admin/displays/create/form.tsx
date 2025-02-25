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
import { PlusIcon } from "lucide-react";
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
  address_list: string[] | null;
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
  const [step, setStep] = React.useState<number>(3);
  const [data, setData] = React.useState<CreateDisplayOrderData>({
    id: null,
    address_list: null,
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
        value={data.id || undefined}
        onValueChange={(v) => {
          if (v == "null") {
            setData((prev) => ({
              ...prev,
              id: "null",
              address_list: null,
              cus_name: "",
              phone_number: "",
              address: "",
            }));
          } else {
            const cus = customers.find((cus) => cus.id == v);
            setData((prev) => ({
              ...prev,
              id: cus?.id || null,
              address_list: cus?.address || null,
              cus_name: cus?.cus_name || "",
              phone_number: cus?.phone_number || "",
              address: cus?.address?.[0] || "",
            }));
          }
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
            <SelectItem value={"null"}>Khách hàng mới</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

const Step2 = () => {
  const { step, data, setData } = useDisplayOrder();
  const [addressInput, setAddressInput] = React.useState<string>("");
  const [addressSelected, setAddressSelected] = React.useState<string>("");

  React.useEffect(() => {
    if (step == 2) {
      setAddressInput("");
      setAddressSelected(data.address_list ? data.address_list[0] : "");
    }
  }, [data.address_list, step]);

  if (step != 2) return;

  return (
    <>
      <h4 className="font-semibold mb-4">Thông tin khách hàng</h4>
      <div className="grid gap-2">
        <div className="grid gap-1">
          <Label htmlFor="cus_name">Tên khách hàng</Label>
          <Input
            id="cus_name"
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
          <Label htmlFor="phone_number">Số điện thoại</Label>
          <Input
            id="phone_number"
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

              setAddressSelected(v);
            }}
            value={addressSelected}
            className="max-h-[144px] overflow-y-scroll"
          >
            {data.address_list &&
              data.address_list.map((address, idx) => (
                <Label
                  htmlFor={`address_${idx}`}
                  key={idx}
                  className="flex items-center space-x-2 py-3 px-2 border cursor-pointer rounded-lg [&:has([data-state=checked])]:border-primary text-muted-foreground [&:has([data-state=checked])>p]:text-black"
                >
                  <RadioGroupItem
                    value={address}
                    className="hidden"
                    id={`address_${idx}`}
                  />
                  <p>{address}</p>
                </Label>
              ))}
          </RadioGroup>
          <Input
            className={cn(
              "focus-visible:outline-0 focus-visible:ring-0 mt-2",
              addressSelected != "null"
                ? "text-muted-foreground"
                : data.address_list?.length || 0 > 0
                ? "border-primary"
                : ""
            )}
            required={addressSelected != "null"}
            placeholder={data.address_list ? "Địa chỉ khác" : undefined}
            type="text"
            onFocus={() => {
              setAddressSelected("null");
              setData((prev) => ({
                ...prev,
                address: addressInput,
              }));
            }}
            value={addressInput}
            onChange={(e) => {
              setAddressInput(e.target.value);
              setData((prev) => ({
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

const DisplayOrderProduct = ({
  product,
}: {
  product: {
    idx: number;
    prod_img: string;
    prod_name: string;
    unit: "CARTON" | "PACKAGED_GOODS";
    pack_spec: number;
    quantity: number;
  };
}) => {
  return (
    <div className="flex gap-2 flex-col min-[400px]:flex-row pb-2 border-b last:border-0">
      <div className="flex items-center min-[400px]:justify-end text-muted-foreground hover:bg-accent ">
        {product.idx}
      </div>
      <div className="relative shrink-0 rounded-lg aspect-square h-20 w-20 overflow-hidden">
        <Image
          fill
          src={product.prod_img}
          alt={product.prod_name}
          sizes="100vw"
        />
      </div>
      <div className="grid gap-1 w-full">
        <div>
          <Label>Tên sản phẩm</Label>
          <Input placeholder="Tên sản phẩm" />
        </div>
        <div>
          <Label>Đơn vị tính</Label>
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              className={cn(
                "w-full rounded-md",
                product.unit == "CARTON"
                  ? "bg-accent"
                  : "hover:bg-accent border border-accent"
              )}
            >
              Thùng
            </button>
            <button
              type="button"
              className={cn(
                "w-full rounded-md",
                product.unit == "PACKAGED_GOODS"
                  ? "bg-accent"
                  : "hover:bg-accent border border-accent"
              )}
            >
              Sản phẩm
            </button>
          </div>
        </div>
        <div>
          <Label>Số lượng</Label>
          <div className="flex items-center gap-0.5">
            {product.unit == "CARTON" && (
              <>
                <Input placeholder="Số lượng thùng" />
                <p className="text-muted-foreground text-sm shrink-0">
                  thùng <span>/</span>
                </p>
              </>
            )}
            <Input placeholder={product.unit == "CARTON" ? "Quy cách" : ""} />
            <p className="text-muted-foreground text-sm shrink-0">sản phẩm</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Step3 = () => {
  const { step } = useDisplayOrder();

  if (step != 3) return;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold">Thông tin đơn hàng</h4>
        <button type="button" className="cursor-pointer text-muted-foreground">
          <PlusIcon className="h-5 w-5 shrink-0" />
        </button>
      </div>
      <div className="grid gap-2 ">
        {/* <p className="text-muted-foreground text-center">
          Chưa có sản phẩm.{" "}
          <button type="button" className="font-bold cursor-pointer">
            Thêm
          </button>
        </p> */}
        <DisplayOrderProduct
          product={{
            idx: 1,
            prod_img: product.prod_img,
            prod_name: product.prod_name,
            pack_spec: product.pack_spec,
            quantity: 0,
            unit: "CARTON",
          }}
        />
        <DisplayOrderProduct
          product={{
            idx: 2,
            prod_img: product.prod_img,
            prod_name: product.prod_name,
            pack_spec: product.pack_spec,
            quantity: 0,
            unit: "CARTON",
          }}
        />
        <DisplayOrderProduct
          product={{
            idx: 3,
            prod_img: product.prod_img,
            prod_name: product.prod_name,
            pack_spec: product.pack_spec,
            quantity: 0,
            unit: "CARTON",
          }}
        />
      </div>
    </div>
  );
};

const Step4 = () => {
  const { step, setData, data } = useDisplayOrder();

  if (step != 4) return;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numbersOnly = rawValue.replace(/[^0-9]/g, "");
    const processedValue = numbersOnly.replace(/^0+/, "") || "";
    setData((prev) => ({
      ...prev,
      priority: Math.min(Number(processedValue), 100),
    }));
  };
  return (
    <div>
      <h4 className="font-semibold mb-4">Thông tin đơn hàng</h4>
      <div className="grid gap-2">
        <div className="grid gap-1">
          <Label htmlFor="priority">Ưu tiên</Label>
          <Input
            id="priority"
            required
            value={data.priority}
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

  console.log(data);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(data);
  };

  const disabledBtn = React.useMemo(() => {
    return !data.id;
  }, [data]);

  return (
    <form onSubmit={handleSubmit}>
      <Separator className="my-2" />
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
          disabled={disabledBtn}
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
