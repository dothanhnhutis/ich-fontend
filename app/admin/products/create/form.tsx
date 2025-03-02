"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CropImage from "@/components/crop-image";
import { ImageUpscaleIcon, PlusIcon, Trash2Icon } from "lucide-react";
import NextImage from "next/image";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { createProductAction } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type CreateProductActionData = {
  prod_name: string;
  images: {
    srcUpload: string;
    fileUpload: File;
    srcCropped: string;
    fileCropped: File;
  }[];
  pack_spec: number;
};

const CreateProductForm = () => {
  const router = useRouter();
  const [formData, setFormData] = React.useState<CreateProductActionData>({
    prod_name: "",
    images: [],
    pack_spec: 0,
  });

  const [imageSelected, setImageSelected] = React.useState<{
    index: number;
    file: File;
  } | null>(null);

  const handleEditImage = (index: number, file: File) => {
    setImageSelected({
      index,
      file,
    });
  };

  const handleDeleteImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => index != idx),
    }));
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CreateProductActionData) => {
      const images = data.images.map((image) => image.fileCropped);
      return await createProductAction({
        pack_spec: data.pack_spec,
        prod_name: data.prod_name,
        images,
      });
    },
    onSuccess(data) {
      console.log(data);
      if (data.success) {
        toast.success(data.message);
        router.push("/admin/products");
        setFormData({
          pack_spec: 0,
          prod_name: "",
          images: [],
        });
      } else {
        toast.error(data.message);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <div>
          <Label>Hình ảnh</Label>
          <div className="flex flex-wrap gap-2">
            {formData.images.map((data, idx) => (
              <div
                key={idx}
                className="relative outline-none bg-muted h-[100px] w-[100px] aspect-square overflow-hidden rounded-lg group"
              >
                <div className="h-[100px] w-[100px]  text-white z-20 absolute top-0 left-0 bg-black/30 flex gap-2 items-center justify-center invisible group-hover:visible">
                  <button
                    onClick={() => handleDeleteImage(idx)}
                    type="button"
                    className="cursor-pointer"
                  >
                    <Trash2Icon className="h-4 w-4 shrink-0" />
                  </button>
                  <button
                    onClick={() => handleEditImage(idx, data.fileUpload)}
                    type="button"
                    className="cursor-pointer"
                  >
                    <ImageUpscaleIcon className="h-4 w-4 shrink-0" />
                  </button>
                </div>
                <NextImage
                  className="object-contain"
                  src={data.srcCropped}
                  alt={`image-${idx}`}
                  sizes="100wv"
                  fill
                />
              </div>
            ))}

            {imageSelected && (
              <CropImage
                aspectRatios={["1:1", "4:3", "16:9"]}
                imageFile={imageSelected.file}
                onSave={(data) => {
                  setFormData((prev) => ({
                    ...prev,
                    images: prev.images.map((image, idx) =>
                      idx != imageSelected.index
                        ? image
                        : {
                            ...image,
                            srcCropped: data.srcCropped,
                            fileCropped: data.fileCropped,
                          }
                    ),
                  }));
                  setImageSelected(null);
                }}
                onCloseModal={() => {
                  setImageSelected(null);
                }}
              >
                <div className="flex text-muted-foreground hover:bg-accent cursor-pointer items-center justify-center h-[100px] w-[100px] border rounded-lg">
                  <PlusIcon className="w-5 h-5 shrink-0" />
                </div>
              </CropImage>
            )}
            {formData.images.length <= 9 && (
              <CropImage
                aspectRatios={["1:1", "4:3", "16:9"]}
                onSave={(data) => {
                  setFormData((prev) => ({
                    ...prev,
                    images: [...prev.images, data],
                  }));
                }}
              >
                <div className="flex text-muted-foreground hover:bg-accent cursor-pointer items-center justify-center h-[100px] w-[100px] border rounded-lg">
                  <PlusIcon className="w-5 h-5 shrink-0" />
                </div>
              </CropImage>
            )}
          </div>
        </div>
        <div>
          <Label>Tên sản phẩm</Label>
          <Input
            required
            value={formData.prod_name}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                prod_name: e.target.value,
              }))
            }
          />
        </div>
        <div>
          <Label>Quy cách đóng thùng</Label>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Số sản phẩm trong một thùng khi giao cho khách hàng.
            </p>
            <div className="flex gap-1 items-center">
              <Input
                required
                type="text"
                className="w-[100px]"
                value={formData.pack_spec}
                onChange={(e) => {
                  const rawValue = e.target.value;
                  const numbersOnly = rawValue.replace(/[^0-9]/g, "");
                  const processedValue = numbersOnly.replace(/^0+/, "") || "";
                  setFormData((prev) => ({
                    ...prev,
                    pack_spec: Math.min(Number(processedValue), 10000),
                  }));
                }}
              />
              <p className="text-xs text-muted-foreground shrink-0">
                sản phẩm / thùng
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 justify-end items-center">
          <Button type="button" variant="ghost" disabled={isPending}>
            Huỷ
          </Button>
          <Button disabled={formData.prod_name == "" || isPending}>Tạo</Button>
        </div>
      </div>
    </form>
  );
};

export default CreateProductForm;
