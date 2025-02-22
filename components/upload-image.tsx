"use client";
import React from "react";
import NextImage from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  ChevronsLeftRightIcon,
  ChevronsUpDownIcon,
  RotateCcwIcon,
  RotateCwIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react";
const UploadImage = ({
  children,
  aspectRatios,
}: Readonly<{
  children?: React.ReactNode;
  aspectRatios?: string[];
}>) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const [imageSrc, setImageSrc] = React.useState("");
  const [enableEditTool, setEnableEditTool] = React.useState<boolean>(false);
  const [aspectRatioImg, setAspectRatioImg] = React.useState<string>("");
  const [image, setImage] = React.useState<HTMLImageElement | null>(null);

  const isValidAspectRatio = (ratio: string): boolean => {
    const aspectRatioRegex: RegExp = /^(\d+([.,]\d+)?)[:\/](\d+([.,]\d+)?)$/;
    return aspectRatioRegex.test(ratio);
  };

  const invalidAspectRatios = React.useMemo(() => {
    if (!aspectRatios) return [];
    return aspectRatios.filter((as) => isValidAspectRatio(as));
  }, [aspectRatios]);

  React.useEffect(() => {
    if (aspectRatioImg && aspectRatios && image) {
      if (!invalidAspectRatios.includes(aspectRatioImg)) {
        drawCanvas(image);
        console.log(image);
        setEnableEditTool(true);
      }
    }
  }, [aspectRatioImg, aspectRatios, invalidAspectRatios, image]);

  // Xử lý upload ảnh
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          const width = img.naturalWidth;
          const height = img.naturalHeight;
          const gcd = (a: number, b: number): number =>
            b === 0 ? a : gcd(b, a % b);
          const divisor = gcd(width, height);
          setAspectRatioImg(`${width / divisor}:${height / divisor}`);
        };
        if (e.target && e.target.result && typeof e.target.result == "string") {
          img.src = e.target.result;
          setImageSrc(e.target.result);
        } else {
          console.log("onload Error");
        }
      };
    }
  };

  const drawCanvas = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Kích thước canvas (lớn hơn ảnh 20% để làm background)
    const padding = 20;
    canvas.width = img.width + padding * 2;
    canvas.height = img.height + padding * 2;

    // Vẽ background
    ctx.fillStyle = "#00bc7d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Vẽ ảnh chính (căn giữa)
    ctx.drawImage(img, padding, padding, img.width, img.height);
  };

  return (
    <label htmlFor="upload" className="">
      {imageSrc ? (
        <div className="relative h-[100px] w-[100px]">
          <NextImage
            fill
            className="object-cover"
            src={imageSrc}
            alt="img"
            sizes="100vw"
          />
        </div>
      ) : (
        children
      )}

      <input
        id="upload"
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="image/*"
      />

      <Dialog onOpenChange={setEnableEditTool} open={enableEditTool}>
        <DialogContent className="sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa hình ảnh</DialogTitle>
            <DialogDescription>Công cụ chỉnh sửa hình ảnh</DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 py-4 w-full">
            <div className="border">
              <canvas ref={canvasRef} />
            </div>

            <div className="grid fap-2 w-full">
              <h4 className="font-semibold">Công cụ chỉnh sửa</h4>
              {invalidAspectRatios.length > 0 && (
                <div>
                  <Label htmlFor="">Tỉ lệ hình</Label>
                  <div className="flex gap-2 items-center">
                    {invalidAspectRatios.map((as, idx) => (
                      <p key={idx}>{as}</p>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="">Xoay</Label>
                <div className="flex gap-2 items-center">
                  <RotateCcwIcon className="shrink-0 h-5 w-5" />
                  <RotateCwIcon className="shrink-0 h-5 w-5" />
                </div>
              </div>
              <div>
                <Label htmlFor="">Thu phóng</Label>
                <div className="flex gap-2 items-center">
                  <ZoomInIcon className="shrink-0 h-5 w-5" />
                  <ZoomOutIcon className="shrink-0 h-5 w-5" />
                </div>
              </div>
              <div>
                <Label htmlFor="">Lật hình</Label>
                <div className="flex gap-2 items-center">
                  <ChevronsLeftRightIcon className="shrink-0 h-5 w-5" />
                  <ChevronsUpDownIcon className="shrink-0 h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost">
              Huỷ
            </Button>
            <Button type="submit">Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </label>
  );
};

export default UploadImage;
