"use client";
import React from "react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn, generateUniqueID } from "@/lib/utils";
import {
  ChevronRightIcon,
  GripVerticalIcon,
  MessageCircleWarningIcon,
  PackageOpenIcon,
  PackagePlusIcon,
  PackageXIcon,
  Trash2Icon,
} from "lucide-react";
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

const products: Product[] = [
  {
    id: "1",
    pack_spec: 100,
    prod_img:
      "https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792756/ich/z6113933456468_cadbdc1dd04475224e7c8632416aaa5d_kfsyxj.jpg",
    prod_name: "Face / Kem Face",
  },
  {
    id: "2",
    pack_spec: 10,
    prod_img:
      "https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792756/ich/z6113933456468_cadbdc1dd04475224e7c8632416aaa5d_kfsyxj.jpg",
    prod_name: "Rau ma",
  },
  {
    id: "3",
    pack_spec: 0,
    prod_img:
      "https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792756/ich/z6113933456468_cadbdc1dd04475224e7c8632416aaa5d_kfsyxj.jpg",
    prod_name: "TONE UP SUNCREEN",
  },
  {
    id: "4",
    pack_spec: 0,
    prod_img:
      "https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792756/ich/z6113933456468_cadbdc1dd04475224e7c8632416aaa5d_kfsyxj.jpg",
    prod_name: "GEL CLEANSER COLLAGEN",
  },
];

type DisplayOrderProduct = {
  id: string;
  prod_name: string;
  prod_img: string;
  unit: "PACKAGED_GOODS" | "CARTON";
  pack_spec: number;
  quantity: number;
  notes: { id: string; value: string }[];
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
      <Label
        htmlFor="cus_name"
        className="after:ml-0.5 after:text-red-500 after:content-['*']"
      >
        Khách hàng
      </Label>
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

      <p className="text-muted-foreground text-sm">
        Chọn một khách hàng để tiếp tục
      </p>
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
          <Label
            htmlFor="cus_name"
            className="after:ml-0.5 after:text-red-500 after:content-['*']"
          >
            Tên khách hàng
          </Label>
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

const Note = ({
  note,
  prod_id,
}: {
  prod_id: string;
  note: {
    id: string;
    value: string;
  };
}) => {
  const { setData } = useDisplayOrder();

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({
      ...prev,
      products: prev.products.map((prod) =>
        prod.id == prod_id
          ? {
              ...prod,
              notes: prod.notes.map((n) =>
                n.id != note.id
                  ? n
                  : {
                      id: note.id,
                      value: e.target.value,
                    }
              ),
            }
          : prod
      ),
    }));
  };

  const handleDelete = () => {
    setData((prev) => ({
      ...prev,
      products: prev.products.map((prod) =>
        prod.id == prod_id
          ? {
              ...prod,
              notes: prod.notes.filter((n) => n.id != note.id),
            }
          : prod
      ),
    }));
  };

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      ...note,
      data: {
        type: "note",
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center w-full grow gap-1"
    >
      <div className="flex gap-2 items-center border rounded-md w-full">
        <button
          {...listeners}
          {...attributes}
          type="button"
          className="text-muted-foreground cursor-grab px-1"
        >
          <GripVerticalIcon className="shrink h-4 w-4" />
        </button>
        <input
          className="h-10 w-full focus-visible:ring-0 focus-visible:outline-0 pr-2"
          type="text"
          name=""
          value={note.value}
          onChange={handleOnchange}
        />
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleDelete}
            type="button"
            className="text-muted-foreground cursor-pointer px-1"
          >
            <Trash2Icon className="shrink h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Xoá ghi chú</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

