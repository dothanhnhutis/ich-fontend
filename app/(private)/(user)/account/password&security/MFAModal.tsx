"use client";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import React, { useMemo } from "react";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import {
  CopyIcon,
  KeyIcon,
  KeyRoundIcon,
  LoaderCircleIcon,
  LoaderPinwheelIcon,
  MonitorSmartphoneIcon,
  RefreshCwIcon,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { getSetupMFA, MFA, TOTPAuth } from "@/data/user";
import { createMFAAction, getSetupMFAAction, setupMFAAction } from "../actions";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useStore } from "@/hooks/use-store";

type MFAContext = {
  mFAData: MFA | null;
  step: number;
  isOpenModal: boolean;
  isCheckedSwitch: boolean;
  totp: TOTPAuth | null;
  handleTOTP: (totp: TOTPAuth | null) => void;
  handleOpenModal: (open: boolean) => void;
  handleCheckSwitch: (checked: boolean) => void;
  handleMFA: (mfa: MFA | null) => void;
  handleDisableMFA: () => void;
  next: () => void;
  back: () => void;
};

const MFAContext = React.createContext<null | MFAContext>(null);

const useMFA = () => {
  const context = React.useContext(MFAContext);
  if (!context) throw new Error("useMFA must be used within a MFAProvider.");
  return context;
};

const MAX_STEP = 3;
const MIN_STEP = 1;

export const MFAProvider = ({
  children,
  mfa,
}: Readonly<{ children: React.ReactNode; mfa?: MFA }>) => {
  const [step, setStep] = React.useState<number>(mfa ? 4 : 1);
  const [isOpenModal, setIsOpenModal] = React.useState<boolean>(false);
  const [isCheckedSwitch, setIsCheckedSwitch] = React.useState<boolean>(!!mfa);
  const [totp, setTotp] = React.useState<null | TOTPAuth>(null);

  const [mFAData, setMFAData] = React.useState<MFA | null>(mfa || null);

  React.useEffect(() => {
    const loadSetupMFA = async () => {
      const totp = await getSetupMFAAction();
      if (totp) setTotp(totp);
    };
    loadSetupMFA();
  }, [isOpenModal]);

  const handleMFA = (mfa: MFA | null) => {
    setMFAData(mfa);
  };

  const handleTOTP = (totp: null | TOTPAuth) => {
    setTotp(totp);
  };

  const handleNext = React.useCallback(() => {
    setStep(step < MAX_STEP ? step + 1 : step);
  }, [step]);

  const handleBack = React.useCallback(() => {
    setStep(step > MIN_STEP ? step - 1 : step);
  }, [step]);

  const handleDisableMFA = () => {
    setStep(5);
  };

  const handleCheckSwitch = (checked: boolean) => {
    if (checked) {
      setIsOpenModal(true);
      setIsCheckedSwitch(checked);
    } else {
      setIsOpenModal(true);
    }
  };

  const handleOpenModal = (open: boolean) => {
    setIsOpenModal(open);
  };

  const contextValue = React.useMemo<MFAContext>(
    () => ({
      mFAData,
      step,
      isOpenModal,
      isCheckedSwitch,
      totp,
      handleTOTP,
      handleCheckSwitch,
      handleOpenModal,
      handleMFA,
      next: handleNext,
      back: handleBack,
      handleDisableMFA,
    }),
    [mFAData, step, isOpenModal, isCheckedSwitch, totp, handleNext, handleBack]
  );

  return <MFAContext value={contextValue}>{children}</MFAContext>;
};

const StepOne = () => {
  const { handleCheckSwitch, handleOpenModal, handleTOTP, totp, next } =
    useMFA();

  const [deviceName, setDeviceName] = React.useState<string>(
    totp?.deviceName ?? ""
  );

  const [countDown, setCountDown] = React.useState<number>(0);
  React.useEffect(() => {
    let timerId: NodeJS.Timeout;

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
    handleOpenModal(false);
    handleCheckSwitch(false);
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
            {countDown > 0 ? <span>{`(${countDown}) `}</span> : null}Tiếp tục
          </p>
        </Button>
      </div>
    </form>
  );
};

const StepTwo = () => {
  const {
    totp,
    handleOpenModal,
    handleCheckSwitch,
    back,
    next,
    handleTOTP,
    handleMFA,
  } = useMFA();

  const [codes, setCodes] = React.useState<string[]>(["", ""]);
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return await createMFAAction(codes);
    },
    onSuccess({ data, message }) {
      if (data) {
        handleMFA(data);
        next();
      } else {
        toast.error(message);
      }
    },
  });

  const handleCancel = () => {
    handleOpenModal(false);
    handleCheckSwitch(false);
    back();
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
            <Image
              src={totp?.qrCodeUrl || ""}
              alt="MFA QR code"
              width={150}
              height={150}
              className="border border-primary rounded-md"
            />
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
          variant="outline"
          className="cursor-pointer"
          onClick={handleCancel}
        >
          Huỷ
        </Button>
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={handleBack}
        >
          Trở về
        </Button>
        <Button className="cursor-pointer">
          {isPending ? (
            <LoaderCircleIcon className="size-4 animate-spin" />
          ) : null}
          <p>Liên kết</p>
        </Button>
      </div>
    </form>
  );
};

