import React from "react";
import {
  getDataFromImageFile,
  ImgDataUpload,
  isValidAspectRatio,
} from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Cropper, ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
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

  imageFile?: File;
  fileAccess?: (
    | "image/jpeg"
    | "image/png"
    | "image/jpg"
    | "image/webp"
    | "image/gif"
    | "image/svg+xml"
  )[];
  onSave?: (data: {
    srcUpload: string;
    fileUpload: File;
    srcCropped: string;
    fileCropped: File;
  }) => void;

  onCloseModal?: () => void;
};

const CropImage = ({
  children,
  className,
  minCropBoxHeight,
  minCropBoxWidth,
  aspectRatios = [],
  fileAccess = ["image/jpeg"],
  imageFile,
  onSave,
  onCloseModal,
}: Props) => {
  const id = React.useId();
  const [openModel, setOpenModel] = React.useState<boolean>(false);
  const cropperRef = React.useRef<ReactCropperElement | null>(null);
  const [imgUploadData, setImgUploadData] =
    React.useState<ImgDataUpload | null>(null);

  const validateAspectRatios = React.useMemo(
    () => aspectRatios.filter(isValidAspectRatio),
    [aspectRatios]
  );

  React.useEffect(() => {
    const handleInit = async () => {
      if (imageFile) {
        const imgData = await getDataFromImageFile(imageFile);

        setImgUploadData(imgData);
      }
    };

    handleInit();
  }, [imageFile]);

  React.useEffect(() => {
    if (!openModel) {
      setImgUploadData(null);
    }
  }, [openModel]);

  React.useEffect(() => {
    if (imgUploadData?.src) {
      setOpenModel(true);
    }
  }, [imgUploadData]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.includes("image")) {
      toast.info("Please select an image!");
      return;
    }
    e.target.value = "";
    const imgData = await getDataFromImageFile(file);

    if (validateAspectRatios.includes(imgData.aspectRatio)) {
      if (onSave)
        onSave({
          srcUpload: imgData.src,
          fileUpload: file,
          srcCropped: imgData.src,
          fileCropped: file,
        });
    } else {
      setImgUploadData(imgData);
    }
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
    if (typeof cropper !== "undefined" && onSave && imgUploadData) {
      const base64Url: string = cropper.getCroppedCanvas().toDataURL();
      cropper.getCroppedCanvas().toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], imgUploadData.file.name, {
              type: imgUploadData.file.type,
            });
            onSave({
              srcUpload: imgUploadData.src,
              fileUpload: imgUploadData.file,
              srcCropped: base64Url,
              fileCropped: file,
            });
          }
        },
        imgUploadData.file.type ?? "image/jpeg",
        0.95
      );
    }
    setOpenModel(false);
  };

  const handleCancel = () => {
    setOpenModel(false);
    if (onCloseModal) onCloseModal();
  };

  if (imageFile)
    return (
      <Dialog
        open={openModel}
        onOpenChange={(open) => {
          setOpenModel(open);
          if (!open && onCloseModal) {
            onCloseModal();
          }
        }}
      >
        <DialogContent className="max-w-[640px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa hình ảnh</DialogTitle>
            <DialogDescription className="hidden"></DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-muted overflow-hidden w-full">
            {imgUploadData?.src && (
              <Cropper
                className="w-full cropperjs max-h-[400px]"
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

            <div className="flex flex-wrap items-center justify-center gap-2 h-10">
              {validateAspectRatios.length > 1 && (
                <Select
                  defaultValue={validateAspectRatios[0]}
                  onValueChange={(v) => {
                    const value =
                      parseFloat(v.split(":")[0]) / parseFloat(v.split(":")[1]);
                    handleAspectRatio(value);
                  }}
                >
                  <SelectTrigger className="w-[75px] shadow-none bg-white focus-visible:ring-transparent focus:ring-transparent focus:ring-offset-0 border-0">
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

              <div className="rounded-md h-9 flex items-center bg-white">
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
              <button
                type="button"
                className="bg-white border-0 shadow-none h-9 w-9 flex justify-center items-center rounded-md cursor-pointer focus-visible:outline-0"
                onClick={() => {
                  handleRotate(90);
                }}
              >
                <RotateCwIcon className="w-4 h-4" />
              </button>

              <Button
                type="button"
                variant="ghost"
                className="cursor-pointer"
                onClick={() => {
                  handleReset();
                }}
              >
                <p className="text-primary">Reset</p>
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Huỷ
            </Button>
            <Button type="button" onClick={handleSave}>
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

  return (
    <>
      <label htmlFor={id} className={className}>
        <input
          type="file"
          accept={fileAccess.join(", ")}
          id={id}
          className="hidden"
          onChange={handleFileChange}
        />
        {children}

        <Dialog open={openModel} onOpenChange={setOpenModel}>
          <DialogContent className="max-w-[640px]">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa hình ảnh</DialogTitle>
              <DialogDescription className="hidden"></DialogDescription>
            </DialogHeader>
            <div className="rounded-lg bg-muted overflow-hidden w-full">
              {imgUploadData?.src && (
                <Cropper
                  className="w-full cropperjs max-h-[400px]"
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

              <div className="flex flex-wrap items-center justify-center gap-2 h-10">
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
                    <SelectTrigger className="w-[75px] shadow-none bg-white focus-visible:ring-transparent focus:ring-transparent focus:ring-offset-0 border-0">
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

                <div className="rounded-md h-9 flex items-center bg-white">
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
                <button
                  type="button"
                  className="bg-white border-0 shadow-none h-9 w-9 flex justify-center items-center rounded-md cursor-pointer focus-visible:outline-0"
                  onClick={() => {
                    handleRotate(90);
                  }}
                >
                  <RotateCwIcon className="w-4 h-4" />
                </button>

                <Button
                  type="button"
                  variant="ghost"
                  className="cursor-pointer"
                  onClick={() => {
                    handleReset();
                  }}
                >
                  <p className="text-primary">Reset</p>
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Huỷ
              </Button>
              <Button type="button" onClick={handleSave}>
                Lưu
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </label>
    </>
  );
};

export default CropImage;
