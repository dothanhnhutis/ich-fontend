"use client";
import React, { useMemo } from "react";
import { MFA } from "@/data/user";
import { Button } from "@/components/ui/button";
import {
  CopyIcon,
  KeyRoundIcon,
  LoaderCircleIcon,
  MonitorSmartphoneIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { MFAProvider, useMFA } from "./MFAProvider1";
import {
  createMFAAction,
  getSetupMFAAction,
  setupMFAAction,
} from "../../actions";
import * as z from "zod";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import Image from "next/image";

function MFAStepOne() {
  const { handleSwitch, handleModal, handleTOTP, totp, next } = useMFA();

  const [deviceName, setDeviceName] = React.useState<string>(
    totp?.deviceName ?? ""
  );

  React.useEffect(() => {
    async function fetchTOTP() {
      const totp = await getSetupMFAAction();
      if (totp) {
        setDeviceName(totp.deviceName);
        handleTOTP(totp);
      }
    }
    if (!totp) {
      fetchTOTP();
    }
  }, [totp]);

  const [countDown, setCountDown] = React.useState<number>(0);
  React.useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;

    if (totp && totp.deviceName != deviceName) {
      timerId = setInterval(() => {
        const createdAt = new Date(totp.createdAt);
        const timeLeft = Math.ceil(
          (createdAt.getTime() - Date.now() + 60000) / 1000
        );
        if (timeLeft > 0) {
          setCountDown(timeLeft);
        } else {
          setCountDown(0);
          clearInterval(timerId);
        }
      });
    } else {
      setCountDown(0);
    }

    return () => clearInterval(timerId);
  }, [countDown, deviceName, totp]);

  const isDeviceNameError = useMemo(() => {
    return deviceName.length > 0
      ? !z
          .string({
            invalid_type_error: "deviceName must be string",
            required_error: "deviceName is required",
          })
          .max(128, "deviceName maximin 128 characters.")
          .regex(/^[\d\w+=,.@\-_][\d\w\s+=,.@\-_]*$/, "deviceName ")
          .safeParse(deviceName).success
      : false;
  }, [deviceName]);

  const handleCancel = () => {
    handleModal(false);
    handleSwitch(false);
    if (!!totp) handleTOTP(null);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return await setupMFAAction(deviceName);
    },
    onSuccess({ data, message }) {
      if (data) {
        handleTOTP(data);
        next();
      } else {
        toast.warning(message);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!!totp && totp.deviceName == deviceName) {
      next();
    } else {
      mutate();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-8">
        <div className="grid gap-1">
          <Label htmlFor="deviceName" className="text-sm font-semibold">
            Tên thiết bị
          </Label>
          <div
            className={cn(
              "flex items-center gap-2 border rounded-md h-9 px-3 py-1 focus-within:ring-4 focus-within:outline-1 ring-ring/10",
              isDeviceNameError
                ? "border-red-500 bg-red-50 outline-red-50 ring-red-50"
                : ""
            )}
          >
            <input
              required
              type="text"
              name="deviceName"
              placeholder={totp?.deviceName ?? ""}
              id="deviceName"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              maxLength={128}
              className={cn(
                "text-base md:text-sm w-full h-full focus-visible:outline-0 focus-visible:ring-0"
              )}
              value={deviceName}
              onChange={(e) => {
                setDeviceName(e.target.value);
              }}
            />
            <span className="text-muted-foreground text-xs">
              {deviceName.length}/128
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Nhập tên có ý nghĩa để nhận dạng thiết bị này.
          </p>
          <p className="text-xs text-muted-foreground">
            Tối đa 128 ký tự không dấu. Hỗ trợ các ký tự +=,.@-_
          </p>
        </div>
        <div className="flex items-center gap-2 border p-2 rounded">
          <MonitorSmartphoneIcon className="size-16" />
          <div>
            <p className="text-sm font-medium">Ứng dụng xác thực</p>
            <p className="text-xs text-muted-foreground">
              Xác thực bằng mã được tạo bởi ứng dụng được cài đặt trên thiết bị
              di động hoặc máy tính của bạn
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 items-center justify-end mt-4">
        <Button
          className="cursor-pointer"
          type="button"
          variant="outline"
          onClick={handleCancel}
        >
          Huỷ
        </Button>
        <Button
          className="cursor-pointer"
          disabled={isDeviceNameError || isPending || countDown > 0}
        >
          {isPending ? (
            <LoaderCircleIcon className="size-4 animate-spin" />
          ) : null}

          <p>
            Tiếp tục{countDown > 0 ? <span>{` (${countDown}) `}</span> : null}
          </p>
        </Button>
      </div>
    </form>
  );
}