const StepThree = () => {
  const { mFAData } = useMFA();

  return (
    <div className="flex flex-col gap-1">
      <p className="text-muted-foreground text-center sm:text-left">
        Mã dự phòng giúp đăng nhập khi không có thiết bị xác thực.
      </p>
      {mFAData ? (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-1 mt-3">
          {mFAData.backupCode.map((code, idx) => (
            <div
              key={idx}
              className={cn(
                "flex items-center justify-center py-2",
                mFAData.codeExpires.includes(code)
                  ? "line-through text-muted-foreground"
                  : ""
              )}
            >
              {code}
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex items-center justify-end gap-2 mt-4">
        <Button variant="outline">Đóng</Button>
      </div>
    </div>
  );
};

const DisableMFA = () => {
  const { back } = useMFA();

  return (
    <div>
      <p className="text-sm text-muted-foreground">
        Bạn sắp tắt xác thực hai yếu tố (MFA). Điều này có thể làm giảm tính bảo
        mật của tài khoản. Bạn có chắc chắn muốn tiếp tục?
      </p>
      <div className="flex flex-col min-[412px]:flex-row gap-2 items-center  justify-end mt-4 [&>button]:cursor-pointer">
        <Button className="w-full min-[412px]:w-auto" variant={"destructive"}>
          Tắt
        </Button>
        <Button
          className="w-full min-[412px]:w-auto"
          onClick={back}
          variant={"outline"}
        >
          Huỷ
        </Button>
      </div>
    </div>
  );
};

const DetailMFA = () => {
  const { mFAData, handleOpenModal, handleDisableMFA } = useMFA();

  return (
    <div className="flex flex-col gap-1">
      <p className="text-muted-foreground text-center sm:text-left">
        Mã dự phòng giúp đăng nhập khi không có thiết bị xác thực.
      </p>
      {mFAData ? (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-1">
          {mFAData.backupCode.map((code, idx) => (
            <div
              key={idx}
              className={cn(
                "flex items-center justify-center py-2",
                mFAData.codeExpires.includes(code)
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
        <Button
          variant="destructive"
          className="w-full min-[412px]:w-auto"
          onClick={handleDisableMFA}
        >
          Tắt MFA
        </Button>
        <Button className="w-full min-[412px]:w-auto">Tạo mã mới</Button>
        <Button
          variant="outline"
          className="w-full min-[412px]:w-auto"
          onClick={() => {
            handleOpenModal(false);
          }}
        >
          Đóng
        </Button>
      </div>
    </div>
  );
};

const MFAHeader = () => {
  const { step } = useMFA();

  return (
    <AlertDialogHeader>
      <AlertDialogTitle>Xác thực đa yếu tố (MFA)</AlertDialogTitle>
      <AlertDialogDescription className="hidden"></AlertDialogDescription>
      {step < 4 ? (
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
      ) : null}
    </AlertDialogHeader>
  );
};

const MFABody = () => {
  const { step } = useMFA();

  return (
    <AlertDialogContent
      className={cn(
        "p-3 min-[412px]:p-6",
        step == 5
          ? "max-w-[calc(100%-2rem)] sm:max-w-sm"
          : "sm:max-w-[calc(100%-2rem)] lg:max-w-3xl"
      )}
    >
      <MFAHeader />
      {step == 1 ? (
        <StepOne />
      ) : step == 2 ? (
        <StepTwo />
      ) : step == 3 ? (
        <StepThree />
      ) : step == 4 ? (
        <DetailMFA />
      ) : step == 5 ? (
        <DisableMFA />
      ) : null}
    </AlertDialogContent>
  );
};

export const MFAContainer = () => {
  const { isOpenModal, isCheckedSwitch, handleCheckSwitch } = useMFA();

  return (
    <AlertDialog open={isOpenModal}>
      <Switch
        className="cursor-pointer"
        checked={isCheckedSwitch}
        onCheckedChange={handleCheckSwitch}
      />
      <MFABody />
    </AlertDialog>
  );
};

const MFASwitch = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [step, setStep] = React.useState<number>(1);
  const [qRCodeMode, setQRCodeMode] = React.useState<boolean>(true);
  const [deviceName, setDeviceName] = React.useState<string>("");
  const [mfaCode, setMFACode] = React.useState<{
    mfa_code1: string;
    mfa_code2: string;
  }>({
    mfa_code1: "",
    mfa_code2: "",
  });

  const validateInput = useMemo(() => {
    return z
      .string({
        invalid_type_error: "deviceName must be string",
        required_error: "deviceName is required",
      })
      .max(128, "deviceName maximin 128 characters.")
      .regex(/^[\d\w+=,.@\-_][\d\w\s+=,.@\-_]*$/, "deviceName ")
      .safeParse(deviceName).success;
  }, [deviceName]);

  const {
    mutate: generateMFA,
    reset: resetGenerateMFA,
    status,
    data: dataGenerateMFA,
  } = useMutation({
    mutationFn: async (deviceName: string) => {
      // return await setMFA(deviceName);
    },
  });
  const queryClient = useQueryClient();

  const { isPending, mutate, reset, data } = useMutation({
    mutationFn: async (input: { mfa_code1: string; mfa_code2: string }) => {
      // return await enableMFA(input);
    },
    onSuccess({ success, message }) {
      if (success) {
        queryClient.invalidateQueries({ queryKey: ["me"] });
        setStep(3);
        toast.success(message);
      } else {
        toast.error(message);
      }
    },
  });

  const {
    isPending: isPendingDisableMFA,
    mutate: mutateDisableMFA,
    reset: resetDisableMFA,
  } = useMutation({
    mutationFn: async (input: { mfa_code1: string; mfa_code2: string }) => {
      // return await disableMFA(input);
    },
    onSuccess({ success, message }) {
      if (success) {
        queryClient.invalidateQueries({ queryKey: ["me"] });
        toast.warning(message);
        setOpen(false);
      } else {
        toast.error(message);
      }
    },
    onSettled() {
      setMFACode({ mfa_code1: "", mfa_code2: "" });
    },
  });

  const handleDisable = () => {
    mutateDisableMFA(mfaCode);
  };

  const handleNext = () => {
    if (step == 1) {
      setStep(2);
    }
    if (step == 2) {
      mutate(mfaCode);
    }
  };

  const handleBack = () => {
    if (step == 3) {
      setOpen(false);
    }
    if (step == 2) {
      setDeviceName("");
      setStep(1);
      setQRCodeMode(true);
      resetGenerateMFA();
      setMFACode({
        mfa_code1: "",
        mfa_code2: "",
      });
    }
    if (step == 1) {
      setOpen(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setQRCodeMode(true);
    setDeviceName("");
    setMFACode({
      mfa_code1: "",
      mfa_code2: "",
    });
    resetGenerateMFA();
    reset();
    resetDisableMFA();
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMFACode((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  React.useEffect(() => {
    handleReset();
  }, [open]);

  return (
    <AlertDialog open={open}>
      <Switch onClick={() => setOpen(true)} checked={currentUser?.mFAEnabled} />
      {currentUser?.mFAEnabled && step != 3 ? (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Disable Mutiple-Factor Authentication (MFA)
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action will affect your account security
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="mfa_code1" className="text-sm">
              MFA code 1
            </Label>
            <Input
              value={mfaCode.mfa_code1}
              onChange={handleOnChange}
              maxLength={6}
              id="mfa_code1"
              name="mfa_code1"
              placeholder="MFA code 1"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="mfa_code2" className="text-sm">
              MFA code 2
            </Label>
            <Input
              value={mfaCode.mfa_code2}
              onChange={handleOnChange}
              maxLength={6}
              id="mfa_code2"
              name="mfa_code2"
              placeholder="MFA code 2"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisable}
              disabled={
                mfaCode.mfa_code1.length != 6 ||
                mfaCode.mfa_code2.length != 6 ||
                isPendingDisableMFA
              }
              className="bg-destructive hover:bg-destructive/80 text-foreground"
            >
              {isPendingDisableMFA && (
                <LoaderPinwheelIcon className="h-4 w-4 animate-spin flex-shrink-0 mr-2" />
              )}
              Disable
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      ) : (
        <AlertDialogContent
          className={cn(
            "max-h-screen overflow-y-scroll p-4 sm:p-6",
            step == 1 ? "sm:max-w-screen-md" : "sm:max-w-screen-lg"
          )}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>
              Mutiple-Factor Authentication (MFA)
            </AlertDialogTitle>
            <Breadcrumb>
              <BreadcrumbList className="flex-nowrap justify-center sm:justify-start">
                <BreadcrumbItem
                  className={cn(step == 1 ? "font-normal text-foreground" : "")}
                >
                  Step 1: Enter device name
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem
                  className={cn(step == 2 ? "font-normal text-foreground" : "")}
                >
                  Step 2: Set up device
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem
                  className={cn(step == 3 ? "font-normal text-foreground" : "")}
                >
                  Step 3: Successful setup & backup code storage
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </AlertDialogHeader>
          {step == 1 ? (
            <div className="flex flex-col gap-8">
              <div className="grid gap-1">
                <Label htmlFor="device_name">Device name</Label>
                <Input
                  id="device_name"
                  placeholder="MFA device"
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  value={deviceName}
                  onChange={(e) => {
                    if (e.target.value.length <= 128)
                      setDeviceName(e.target.value);
                  }}
                  className={cn(
                    !validateInput && deviceName.length > 0
                      ? "border-red-500"
                      : ""
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  Enter a meaningful name to identity this device.
                </p>
                <p className="text-xs text-muted-foreground">
                  Maximun 128 characters. Use alphanumberic and '+=,.@-_'
                  characters.
                </p>
              </div>

              <div className="flex items-center gap-2 border p-2 rounded">
                <MonitorSmartphoneIcon className="size-16" />
                <div>
                  <p className="text-sm font-medium">Authenticator App</p>
                  <p className="text-xs text-muted-foreground">
                    Authenticator using a code generated by an app installed on
                    your mobile device or computer
                  </p>
                </div>
              </div>
            </div>
          ) : step == 2 ? (
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
                    Install a compatible application such as Google
                    Authenticator, Duo Mobile or Authy app on your mobile device
                    or computer.
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
                    Open your authenticator app, chose{" "}
                    <span className="font-bold text-foreground">
                      Show QR code
                    </span>{" "}
                    on this page, then use the app to scan the code.
                    Alternatively, you can type a secret key.
                    <span
                      onClick={() => setQRCodeMode(!qRCodeMode)}
                      className="ml-1 text-primary cursor-pointer"
                    >
                      {qRCodeMode ? "Show secret key" : "Show QR code"}
                    </span>
                  </p>
                  {qRCodeMode ? (
                    <button
                      onClick={() => generateMFA(deviceName)}
                      className="size-[200px] border border-primary text-sm text-center text-primary"
                    >
                      {status == "idle" ? (
                        <span className="align-middle h-full">
                          Show QR code
                        </span>
                      ) : status == "pending" ? (
                        <span>
                          <LoaderCircleIcon className="size-5 animate-spin flex-shrink-0 inline mr-2" />
                          Loading ...
                        </span>
                      ) : (
                        <img
                          src={dataGenerateMFA?.data?.qrCodeUrl}
                          alt="MFA QR code"
                        />
                      )}
                    </button>
                  ) : (
                    <p className="font-medium text-sm text-muted-foreground break-words">
                      Secret key:{" "}
                      {status == "idle" ? (
                        <span
                          onClick={() => generateMFA(deviceName)}
                          className="text-primary underline cursor-pointer"
                        >
                          take
                        </span>
                      ) : status == "pending" ? (
                        <LoaderCircleIcon className="size-5 animate-spin flex-shrink-0 inline" />
                      ) : (
                        <span className="text-foreground text-base ">
                          {dataGenerateMFA?.data?.totp.base32}
                        </span>
                      )}
                    </p>
                  )}
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
                    Enter the code from your authenticator app.
                  </p>
                  <div className="flex flex-row mt-3">
                    <div>
                      <div className="grid gap-2">
                        <Label htmlFor="mfa_code1" className="text-sm">
                          MFA code 1
                        </Label>
                        <Input
                          value={mfaCode.mfa_code1}
                          onChange={handleOnChange}
                          id="mfa_code1"
                          name="mfa_code1"
                          maxLength={6}
                          placeholder="MFA code 1"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="mfa_code2" className="text-sm">
                          MFA code 2
                        </Label>
                        <Input
                          value={mfaCode.mfa_code2}
                          onChange={handleOnChange}
                          id="mfa_code2"
                          name="mfa_code2"
                          maxLength={6}
                          placeholder="MFA code 2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* {data?.data?.backupCodes.map((backupCode, idx) => (
                <p key={idx}>{backupCode}</p>
              ))} */}
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending} onClick={handleBack}>
              {step == 1 ? "Cancel" : step == 2 ? "Back" : "Close"}
            </AlertDialogCancel>
            {step != 3 && (
              <AlertDialogAction
                onClick={handleNext}
                disabled={
                  (step == 1 && !validateInput) ||
                  isPending ||
                  (step == 2 &&
                    (mfaCode.mfa_code1.length == 0 ||
                      mfaCode.mfa_code2.length == 0 ||
                      status != "success"))
                }
              >
                {isPending && (
                  <LoaderPinwheelIcon className="h-4 w-4 animate-spin flex-shrink-0 mr-2" />
                )}
                {step == 1 ? "Next" : "Submit"}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
};
