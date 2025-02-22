import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import UploadImage from "@/components/upload-image";
import { PlusIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

const data = {
  prod_name: "face",
  images: [
    "https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792756/ich/z6114016917424_fb687d45beb2bed71ca987e94c618893_offfni.jpg",
  ],
  pack_spec: 0,
};

const CreateProductForm = () => {
  return (
    <form>
      <div className="grid gap-2">
        <div>
          <Label>Hình ảnh</Label>
          <div className="flex flex-wrap gap-2 ">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="relative h-[100px] w-[100px] aspect-square overflow-hidden rounded-lg"
              >
                <Image
                  className="object-cover"
                  src={data.images[0]}
                  alt=""
                  sizes="100wv"
                  fill
                />
              </div>
            ))}

            <UploadImage aspectRatios={["4:3", "16:9"]}>
              <p>add</p>
            </UploadImage>

            <label
              htmlFor="upload"
              className="flex text-muted-foreground hover:bg-accent cursor-pointer items-center justify-center h-[100px] w-[100px] border rounded-lg"
            >
              <PlusIcon className="w-5 h-5 shrink-0" />
              <input
                accept="image/png, image/jpg, image/jpge"
                type="file"
                className="hidden"
                id="upload"
                name="upload"
              />
            </label>
          </div>
        </div>
        <div>
          <Label>Tên sản phẩm</Label>
          <Input required />
        </div>
        <div>
          <Label>Quy cách đóng thùng</Label>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Số sản phẩm trong một thùng khi giao cho khách hàng.
            </p>
            <div className="flex gap-1 items-center">
              <Input required type="text" className="w-[50px]" />
              <p className="text-xs text-muted-foreground">sản phẩm / thùng</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 justify-end items-center">
          <Button variant="ghost">Huỷ</Button>
          <Button>Tạo</Button>
        </div>
      </div>
    </form>
  );
};

export default CreateProductForm;