function MFAStepTwo() {
  const { totp, handleTOTP, handleModal, handleSwitch, back, next, handleMFA } =
    useMFA();

  const [codes, setCodes] = React.useState<string[]>(["", ""]);
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return await createMFAAction(codes);
    },
    onSuccess({ data, message }) {
      if (data) {
        handleMFA(data);
        next();
        toast.success(message);
      } else {
        toast.error(message);
      }
    },
  });

  const handleCancel = () => {
    handleModal(false);
    handleSwitch(false);
    handleTOTP(null);
  };

  const handleBack = () => {
    back();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-6 items-center border-b last:border-none py-3">
          <div className="hidden sm:block size-16 mx-auto rounded-full bg-muted">
            <p className="text-center">
              <span className="inline-block align-middle p-5">1</span>
            </p>
          </div>

          <div className="col-span-6 sm:col-span-5">
            <p className="text-muted-foreground text-sm">
              <span className="sm:hidden">1. </span>
              Cài đặt ứng dụng tương thích như Google Authenticator, Microsoft
              Authenticator, Duo Mobile hoặc ứng dụng Authy trên thiết bị di
              động hoặc máy tính của bạn.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-6 items-center border-b last:border-none py-3">
          <div className="hidden sm:block size-16 mx-auto rounded-full bg-muted">
            <p className="text-center">
              <span className="inline-block align-middle p-5">2</span>
            </p>
          </div>
          <div className="col-span-6 sm:col-span-5 grid gap-3">
            <p className="text-muted-foreground text-sm">
              <span className="sm:hidden">2. </span>
              Mở ứng dụng xác thực của bạn để quét mã QR.
            </p>
            {totp ? (
              <Image
                src={totp.qrCodeUrl}
                alt="MFA QR code"
                width={150}
                height={150}
                className="border border-primary rounded-md"
              />
            ) : null}

            <p className="text-muted-foreground text-sm">
              Hoặc nhập mã theo cách thủ công
            </p>
            <div className="inline-flex items-center gap-2 border h-9 px-3 py-1 overflow-hidden rounded-md max-w-[430px]">
              <KeyRoundIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="select-none truncate w-full h-full text-muted-foreground font-semibold focus-visible:outline-0 focus-visible:ring-0">
                {totp?.base32}
              </p>
              <button
                type="button"
                className="text-muted-foreground cursor-pointer"
                onClick={() => {
                  window.navigator.clipboard.writeText(totp?.base32 || "");
                  toast.info(`Sao chép thành công khoá bí mật.`);
                }}
              >
                <CopyIcon className="h-4 w-4 shrink-0" />
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-6 items-center border-b last:border-none py-3">
          <div className="hidden sm:block size-16 mx-auto rounded-full bg-muted">
            <p className="text-center">
              <span className="inline-block align-middle p-5">3</span>
            </p>
          </div>
          <div className="col-span-6 sm:col-span-5">
            <p className="text-muted-foreground text-sm">
              <span className="sm:hidden">3. </span>
              Nhập mã từ ứng dụng xác thực của bạn.
            </p>
            <div className="grid gap-2 py-2 sm:max-w-1/2">
              <div className="flex items-center gap-4">
                <Label htmlFor="code1" className="text-right text-sm shrink-0">
                  Mã 1
                </Label>
                <div className="w-full">
                  <Input
                    id="code1"
                    required
                    value={codes[0]}
                    onChange={(e) => {
                      setCodes((prev) => [e.target.value, prev[1]]);
                    }}
                    placeholder="123456"
                    maxLength={6}
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Chờ 30s để nhập mã thứ 2
              </p>

              <div className="flex items-center gap-4">
                <Label htmlFor="code2" className="text-right text-sm shrink-0">
                  Mã 2
                </Label>
                <Input
                  id="code2"
                  required
                  value={codes[1]}
                  onChange={(e) => {
                    setCodes((prev) => [prev[0], e.target.value]);
                  }}
                  placeholder="123456"
                  maxLength={6}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-2 items-center justify-end mt-4">
        <Button
          disabled={isPending}
          type="button"
          variant="outline"
          className="cursor-pointer"
          onClick={handleCancel}
        >
          Huỷ
        </Button>
        <Button
          disabled={isPending}
          type="button"
          variant="outline"
          className="cursor-pointer"
          onClick={handleBack}
        >
          Trở về
        </Button>
        <Button disabled={isPending} className="cursor-pointer">
          {isPending ? (
            <LoaderCircleIcon className="size-4 animate-spin" />
          ) : null}
          <p>Liên kết</p>
        </Button>
      </div>
    </form>
  );
}

