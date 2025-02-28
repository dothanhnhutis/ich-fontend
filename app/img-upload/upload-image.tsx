import React from "react";
import NextImage from "next/image";
import { gcd } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";

type Props = {
  children?: React.ReactNode;
  className?: string;
  onSave?: () => void;
};

type ImgUploadData = {
  src: string | null;
  height?: number;
  width?: number;
  aspectRatio?: string;
  file?: HTMLImageElement;
};

const UploadImage = ({ children, className }: Props) => {
  const id = React.useId();
  const [openModel, setOpenModel] = React.useState<boolean>(false);
  const cropperRef = React.useRef<HTMLImageElement | null>(null);
  const [imgUploadData, setImgUploadData] = React.useState<ImgUploadData>({
    src: null,
  });

  React.useEffect(() => {
    if (imgUploadData.src && !openModel) {
      setOpenModel(true);
    }
  }, [imgUploadData, openModel]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          console.log("img onload");
          const width = img.naturalWidth;
          const height = img.naturalHeight;
          const divisor = gcd(width, height);
          const aspectRatio = `${width / divisor}:${height / divisor}`;

          setImgUploadData((prev) => ({
            ...prev,
            file: img,
            width,
            height,
            aspectRatio,
          }));
        };
        if (e.target && e.target.result && typeof e.target.result == "string") {
          img.src = e.target.result;
          setImgUploadData((prev) => ({
            ...prev,
            src: img.src,
          }));
        } else {
          console.log("onload Error");
        }
      };
    }
  };

  return (
    <label htmlFor={id} className={className}>
      <input
        type="file"
        accept="image/png, image/jpeg"
        id={id}
        className="hidden"
        onChange={handleFileChange}
      />
      {children}

      {imgUploadData.src && (
        <div className="relative h-[100px] w-[100px]">
          <NextImage
            fill
            className="object-cover"
            src={imgUploadData.src}
            alt="img"
            sizes="100vw"
          />
        </div>
      )}

      <Dialog open={openModel} onOpenChange={setOpenModel}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa hình ảnh</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {imgUploadData.src && (
              <Cropper
                ref={cropperRef}
                src={imgUploadData.src}
                style={{ height: 400, width: "100%" }}
                aspectRatio={1}
                viewMode={1}
                guides={false}
                background={false}
                responsive
                autoCropArea={1}
                checkOrientation={false}
                //   crop={onCrop}
              />
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </label>
  );
};

export default UploadImage;
