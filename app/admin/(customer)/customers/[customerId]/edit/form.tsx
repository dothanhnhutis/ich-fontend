"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CropImage from "@/components/crop-image";
import {
  ImageUpscaleIcon,
  PlusIcon,
  RotateCcwIcon,
  Trash2Icon,
} from "lucide-react";
import NextImage from "next/image";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Product,
  updateProductAction,
} from "../../../../(admin)/customers/actions";
import { cn, convertUrlToFile } from "@/lib/utils";
import Link from "next/link";

type UpdateProductImage =
  | {
      type: "init";
      url: string;
    }
  | {
      type: "new";
      srcUpload: string;
      fileUpload: File;
      srcCropped: string;
      fileCropped: File;
    }
  | {
      type: "deleted";
      url: string;
    }
  | {
      type: "updated";
      url: string;
      srcUpload: string;
      fileUpload: File;
      srcCropped: string;
      fileCropped: File;
    };

type UpdateProductFormData = {
  prod_name: string;
  images: UpdateProductImage[];
  pack_spec: number;
};

const UpdateProductForm = ({ product }: { product: Product }) => {
  const router = useRouter();
  const [formData, setFormData] = React.useState<UpdateProductFormData>({
    prod_name: "",
    images: [],
    pack_spec: 0,
  });

  React.useEffect(() => {
    setFormData(() => ({
      prod_name: product.prod_name,
      pack_spec: product.pack_spec,
      images: product.images.map((img) => ({
        type: "init",
        url: img,
      })),
    }));
  }, [product]);

  const imageExists = React.useMemo(() => {
    return formData.images.filter((img) => img.type != "deleted");
  }, [formData.images]);

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
    const targetImg = formData.images[index]!;
    if (targetImg.type == "new") {
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, idx) => index != idx),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        images: prev.images.map((img, idx) =>
          index == idx
            ? {
                type: "deleted",
                url: img.type != "new" ? img.url : "",
              }
            : img
        ),
      }));
    }
  };

  const handleRestoreImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, idx) =>
        index == idx
          ? {
              type: "init",
              url: img.type == "deleted" ? img.url : "",
            }
          : img
      ),
    }));
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: UpdateProductFormData) => {
      const images = formData.images
        .filter((image) => image.type != "deleted")
        .map((image) => (image.type == "init" ? image.url : image.fileCropped));
      return await updateProductAction(product.id, {
        pack_spec: data.pack_spec,
        prod_name: data.prod_name,
        images,
      });
    },
    onSuccess(data) {
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
            {formData.images.map((img, idx) => (
              <div
                key={idx}
                className="relative outline-none bg-muted h-[100px] w-[100px] aspect-square overflow-hidden rounded-lg group"
              >
                <div
                  className={cn(
                    "h-[100px] w-[100px] text-white z-20 absolute top-0 left-0 bg-black/30 flex gap-2 items-center justify-center",
                    img.type == "deleted"
                      ? "visible"
                      : "invisible group-hover:visible"
                  )}
                >
                  {img.type == "deleted" ? (
                    imageExists.length < 9 ? (
                      <button
                        onClick={() => handleRestoreImage(idx)}
                        type="button"
                        className="cursor-pointer"
                      >
                        <RotateCcwIcon className="h-4 w-4 shrink-0" />
                      </button>
                    ) : (
                      <></>
                    )
                  ) : (
                    <>
                      <button
                        onClick={() => handleDeleteImage(idx)}
                        type="button"
                        className="cursor-pointer"
                      >
                        <Trash2Icon className="h-4 w-4 shrink-0" />
                      </button>
                      <button
                        onClick={async () => {
                          if (img.type == "init") {
                            const file = await convertUrlToFile(img.url!);
                            if (file) {
                              handleEditImage(idx, file);
                            }
                          } else if (img.type == "new") {
                            handleEditImage(idx, img.fileUpload!);
                          } else if (img.type == "updated") {
                            handleEditImage(idx, img.fileUpload);
                          }
                        }}
                        type="button"
                        className="cursor-pointer"
                      >
                        <ImageUpscaleIcon className="h-4 w-4 shrink-0" />
                      </button>
                    </>
                  )}
                </div>
                <NextImage
                  priority
                  className="object-contain"
                  src={
                    img.type == "init" || img.type == "deleted"
                      ? img.url
                      : img.srcCropped
                  }
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
                        : image.type == "new"
                        ? {
                            type: "new",
                            ...data,
                          }
                        : {
                            type: "updated",
                            url: image.url,
                            ...data,
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
            {imageExists.length < 9 && (
              <CropImage
                aspectRatios={["1:1", "4:3", "16:9"]}
                onSave={(data) => {
                  setFormData((prev) => ({
                    ...prev,
                    images: [
                      ...prev.images,
                      {
                        type: "new",
                        ...data,
                      },
                    ],
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
                type="number"
                className="w-[100px]"
                value={formData.pack_spec}
                onChange={(e) => {
                  console.log(e);
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
          <Button variant="ghost" type="button" asChild disabled={isPending}>
            <Link href="/admin/products">Huỷ</Link>
          </Button>
          <Button disabled={formData.prod_name == "" || isPending}>Lưu</Button>
        </div>
      </div>
      <div
        className={cn(
          "fixed top-0 left-0 w-screen h-screen bg-black/20",
          isPending ? "block" : "hidden"
        )}
      ></div>
    </form>
  );
};

export default UpdateProductForm;