function MFAStepThree() {
  const { mfa, handleModal } = useMFA();

  return (
    <div className="flex flex-col gap-1">
      <p className="text-muted-foreground text-center sm:text-left">
        Mã dự phòng giúp đăng nhập khi không có thiết bị xác thực.
      </p>
      {mfa ? (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-1 mt-3">
          {mfa.backupCode.map((code, idx) => (
            <div
              key={idx}
              className={cn(
                "flex items-center justify-center py-2",
                mfa.codeExpires.includes(code)
                  ? "line-through text-muted-foreground"
                  : ""
              )}
            >
              {code}
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex items-center justify-end gap-2 mt-4 [&>button]:cursor-pointer">
        <Button
          variant="outline"
          type="button"
          onClick={() => {
            handleModal(false);
          }}
        >
          Đóng
        </Button>
      </div>
    </div>
  );
}

function MFASetup() {
  const { step } = useMFA();

  return (
    <AlertDialogContent
      className={"p-3 min-[412px]:p-6 sm:max-w-[calc(100%-2rem)] lg:max-w-3xl"}
    >
      <AlertDialogHeader>
        <AlertDialogTitle>Xác thực đa yếu tố (MFA)</AlertDialogTitle>
        <AlertDialogDescription className="hidden"></AlertDialogDescription>
        <Breadcrumb>
          <BreadcrumbList className="flex-nowrap justify-center sm:justify-start">
            <BreadcrumbItem
              className={cn(step == 1 ? "text-foreground font-semibold" : "")}
            >
              Bước 1: Nhập tên thiết bị
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem
              className={cn(step == 2 ? "text-foreground font-semibold" : "")}
            >
              Bước 2: Thiết lập liên kết
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem
              className={cn(step == 3 ? "text-foreground font-semibold" : "")}
            >
              Bước 3: Hoàn thành
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AlertDialogHeader>
      {step == 1 ? (
        <MFAStepOne />
      ) : step == 2 ? (
        <MFAStepTwo />
      ) : step == 3 ? (
        <MFAStepThree />
      ) : null}
    </AlertDialogContent>
  );
}

function MFADetail({ mfa }: { mfa: MFA }) {
  const { handleModal } = useMFA();
  return (
    <AlertDialogContent
      className={"p-3 min-[412px]:p-6 max-w-[calc(100%-2rem)] sm:max-w-sm"}
    >
      <AlertDialogHeader>
        <AlertDialogTitle>Xác thực đa yếu tố (MFA)</AlertDialogTitle>
        <AlertDialogDescription className="hidden"></AlertDialogDescription>
      </AlertDialogHeader>
      <div className="flex flex-col gap-1">
        <p className="text-muted-foreground text-center sm:text-left">
          Mã dự phòng giúp đăng nhập khi không có thiết bị xác thực.
        </p>
        {mfa ? (
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-1">
            {mfa.backupCode.map((code, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex items-center justify-center py-2",
                  mfa.codeExpires.includes(code)
                    ? "line-through text-muted-foreground"
                    : ""
                )}
              >
                {code}
              </div>
            ))}
          </div>
        ) : null}

        <div className="flex flex-col min-[412px]:flex-row items-center justify-end gap-2 mt-4 [&>button]:cursor-pointer">
          <Button variant="destructive" className="w-full min-[412px]:w-auto">
            Tắt MFA
          </Button>
          <Button className="w-full min-[412px]:w-auto">Tạo mã mới</Button>
          <Button
            variant="outline"
            className="w-full min-[412px]:w-auto"
            onClick={() => {
              handleModal(false);
            }}
          >
            Đóng
          </Button>
        </div>
      </div>
    </AlertDialogContent>
  );
}

function MFAContainer({ mfa }: { mfa: MFA | null }) {
  const { open, checked, handleModal, handleSwitch, step, back } = useMFA();

  return (
    <AlertDialog open={open}>
      <Switch
        className="cursor-pointer"
        checked={checked}
        onCheckedChange={(v) => {
          if (v && step == 2) {
            back();
          }
          handleSwitch(v);
          handleModal(true);
        }}
      />

      {mfa ? <MFADetail mfa={mfa} /> : <MFASetup />}
    </AlertDialog>
  );
}

const MFAModal1 = ({ mfa }: { mfa: MFA | null }) => {
  return (
    <div className="flex w-full gap-4 border-b py-4">
      <div className="w-full">
        <p className="font-bold after:content-['*'] after:text-red-500">
          Xác thực yếu tố đa yếu tố (MFA)
        </p>
        <p className="text-xs font-normal leading-snug text-muted-foreground">
          Bảo mật cao hơn với mã xác thực khi đăng nhập.
        </p>
      </div>

      <MFAProvider>
        <MFAContainer mfa={mfa} />
      </MFAProvider>
    </div>
  );
};

export default MFAModal1;
