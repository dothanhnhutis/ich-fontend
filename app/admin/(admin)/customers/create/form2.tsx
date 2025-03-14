"use client";
import React, { Fragment } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChevronRightIcon, EllipsisIcon, PlusIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  CreateCustomerFormData,
  useCreateCustomer,
} from "./create-customer-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import Image from "next/image";

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

const StorageForm = ({
  editData,
  onCloseModal,
}: {
  editData?: {
    index: number;
    data: CreateCustomerFormData["storages"][number];
  };
  onCloseModal?: () => void;
}) => {
  const { addStorage, editStorage } = useCreateCustomer();
  const [open, setOpen] = React.useState<boolean>(!!editData);

  const [storage, setStorage] = React.useState<
    CreateCustomerFormData["storages"][number]
  >(
    editData
      ? editData.data
      : {
          storekeeper: "",
          phone_number: "",
          address: "",
        }
  );

  React.useEffect(() => {
    if (!open) {
      if (onCloseModal) onCloseModal();
      setStorage({
        storekeeper: "",
        phone_number: "",
        address: "",
      });
    }
  }, [onCloseModal, open]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStorage((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editData) {
      editStorage(editData.index, storage);
    } else {
      addStorage(storage);
    }
    setOpen(false);
  };

  let btn: React.JSX.Element | undefined;

  if (!editData) {
    btn = (
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex gap-0.5 text-primary cursor-pointer"
        >
          <PlusIcon className="shrink h-4 w-4" />
          <span className="text-xs hidden sm:inline">Thêm kho</span>
        </button>
      </DialogTrigger>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {btn}
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {" "}
              {editData ? "Chỉnh sửa kho" : "Thêm kho"}
            </DialogTitle>
            <DialogDescription hidden></DialogDescription>
          </DialogHeader>
          <div
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="grid gap-4 py-4"
          >
            <div className="grid items-center gap-1">
              <Label htmlFor="storekeeper">Tên thủ kho</Label>
              <Input
                value={storage.storekeeper}
                onChange={handleOnChange}
                id="storekeeper"
                name="storekeeper"
                required
              />
            </div>
            <div className="grid items-center gap-1">
              <Label htmlFor="phone_number">Số điện thoại</Label>
              <Input
                value={storage.phone_number}
                onChange={handleOnChange}
                id="phone_number"
                name="phone_number"
                required
              />
            </div>
            <div className="grid items-center gap-1">
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                value={storage.address}
                onChange={handleOnChange}
                id="address"
                name="address"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{editData ? "Lưu" : "Thêm"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Step2 = () => {
  const {
    step,
    removeStorage,
    formData: { storages },
  } = useCreateCustomer();

  const [selectStorage, setSelectStorage] = React.useState<{
    index: number;
    data: CreateCustomerFormData["storages"][number];
  }>();

  if (step != 2) return;

  return (
    <>
      <div className="flex items-center justify-between gap-1">
        <Label>Danh sách kho</Label>
        <StorageForm />
      </div>

      {selectStorage ? (
        <StorageForm
          editData={selectStorage}
          onCloseModal={() => {
            setSelectStorage(undefined);
          }}
        />
      ) : null}

      <div className="grid">
        {storages.length == 0 ? (
          <p className="text-muted-foreground text-sm text-center ">
            Chưa có kho nào.
          </p>
        ) : (
          storages.map((storage, index) => (
            <div
              key={index}
              className="relative grid gap-1 border-b group px-2 py-1"
            >
              <p>
                Thủ kho: <b>{storage.storekeeper}</b>
              </p>
              <p>
                SĐT: <b>{storage.phone_number}</b>
              </p>
              <p>
                Đ/c: <b>{storage.address}</b>
              </p>
              <div className="absolute top-0 right-0 flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="cursor-pointer p-1 text-center text-muted-foreground"
                    >
                      <EllipsisIcon className="shrink w-5 h-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="bottom" align="end">
                    <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() =>
                          setSelectStorage({
                            index,
                            data: storage,
                          })
                        }
                        className="cursor-pointer"
                      >
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => removeStorage(index)}
                        className="cursor-pointer"
                      >
                        Xoá
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

const Step3 = () => {
  const {
    step,
    formData: { products },
  } = useCreateCustomer();

  if (step != 3) return;

  return (
    <>
      <div className="flex items-center justify-between gap-1">
        <Label>Danh sách sản phẩm</Label>
        <div>Thêm sản phẩm</div>
      </div>

      <div className="grid">
        <p className="text-muted-foreground text-sm text-center ">
          Chưa có sản phẩm nào.
        </p>
        <div className="relative grid gap-1 border-b group px-2 py-1 ">
          <div className="flex flex-col gap-2">
            <div>
              <Label>Hình ảnh</Label>
              {/* <div className="flex items-center flex-wrap min-[324px]:grid min-[324px]:grid-cols-4 gap-1 min-[324px]:w-[268px] ">
                <div className="relative overflow-hidden h-16 w-16 min-[324px]:h-32 min-[324px]:w-32 min-[324px]:col-span-2 min-[324px]:row-span-2 rounded-md">
                  <Image
                    className="object-contain"
                    priority
                    fill
                    src="https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792753/ich/z5974402587004_71c5e83969511daeadd3003bbbfdfce4_hrr11j.jpg"
                    alt="product"
                    sizes="128px"
                  />
                </div>
                <div className="relative overflow-hidden h-16 w-16 rounded-md">
                  <Image
                    className="object-contain"
                    priority
                    fill
                    src="https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792753/ich/z5974402587004_71c5e83969511daeadd3003bbbfdfce4_hrr11j.jpg"
                    alt="product"
                    sizes="64px"
                  />
                </div>
                <div className="relative overflow-hidden h-16 w-16 rounded-md">
                  <Image
                    className="object-contain"
                    priority
                    fill
                    src="https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792753/ich/z5974402587004_71c5e83969511daeadd3003bbbfdfce4_hrr11j.jpg"
                    alt="product"
                    sizes="64px"
                  />
                </div>
                <div className="relative overflow-hidden h-16 w-16 rounded-md">
                  <Image
                    className="object-contain"
                    priority
                    fill
                    src="https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792753/ich/z5974402587004_71c5e83969511daeadd3003bbbfdfce4_hrr11j.jpg"
                    alt="product"
                    sizes="64px"
                  />
                </div>
                <div className="relative overflow-hidden h-16 w-16 rounded-md">
                  <Image
                    className="object-contain"
                    priority
                    fill
                    src="https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792753/ich/z5974402587004_71c5e83969511daeadd3003bbbfdfce4_hrr11j.jpg"
                    alt="product"
                    sizes="64px"
                  />
                </div>
                <div className="relative overflow-hidden h-16 w-16 rounded-md">
                  <Image
                    className="object-contain"
                    priority
                    fill
                    src="https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792753/ich/z5974402587004_71c5e83969511daeadd3003bbbfdfce4_hrr11j.jpg"
                    alt="product"
                    sizes="64px"
                  />
                </div>
                <div className="relative overflow-hidden h-16 w-16 rounded-md">
                  <Image
                    className="object-contain"
                    priority
                    fill
                    src="https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792753/ich/z5974402587004_71c5e83969511daeadd3003bbbfdfce4_hrr11j.jpg"
                    alt="product"
                    sizes="64px"
                  />
                </div>
                <div className="relative overflow-hidden h-16 w-16 rounded-md">
                  <Image
                    className="object-contain"
                    priority
                    fill
                    src="https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792753/ich/z5974402587004_71c5e83969511daeadd3003bbbfdfce4_hrr11j.jpg"
                    alt="product"
                    sizes="64px"
                  />
                </div>
                <div className="relative overflow-hidden h-16 w-16 rounded-md">
                  <Image
                    className="object-contain"
                    priority
                    fill
                    src="https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792753/ich/z5974402587004_71c5e83969511daeadd3003bbbfdfce4_hrr11j.jpg"
                    alt="product"
                    sizes="64px"
                  />
                </div>
              </div> */}

              <div className="flex items-center flex-wrap gap-1 min-[324px]:grid min-[324px]:grid-cols-4 min-[324px]:w-[268px]">
                <div className="relative overflow-hidden h-16 w-16 rounded-md min-[324px]:h-[132px] min-[324px]:w-[132px] min-[324px]:col-span-2 min-[324px]:row-span-2">
                  <Image
                    className="object-contain"
                    priority
                    fill
                    src="https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792753/ich/z5974402587004_71c5e83969511daeadd3003bbbfdfce4_hrr11j.jpg"
                    alt="product"
                    sizes="128px"
                  />
                </div>
                <div className="relative overflow-hidden h-16 w-16 rounded-md">
                  <Image
                    className="object-contain"
                    priority
                    fill
                    src="https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792753/ich/z5974402587004_71c5e83969511daeadd3003bbbfdfce4_hrr11j.jpg"
                    alt="product"
                    sizes="64px"
                  />
                </div>
                <div className="relative overflow-hidden h-16 w-16 rounded-md">
                  <Image
                    className="object-contain"
                    priority
                    fill
                    src="https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792753/ich/z5974402587004_71c5e83969511daeadd3003bbbfdfce4_hrr11j.jpg"
                    alt="product"
                    sizes="64px"
                  />
                </div>
                <div className="relative overflow-hidden h-16 w-16 rounded-md">
                  <Image
                    className="object-contain"
                    priority
                    fill
                    src="https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792753/ich/z5974402587004_71c5e83969511daeadd3003bbbfdfce4_hrr11j.jpg"
                    alt="product"
                    sizes="64px"
                  />
                </div>
                <div className="relative overflow-hidden h-16 w-16 rounded-md">
                  <Image
                    className="object-contain"
                    priority
                    fill
                    src="https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792753/ich/z5974402587004_71c5e83969511daeadd3003bbbfdfce4_hrr11j.jpg"
                    alt="product"
                    sizes="64px"
                  />
                </div>
                <div className="relative overflow-hidden h-16 w-16 rounded-md">
                  <Image
                    className="object-contain"
                    priority
                    fill
                    src="https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792753/ich/z5974402587004_71c5e83969511daeadd3003bbbfdfce4_hrr11j.jpg"
                    alt="product"
                    sizes="64px"
                  />
                </div>
                <div className="relative overflow-hidden h-16 w-16 rounded-md">
                  <Image
                    className="object-contain"
                    priority
                    fill
                    src="https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792753/ich/z5974402587004_71c5e83969511daeadd3003bbbfdfce4_hrr11j.jpg"
                    alt="product"
                    sizes="64px"
                  />
                </div>
                <div className="relative overflow-hidden h-16 w-16 rounded-md">
                  <Image
                    className="object-contain"
                    priority
                    fill
                    src="https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792753/ich/z5974402587004_71c5e83969511daeadd3003bbbfdfce4_hrr11j.jpg"
                    alt="product"
                    sizes="64px"
                  />
                </div>
                <div className="relative overflow-hidden h-16 w-16 rounded-md">
                  <Image
                    className="object-contain"
                    priority
                    fill
                    src="https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792753/ich/z5974402587004_71c5e83969511daeadd3003bbbfdfce4_hrr11j.jpg"
                    alt="product"
                    sizes="64px"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div>
                <Label>Tên sản phẩm</Label>
                <p>ádasd</p>
              </div>
              <div>
                <Label>Quy cách</Label>
                <p>ádasd</p>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="cursor-pointer p-1 text-center text-muted-foreground"
                >
                  <EllipsisIcon className="shrink w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="end">
                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer">
                    Chỉnh sửa
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    Xoá
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  );
};

const CreateCustomerForm = () => {
  const { step, hasNext, back, next, disableNext } = useCreateCustomer();

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
        <Step3 />
        <div className="flex gap-2 justify-end items-center">
          <Button variant="ghost" type="button" asChild>
            <Link href="/admin/products">Huỷ</Link>
          </Button>
          {step > 1 && (
            <Button variant="ghost" type="button" onClick={back}>
              Trở về
            </Button>
          )}
          <Button
            disabled={disableNext}
            onClick={next}
            type={!hasNext ? "submit" : "button"}
          >
            {hasNext ? "Kế tiếp" : "Tạo"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CreateCustomerForm;
