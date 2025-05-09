"use client";
import React from "react";
import Image from "next/image";
import { Label } from "@/components/commons/label";
import { Input } from "@/components/commons/input";
import { Button } from "@/components/commons/button";
import Link from "next/link";
import { Separator } from "@/components/commons/separator";
import CropImage from "@/components/crop-image";
import { cn, generateUniqueID } from "@/lib/utils";
import { ImageIcon, ImageUpIcon, SquarePenIcon, TrashIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { createCustomerProductAction } from "../action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";

type CreateProductFormData = {
  prodName: string;
  packSpec: string;
  images: {
    id: string;
    fileCropped: File;
    fileUpload: File;
    srcCropped: string;
    srcUpload: string;
  }[];
};

const ProductImageContainer = ({
  children,
  images,
}: {
  images: CreateProductFormData["images"];
  children?: React.ReactNode;
}) => {
  return (
    <SortableContext items={images} strategy={verticalListSortingStrategy}>
      <div className="flex items-center flex-wrap gap-1 min-[388px]:grid min-[388px]:grid-cols-4 min-[388px]:h-[248px] min-[388px]:w-[332px]">
        {children}
      </div>
    </SortableContext>
  );
};

const ProductImageDnd = ({
  image,
  isMain,
  onDelete,
  onSelected,
}: {
  isMain?: boolean;
  image: CreateProductFormData["images"][number];
  onDelete?: () => void;
  onSelected?: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable(image);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={cn(
        "relative overflow-hidden h-20 w-20 rounded-md group",
        isMain
          ? "min-[388px]:h-[164px] min-[388px]:w-[164px] min-[388px]:col-span-2 min-[388px]:row-span-2"
          : ""
      )}
    >
      <Image
        className="object-contain bg-accent"
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
    id: string;
    srcUpload: string;
    fileUpload: File;
    srcCropped: string;
    fileCropped: File;
  }) => void;
  onDelete?: () => void;
  onSelected?: () => void;
  imageFile?: File;
}) => {
  if (image)
    return (
      <ProductImageDnd
        image={image}
        isMain={isMain}
        onDelete={onDelete}
        onSelected={onSelected}
      />
    );

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
      {isUpload ? (
        <CropImage
          aspectRatios={["1:1", "4:3", "3:4", "16:9", "9:16"]}
          minCropBoxHeight={80}
          minCropBoxWidth={80}
          fileAccess={["image/jpeg", "image/png", "image/jpg"]}
          className="flex items-center justify-center h-full w-full text-muted-foreground cursor-pointer"
          onSave={(img) => {
            if (onSave)
              onSave({
                ...img,
                id: generateUniqueID(),
              });
          }}
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

const CreateProductForm = ({ customerId }: { customerId: string }) => {
  const [formData, setFormData] = React.useState<CreateProductFormData>({
    prodName: "",
    packSpec: "",
    images: [],
  });

  const [editImageAt, setEditImageAt] = React.useState<string>();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return await createCustomerProductAction(customerId, {
        prodName: formData.prodName,
        packSpec: parseInt(formData.packSpec),
        images: formData.images.map((i) => i.fileCropped),
      });
    },
    onSuccess(data) {
      if (data.success) {
        toast.success(data.message);
        router.push(`/admin/customers/${customerId}/products`);
        setFormData({
          prodName: "",
          packSpec: "",
          images: [],
        });
      } else {
        toast.error(data.message);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const currTaskId =
      active.id as CreateProductFormData["images"][number]["id"];
    const targetTaskId =
      over.id as CreateProductFormData["images"][number]["id"];

    const oldIndex = formData.images
      .map((image) => image.id)
      .indexOf(currTaskId);
    const newIndex = formData.images
      .map((image) => image.id)
      .indexOf(targetTaskId);

    const newImages = arrayMove(formData.images, oldIndex, newIndex);
    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }));
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col sm:flex-row gap-2 pb-5">
        <div className="grid gap-2 w-full">
          <Label>Hình sản phẩm</Label>
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <ProductImageContainer images={formData.images}>
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
                      images: prev.images.filter(
                        ({ id }) => id != formData.images[idx].id
                      ),
                    }));
                  }}
                  onSelected={() => {
                    setEditImageAt(formData.images[idx].id);
                  }}
                />
              ))}
            </ProductImageContainer>
          </DndContext>
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
        aspectRatios={["1:1", "4:3", "3:4", "16:9", "9:16"]}
        minCropBoxHeight={80}
        minCropBoxWidth={80}
        fileAccess={["image/jpeg", "image/png", "image/jpg"]}
        className="flex items-center justify-center h-full w-full text-muted-foreground cursor-pointer"
        imageFile={
          formData.images.find(({ id }) => id == editImageAt)?.fileUpload
        }
        onSave={(img) => {
          setFormData((prev) => ({
            ...prev,
            images: prev.images.map((image) =>
              image.id == editImageAt ? { ...img, id: editImageAt } : image
            ),
          }));
          setEditImageAt(undefined);
        }}
        onCloseModal={() => {
          setEditImageAt(undefined);
        }}
      />
      <Separator />
      <div className="flex gap-2 justify-end items-center py-2">
        <Button variant="ghost" type="button" asChild disabled={isPending}>
          <Link href={`/admin/customers/${customerId}/products`}>Huỷ</Link>
        </Button>
        <Button disabled={isPending || formData.images.length == 0}>Tạo</Button>
      </div>
    </form>
  );
};

export default CreateProductForm;
