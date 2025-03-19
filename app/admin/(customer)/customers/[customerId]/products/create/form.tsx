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
import { ImageIcon, ImageUpIcon, SquarePenIcon, TrashIcon } from "lucide-react";

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

const ProductImageContainer = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  return (
    <div className="flex items-center flex-wrap gap-1 min-[388px]:grid min-[388px]:grid-cols-4 min-[388px]:h-[248px] min-[388px]:w-[332px]">
      {children}
    </div>
  );
};

const ProductImage = ({
  isMain,
  isUpload,
  image,
  onSave,
  onDelete,
  onSelected,
}: {
  isMain?: boolean;
  isUpload?: boolean;
  image?: CreateProductFormData["images"][number];
  onSave?: (data: {
    srcUpload: string;
    fileUpload: File;
    srcCropped: string;
    fileCropped: File;
  }) => void;
  onDelete?: () => void;
  onSelected?: () => void;
  imageFile?: File;
}) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden h-20 w-20 rounded-md group",
        isMain
          ? "min-[388px]:h-[164px] min-[388px]:w-[164px] min-[388px]:col-span-2 min-[388px]:row-span-2"
          : "",
        image ? "" : isUpload ? "border hover:border-primary" : "border"
      )}
    >
      {image ? (
        <>
          <Image
            className="object-contain"
            priority
            fill
            src={image.srcCropped}
            alt="upload"
            sizes={isMain ? "164px" : "80px"}
          />
          <div className="absolute top-0 left-0 w-full h-full bg-black/20 text-white flex items-center justify-center gap-1 invisible group-hover:visible">
            <TrashIcon
              className={cn(
                "shrink-0 cursor-pointer",
                isMain ? "w-5 h-5" : "w-4 h-4"
              )}
              onClick={() => {
                if (onDelete) onDelete();
              }}
            />

            <SquarePenIcon
              className={cn(
                "shrink-0 cursor-pointer",
                isMain ? "w-5 h-5" : "w-4 h-4"
              )}
              onClick={onSelected}
            />
          </div>
        </>
      ) : isUpload ? (
        <CropImage
          aspectRatios={["1:1"]}
          minCropBoxHeight={80}
          minCropBoxWidth={80}
          fileAccess={["image/jpeg", "image/png", "image/jpg"]}
          className="flex items-center justify-center h-full w-full text-muted-foreground cursor-pointer"
          onSave={onSave}
        >
          <ImageUpIcon
            className={cn(
              "shrink-0 cursor-pointer",
              isMain ? "min-[388px]:w-12 min-[388px]:h-12" : "w-6 h-6"
            )}
          />
        </CropImage>
      ) : (
        <div className="flex items-center justify-center h-full w-full text-muted-foreground">
          <ImageIcon
            className={cn(
              "shrink-0",
              isMain ? "min-[388px]:w-12 min-[388px]:h-12" : "w-6 h-6"
            )}
          />
        </div>
      )}
    </div>
  );
};

const CreateProductForm = () => {
  const [formData, setFormData] = React.useState<CreateProductFormData>({
    prodName: "123",
    packSpec: "123",
    images: [],
  });

  const [editImageAt, setEditImageAt] = React.useState<number>(-1);

  return (
    <form>
      <div className="flex flex-col sm:flex-row gap-2 pb-5">
        <div className="grid gap-2 w-full">
          <Label>Hình sản phẩm</Label>
          <ProductImageContainer>
            {Array.from({ length: 9 }).map((_, idx) => (
              <ProductImage
                key={idx}
                isMain={idx == 0}
                isUpload={idx == formData.images.length}
                image={formData.images[idx] ?? undefined}
                onSave={(img) => {
                  setFormData((prev) => ({
                    ...prev,
                    images: [...prev.images, img],
                  }));
                }}
                onDelete={() => {
                  setFormData((prev) => ({
                    ...prev,
                    images: prev.images.filter((_, index) => idx != index),
                  }));
                }}
                onSelected={() => {
                  setEditImageAt(idx);
                }}
              />
            ))}
          </ProductImageContainer>
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

      <CropImage
        aspectRatios={["1:1"]}
        minCropBoxHeight={80}
        minCropBoxWidth={80}
        fileAccess={["image/jpeg", "image/png", "image/jpg"]}
        className="flex items-center justify-center h-full w-full text-muted-foreground cursor-pointer"
        imageFile={
          editImageAt == -1
            ? undefined
            : formData.images[editImageAt].fileUpload
        }
        onSave={(img) => {
          setFormData((prev) => ({
            ...prev,
            images: prev.images.map((image, index) =>
              index == editImageAt ? img : image
            ),
          }));
          setEditImageAt(-1);
        }}
        onCloseModal={() => {
          setEditImageAt(-1);
        }}
      />
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
