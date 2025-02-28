import React from "react";
import NextImage from "next/image";
import { gcd, isValidAspectRatio } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Cropper, ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCwIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

type Props = {
  children?: React.ReactNode;
  className?: string;
  minCropBoxHeight?: number;
  minCropBoxWidth?: number;
  aspectRatios?: string[];
  fileAccess?: (
    | "image/jpeg"
    | "image/png"
    | "image/jpg"
    | "image/webp"
    | "image/gif"
    | "image/svg+xml"
  )[];
  onSave?: (data: { base64Url: string; blob: Blob | null }) => void;
};

type ImgUploadData = {
  src: string | null;
  height?: number;
  width?: number;
  aspectRatio?: string;
  file?: HTMLImageElement;
  type?: string;
};

const UploadImage = ({
  children,
  className,
  minCropBoxHeight,
  minCropBoxWidth,
  aspectRatios = [],
  fileAccess = ["image/jpeg"],
  onSave,
}: Props) => {
  const id = React.useId();
  const [openModel, setOpenModel] = React.useState<boolean>(false);
  const cropperRef = React.useRef<ReactCropperElement | null>(null);
  const [imgUploadData, setImgUploadData] = React.useState<ImgUploadData>({
    src: null,
  });

  const validateAspectRatios = React.useMemo(
    () => aspectRatios.filter(isValidAspectRatio),
    [aspectRatios]
  );

  React.useEffect(() => {
    if (!openModel) {
      setImgUploadData({ src: null });
    }
  }, [openModel]);

  React.useEffect(() => {
    if (imgUploadData.src) {
      setOpenModel(true);
    }
  }, [imgUploadData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.includes("image")) {
      toast.info("Please select an image!");
      return;
    }
    e.target.value = "";
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        const divisor = gcd(width, height);
        const aspectRatio = `${width / divisor}:${height / divisor}`;

        console.log(validateAspectRatios, aspectRatio);
        if (!validateAspectRatios.includes(aspectRatio)) {
          setImgUploadData((prev) => ({
            ...prev,
            file: img,
            width,
            height,
            aspectRatio,
          }));
        } else {
          setImgUploadData({
            src: null,
          });
          // onSave({ base64Url: e.target!.result as string, blob: file });
        }
      };
      if (e.target && e.target.result && typeof e.target.result == "string") {
        img.src = e.target.result;
        setImgUploadData((prev) => ({
          ...prev,
          src: img.src,
          type: file.type,
        }));
      } else {
        console.log("onload Error");
      }
    };
  };

  const handleZoomIn = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.zoom(0.1);
    }
  };

  const handleZoomOut = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.zoom(-0.1);
    }
  };

  const handleRotate = (value: number) => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.rotate(value);
    }
  };

  const handleReset = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.reset();
    }
  };

  const handleAspectRatio = (value: number) => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.setAspectRatio(value);
    }
  };

  const handleSave = () => {
    const cropper = cropperRef.current?.cropper;
    if (typeof cropper !== "undefined" && onSave) {
      cropper.getCroppedCanvas().toBlob(
        (blob) => {
          const base64Url: string = cropper.getCroppedCanvas().toDataURL();
          onSave({ base64Url, blob });
        },
        imgUploadData.type ?? "image/jpeg",
        0.95
      );
    }
    setOpenModel(false);
  };

  const handleCancel = () => {
    setOpenModel(false);
  };

  return (
    <label htmlFor={id} className={className}>
      <input
        type="file"
        accept={fileAccess.join(", ")}
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
        <DialogContent className="sm:max-w-[640px] md:max-w-3xl lg:max-w-5xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa hình ảnh</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center rounded-lg bg-muted sm:items-start sm:rounded-none sm:bg-transparent sm:flex-row sm:gap-4 overflow-hidden ">
            {imgUploadData.src && (
              <Cropper
                className="w-full cropperjs max-h-[400px] sm:max-w-[400px] sm:rounded-lg sm:overflow-hidden"
                ref={cropperRef}
                src={imgUploadData.src}
                style={{ height: 400, width: "100%" }}
                aspectRatio={
                  validateAspectRatios.length > 0
                    ? parseFloat(validateAspectRatios[0].split(":")[0]) /
                      parseFloat(validateAspectRatios[0].split(":")[1])
                    : undefined
                }
                dragMode={validateAspectRatios.length > 0 ? "move" : "crop"}
                cropBoxMovable={false}
                viewMode={1}
                minCropBoxHeight={minCropBoxHeight ?? 100}
                minCropBoxWidth={minCropBoxWidth ?? 100}
                center={true}
                zoomOnWheel={false}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={true}
                guides={true}
                toggleDragModeOnDblclick={true}
              />
            )}

            <div>
              <Label className="text-right hidden sm:inline-block mb-2">
                Basic
              </Label>
              <div className="flex flex-wrap items-center justify-center sm:items-start sm:justify-start gap-2 sm:gap-4">
                {validateAspectRatios.length > 1 && (
                  <Select
                    defaultValue={validateAspectRatios[0]}
                    onValueChange={(v) => {
                      const value =
                        parseFloat(v.split(":")[0]) /
                        parseFloat(v.split(":")[1]);
                      handleAspectRatio(value);
                    }}
                  >
                    <SelectTrigger className="w-[75px] focus-visible:ring-transparent focus:ring-transparent focus:ring-offset-0 bg-accent border-0 dark:border dark:bg-transparent ">
                      <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {aspectRatios.map((as, idx) => (
                          <SelectItem key={idx} value={as}>
                            {as}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}

                <div className="rounded-md h-10 flex items-center bg-accent dark:bg-transparent dark:border">
                  <button
                    type="button"
                    className="px-3 py-2.5 disabled:opacity-50 h-full inline-flex items-center justify-center"
                    onClick={handleZoomOut}
                  >
                    <ZoomOutIcon className="w-4 h-4" />
                  </button>
                  <Separator orientation="vertical" className="h-4" />
                  <button
                    type="button"
                    className="px-3 py-2.5 disabled:opacity-50 h-full inline-flex items-center justify-center"
                    onClick={handleZoomIn}
                  >
                    <ZoomInIcon className="w-4 h-4" />
                  </button>
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="bg-accent border-0 dark:border dark:bg-transparent"
                  onClick={() => {
                    handleRotate(90);
                  }}
                >
                  <RotateCwIcon className="w-4 h-4" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    handleReset();
                  }}
                >
                  <p className="text-primary">Reset</p>
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleCancel}>
              Huỷ
            </Button>
            <Button type="button" onClick={handleSave}>
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </label>
  );
};

export default UploadImage;