const DisplayOrderProduct = ({
  product,
  index,
}: {
  product: DisplayOrderProduct;
  index: number;
}) => {
  const { setData } = useDisplayOrder();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    ...product,
    data: {
      type: "product",
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleAddProduct = () => {
    setData((prev) => ({
      ...prev,
      products: prev.products.map((prod) =>
        prod.id == product.id
          ? {
              ...product,
              notes: [...product.notes, { id: generateUniqueID(), value: "" }],
            }
          : prod
      ),
    }));
  };

  const handleRemoveProduct = () => {
    setData((prev) => ({
      ...prev,
      products: prev.products.filter(({ id }) => product.id != id),
    }));
  };

  const handleOnchangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({
      ...prev,
      products: prev.products.map((prod) =>
        prod.id == product.id
          ? {
              ...product,
              prod_name: e.target.value,
            }
          : prod
      ),
    }));
  };

  const handleOnchangeUnit = (value: "PACKAGED_GOODS" | "CARTON") => {
    setData((prev) => ({
      ...prev,
      products: prev.products.map((prod) =>
        prod.id == product.id
          ? {
              ...product,
              unit: value,
              quantity: Math.min(product.quantity, 100),
            }
          : prod
      ),
    }));
  };

  const handleOnchangeProdSpec = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numbersOnly = rawValue.replace(/[^0-9]/g, "");
    const processedValue = numbersOnly.replace(/^0+/, "") || "";
    setData((prev) => ({
      ...prev,
      products: prev.products.map((prod) =>
        prod.id == product.id
          ? {
              ...product,
              pack_spec: Math.min(Number(processedValue), 1000),
            }
          : prod
      ),
    }));
  };

  const handleOnchangeQuality = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numbersOnly = rawValue.replace(/[^0-9]/g, "");
    const processedValue = numbersOnly.replace(/^0+/, "") || "";
    setData((prev) => ({
      ...prev,
      products: prev.products.map((prod) =>
        prod.id == product.id
          ? {
              ...product,
              quantity: Math.min(
                Number(processedValue),
                product.unit == "CARTON" ? 100 : 100000
              ),
            }
          : prod
      ),
    }));
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex gap-1 border-b last:border-0 pb-2 relative p-2 bg-white",
        isDragging ? "z-10 border rounded-md" : ""
      )}
    >
      <div className="absolute top-2 right-2 flex gap-2 items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleAddProduct}
              className="cursor-pointer text-muted-foreground"
            >
              <MessageCircleWarningIcon className="shrink-0 h-5 w-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Thêm ghi chú </p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleRemoveProduct}
              className="cursor-pointer text-muted-foreground"
            >
              <PackageXIcon className="shrink-0 h-5 w-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Xoá sản phẩm</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div
        {...listeners}
        {...attributes}
        className="flex items-center rounded-md px-0.5 cursor-grab min-[400px]:justify-end text-muted-foreground hover:bg-accent shrink-0"
      >
        {index}
      </div>
      <div className="flex gap-2 flex-col min-[400px]:flex-row w-full">
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
            <Input
              value={product.prod_name}
              onChange={handleOnchangeName}
              placeholder="Tên sản phẩm"
            />
          </div>
          <div>
            <Label>Đơn vị tính</Label>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => handleOnchangeUnit("CARTON")}
                type="button"
                className={cn(
                  "w-full rounded-md border border-accent",
                  product.unit == "CARTON" ? "bg-accent" : "hover:bg-accent"
                )}
              >
                Thùng
              </button>
              <button
                onClick={() => handleOnchangeUnit("PACKAGED_GOODS")}
                type="button"
                className={cn(
                  "w-full rounded-md border border-accent",
                  product.unit == "PACKAGED_GOODS"
                    ? "bg-accent"
                    : "hover:bg-accent"
                )}
              >
                Sản phẩm
              </button>
            </div>
          </div>
          <div>
            <Label>Số lượng</Label>
            <div className="flex items-center gap-0.5">
              <Input
                value={product.quantity}
                onChange={handleOnchangeQuality}
                placeholder="Số lượng thùng"
              />
              {product.unit == "CARTON" && (
                <>
                  <p className="text-muted-foreground text-sm shrink-0">
                    thùng <span>/</span>
                  </p>
                  <Input
                    value={product.pack_spec}
                    onChange={handleOnchangeProdSpec}
                    placeholder={product.unit == "CARTON" ? "Quy cách" : ""}
                  />
                </>
              )}

              <p className="text-muted-foreground text-sm shrink-0">sản phẩm</p>
            </div>
          </div>
          {product.notes.length > 0 && (
            <div>
              <Label>Ghi chú</Label>
              <div className="grid gap-1">
                <SortableContext
                  items={product.notes}
                  strategy={verticalListSortingStrategy}
                >
                  {product.notes.map((note) => (
                    <Note key={note.id} note={note} prod_id={product.id} />
                  ))}
                </SortableContext>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({
  product,
  selected,
  handleSelect,
}: {
  product: Product;
  selected: boolean;
  handleSelect: (product: Product) => void;
}) => {
  return (
    <div
      className={cn(
        "grid items-center justify-center border gap-1 py-2 rounded-lg cursor-pointer ",
        selected ? "border-primary" : "hover:bg-accent"
      )}
      onClick={() => handleSelect(product)}
    >
      <div className="mx-auto relative shrink-0 rounded-lg aspect-square h-20 w-20 overflow-hidden">
        <Image
          fill
          src={product.prod_img}
          alt={product.prod_name}
          sizes="100vw"
        />
      </div>
      <div className="text-muted-foreground text-center px-2">
        <p className="line-clamp-2 text-sm">{product.prod_name}</p>
        {product.pack_spec != 0 && (
          <p className="text-xs">{product.pack_spec} sp/thùng</p>
        )}
      </div>
    </div>
  );
};

type Product = {
  id: string;
  prod_name: string;
  prod_img: string;
  pack_spec: number;
};

const DisplayOrderProductDialog = ({ products }: { products: Product[] }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const { setData } = useDisplayOrder();

  const [productSelected, setProductSelected] = React.useState<Product[]>([]);

  React.useEffect(() => {
    if (!open) {
      setProductSelected([]);
    }
  }, [open]);

  const handleAdd = () => {
    const newProd: CreateDisplayOrderData["products"] = productSelected.map(
      (prod) => ({
        id: generateUniqueID(),
        prod_name: prod.prod_name,
        prod_img: prod.prod_img,
        pack_spec: prod.pack_spec,
        quantity: 1,
        unit: prod.pack_spec == 0 ? "PACKAGED_GOODS" : "CARTON",
        notes: [
          {
            id: generateUniqueID(),
            value: "value 1",
          },
          {
            id: generateUniqueID(),
            value: "value 2",
          },
          {
            id: generateUniqueID(),
            value: "value 3",
          },
        ],
      })
    );

    setData((prev) => ({
      ...prev,
      products: [...prev.products, ...newProd],
    }));
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <button
              type="button"
              className="cursor-pointer text-muted-foreground"
            >
              <PackagePlusIcon className="h-5 w-5 shrink-0" />
            </button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Thêm sản phẩm đã tạo</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Danh sách sản phẩm</DialogTitle>
          <DialogDescription>
            Chọn các sản phẩm muốn thêm vào đơn hàng
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 min-[430px]:grid-cols-2 sm:grid-cols-3 gap-2 max-h-[324px] overflow-y-scroll">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              selected={!!productSelected.find(({ id }) => product.id == id)}
              handleSelect={(product: Product) => {
                const prod = productSelected.find(({ id }) => product.id == id);

                if (!prod) {
                  setProductSelected((prev) => [...prev, product]);
                } else {
                  setProductSelected((prev) =>
                    prev.filter((prod) => prod.id != product.id)
                  );
                }
              }}
            />
          ))}
        </div>

        <DialogFooter>
          <Button
            type="submit"
            className="cursor-pointer"
            onClick={handleAdd}
            disabled={productSelected.length == 0}
          >
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Step3 = () => {
  const { step, data, setData } = useDisplayOrder();

  // const handleDragOver = (event: DragOverEvent) => {
  //   const { active, over } = event;

  //   if (!over || active.id === over.id) {
  //     return;
  //   }

  //   console.log("handleDragOver active", active);
  //   console.log("handleDragOver over", over);
  // };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    console.log("handleDragEnd active", active);
    console.log("handleDragEnd over", over);

    if (
      active.data.current &&
      active.data.current.type == "product" &&
      over.data.current &&
      over.data.current.type == "product"
    ) {
      console.log("product");
      const oldIndex = data.products
        .map((prod) => prod.id)
        .indexOf(active.id as string);
      const newIndex = data.products
        .map((prod) => prod.id)
        .indexOf(over.id as string);

      setData((prev) => ({
        ...prev,
        products: arrayMove(data.products, oldIndex, newIndex),
      }));
    } else if (
      active.data.current &&
      active.data.current.type == "note" &&
      over.data.current &&
      over.data.current.type == "note"
    ) {
      console.log("note");
    }

    // const oldIndex = data.products
    //   .map((prod) => prod.id)
    //   .indexOf(active.id as string);
    // const newIndex = data.products
    //   .map((prod) => prod.id)
    //   .indexOf(over.id as string);

    // setData((prev) => ({
    //   ...prev,
    //   products: arrayMove(data.products, oldIndex, newIndex),
    // }));
  };

  if (step != 3) return;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h4 className="font-semibold w-full">Thông tin đơn hàng</h4>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="cursor-pointer text-muted-foreground"
            >
              <PackageOpenIcon className="h-5 w-5 shrink-0" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Thêm sản phẩm mới</p>
          </TooltipContent>
        </Tooltip>

        <DisplayOrderProductDialog products={products} />
      </div>

      <div className="grid gap-2 ">
        {data.products.length == 0 ? (
          <p className="text-muted-foreground text-center">Chưa có sản phẩm.</p>
        ) : (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={data.products}
              strategy={verticalListSortingStrategy}
            >
              {data.products.map((product, index) => (
                <DisplayOrderProduct
                  index={index + 1}
                  key={product.id}
                  product={product}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
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
      <h4 className="font-semibold mb-4">Cấu hình hiển thị</h4>
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

  const disabledNextBtn = React.useMemo(() => {
    if (step == 1) {
      return !data.id;
    } else if (step == 2) {
      return data.cus_name == "";
    } else if (step == 3) {
      return (
        data.products.length == 0 ||
        data.products.some(
          (prod) =>
            prod.prod_name == "" ||
            prod.prod_img == "" ||
            (prod.pack_spec == 0 && prod.unit == "CARTON") ||
            prod.quantity == 0
        )
      );
    }
    return false;
  }, [data, step]);

  const handleBackBtn = () => {
    setStep((prev) => (prev == 4 ? 3 : prev == 3 ? 2 : prev == 2 ? 1 : 1));
  };

  const handleNextBtn = () => {
    setStep((prev) => (prev == 1 ? 2 : prev == 2 ? 3 : prev == 3 ? 4 : 4));
  };

  return (
    <TooltipProvider>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-1 items-center text-xs min-[430px]:text-sm text-muted-foreground">
          <p className={step == 1 ? "text-black" : ""}>
            Bước 1: Chọn khách hàng
          </p>
          <ChevronRightIcon className="shrink-0 w-4 h-4" />
          <p className={step == 2 ? "text-black" : ""}>
            Bước 2: Thông tin khách hàng
          </p>
          <ChevronRightIcon className="shrink-0 w-4 h-4" />
          <p className={step == 3 ? "text-black" : ""}>
            Bước 3: Thông tin đơn hàng
          </p>
          <ChevronRightIcon className="shrink-0 w-4 h-4" />
          <p className={step == 4 ? "text-black" : ""}>
            Bước 4: Cấu hình hiển thị
          </p>
        </div>
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
            <Button variant="ghost" type="button" onClick={handleBackBtn}>
              Trở về
            </Button>
          )}

          <Button
            disabled={disabledNextBtn}
            onClick={handleNextBtn}
            type={step == 3 ? "submit" : "button"}
          >
            {step == 1 || step == 2 || step == 3 ? "Kế tiếp" : "Tạo"}
          </Button>
        </div>
      </form>
    </TooltipProvider>
  );
};

export default CreateDisplayOrderForm;
