"use client";
import React from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import CropImage from "@/components/crop-image";
import { cn } from "@/lib/utils";

type CreateProductFormData = {
  prodName: string;
  packSpec: string;
  images: {
    fileCropped: File;
    fileUpload: File;
    srcCropped: string;
    srcUpload: string;
  }[];
};

const ImageProductGrid = () => {
  return (
    <div className="flex items-center flex-wrap gap-1 min-[324px]:grid min-[324px]:grid-cols-4 min-[324px]:w-[268px]">
      <ImageProduct isMain={true} />
      <ImageProduct />
      <ImageProduct />
      <ImageProduct />
      <ImageProduct />
      <ImageProduct />
      <ImageProduct />
      <ImageProduct />
      <ImageProduct />
    </div>
  );
};

const ImageProduct = ({
  isMain,
  isUpload,
  image,
}: {
  isMain?: boolean;
  isUpload?: boolean;
  image?: CreateProductFormData["images"][number];
}) => {
  const classContainer: string = isMain
    ? "relative overflow-hidden h-16 w-16 rounded-md border min-[324px]:h-[132px] min-[324px]:w-[132px] min-[324px]:col-span-2 min-[324px]:row-span-2"
    : "relative overflow-hidden h-16 w-16 rounded-md border";

  const children = (
    <div className={cn(classContainer, isUpload ? "hover:border-primary" : "")}>
      {image ? (
        <Image
          className="object-contain"
          priority
          fill
          src="https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792753/ich/z5974402587004_71c5e83969511daeadd3003bbbfdfce4_hrr11j.jpg"
          alt="upload"
          sizes="40px"
        />
      ) : null}
    </div>
  );

  return !isUpload ? (
    children
  ) : (
    <CropImage
      aspectRatios={["4:3", "1:1"]}
      onSave={(data) => {
        console.log(data);
      }}
    >
      {children}
    </CropImage>
  );
};

const CreateProductForm = () => {
  const [formData, setFormData] = React.useState<CreateProductFormData>({
    prodName: "123",
    packSpec: "123",
    images: [],
  });

  return (
    <form>
      <div className="flex flex-col sm:flex-row gap-2 pb-5">
        <div className="grid gap-2 w-full">
          <Label>Hình sản phẩm</Label>

          <div className="flex items-center flex-wrap gap-1 min-[324px]:grid min-[324px]:grid-cols-4 min-[324px]:w-[268px]">
            <ImageProduct isMain={true} isUpload={true} />
            <ImageProduct />
            <ImageProduct />
            <ImageProduct />
            <ImageProduct />
            <ImageProduct />
            <ImageProduct />
            <ImageProduct />

            <label id="upload1">
              <input
                type="file"
                name="upload1"
                id="upload1"
                className="hidden"
              />
              <div className="relative overflow-hidden h-16 w-16 rounded-md border min-[324px]:h-[132px] min-[324px]:w-[132px] min-[324px]:col-span-2 min-[324px]:row-span-2"></div>
            </label>

            {/* <div className="relative overflow-hidden h-16 w-16 rounded-md min-[324px]:h-[132px] min-[324px]:w-[132px] min-[324px]:col-span-2 min-[324px]:row-span-2">
              <Image
                className="object-contain"
                priority
                fill
                src="https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792753/ich/z5974402587004_71c5e83969511daeadd3003bbbfdfce4_hrr11j.jpg"
                alt="product"
                sizes="100vw"
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
            </div> */}
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <div className="grid gap-2">
            <Label htmlFor="prodName">Tên sản phẩm</Label>
            <Input
              id="prodName"
              name="prodName"
              type="text"
              value={formData.prodName}
              required
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, prodName: e.target.value }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="packSpec">Quy cách</Label>
            <Input
              id="packSpec"
              name="packSpec"
              type="text"
              required
              value={formData.packSpec}
              onChange={(e) => {
                const rawValue = e.target.value;
                const numbersOnly = rawValue.replace(/[^0-9]/g, "");
                const processedValue = numbersOnly.replace(/^0+/, "");
                console.log(processedValue);
                setFormData((prev) => ({ ...prev, packSpec: processedValue }));
              }}
            />
          </div>
        </div>
      </div>
      <Separator />
      <div className="flex gap-2 justify-end items-center py-2">
        <Button variant="ghost" type="button" asChild>
          <Link href="/admin/products">Huỷ</Link>
        </Button>
        <Button>Tạo</Button>
      </div>
    </form>
  );
};

export default CreateProductForm;
