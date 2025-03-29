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
  LoaderCircleIcon,
  LoaderPinwheelIcon,
  MonitorSmartphoneIcon,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { MFA } from "@/data/user";

type MFAContext = {
  step: number;
  isOpenModal: boolean;
  isCheckedSwitch: boolean;
  deviceName: string;
  handleDeviceName: (deviceName: string) => void;
  handleOpenModal: (open: boolean) => void;
  handleCheckSwitch: (checked: boolean) => void;
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

const MFAProvider = ({
  children,
  mfa,
}: Readonly<{ children: React.ReactNode; mfa?: MFA }>) => {
  const [step, setStep] = React.useState<number>(1);
  const [isOpenModal, setIsOpenModal] = React.useState<boolean>(false);
  const [isCheckedSwitch, setIsCheckedSwitch] = React.useState<boolean>(false);
  const [deviceName, setDeviceName] = React.useState<string>("");

  const handleNext = React.useCallback(() => {
    setStep(step < MAX_STEP ? step + 1 : step);
  }, [step]);

  const handleBack = React.useCallback(() => {
    setStep(step > MIN_STEP ? step - 1 : step);
  }, [step]);

  const handleCheckSwitch = (checked: boolean) => {
    if (checked) {
      setIsOpenModal(true);
    }
    setIsCheckedSwitch(checked);
  };

  const handleOpenModal = (open: boolean) => {
    setIsOpenModal(open);
  };

  const handleDeviceName = (deviceName: string) => {
    setDeviceName(deviceName);
  };

  const contextValue = React.useMemo<MFAContext>(
    () => ({
      step,
      isOpenModal,
      isCheckedSwitch,
      deviceName,
      handleDeviceName,
      handleCheckSwitch,
      handleOpenModal,
      next: handleNext,
      back: handleBack,
    }),
    [step, isOpenModal, isCheckedSwitch, deviceName, handleNext, handleBack]
  );

  return <MFAContext value={contextValue}>{children}</MFAContext>;
};

const StepOne = () => {
  const { deviceName, handleDeviceName } = useMFA();
  const isError = useMemo(() => {
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

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-1">
        <Label htmlFor="deviceName" className="text-sm font-semibold">
          Tên thiết bị
        </Label>
        <div
          className={cn(
            "flex items-center gap-2 border rounded-md h-9 px-3 py-1 focus-within:ring-4 focus-within:outline-1 ring-ring/10",
            isError ? "border-red-500 bg-red-50 outline-red-50 ring-red-50" : ""
          )}
        >
          <input
            type="text"
            name="deviceName"
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
              handleDeviceName(e.target.value);
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
            Xác thực bằng mã được tạo bởi ứng dụng được cài đặt trên thiết bị di
            động hoặc máy tính của bạn
          </p>
        </div>
      </div>
    </div>
  );
};

const StepTwo = () => {
  return (
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
            Install a compatible application such as Google Authenticator, Duo
            Mobile or Authy app on your mobile device or computer.
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
            <span className="font-bold text-foreground">Show QR code</span> on
            this page, then use the app to scan the code. Alternatively, you can
            type a secret key.
            <span className="ml-1 text-primary cursor-pointer">
              {true ? "Show secret key" : "Show QR code"}
            </span>
          </p>
          {true ? (
            <button className="size-[200px] border border-primary text-sm text-center text-primary">
              {true ? (
                <span className="align-middle h-full">Show QR code</span>
              ) : true ? (
                <span>
                  <LoaderCircleIcon className="size-5 animate-spin flex-shrink-0 inline mr-2" />
                  Loading ...
                </span>
              ) : (
                <img src={dataGenerateMFA?.data?.qrCodeUrl} alt="MFA QR code" />
              )}
            </button>
          ) : (
            <p className="font-medium text-sm text-muted-foreground break-words">
              Secret key:{" "}
              {true ? (
                <span className="text-primary underline cursor-pointer">
                  take
                </span>
              ) : true ? (
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
  );
};

const MFAHeader = () => {
  const { step } = useMFA();

  return (
    <AlertDialogHeader>
      <AlertDialogTitle>Xác thực đa yếu tố (MFA)</AlertDialogTitle>
      <AlertDialogDescription className="hidden"></AlertDialogDescription>
      <Breadcrumb>
        <BreadcrumbList className="flex-nowrap justify-center sm:justify-start">
          <BreadcrumbItem
            className={cn(step == 1 ? "font-normal text-foreground" : "")}
          >
            Bước 1: Nhập tên thiết bị
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem
            className={cn(step == 2 ? "font-normal text-foreground" : "")}
          >
            Bước 2: Thiết lập liên kết
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem
            className={cn(step == 3 ? "font-normal text-foreground" : "")}
          >
            Bước 3: Hoàn thành
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </AlertDialogHeader>
  );
};

const MFABody = () => {
  const { step } = useMFA();

  if (step == 1) return <StepOne />;
  if (step == 2) return <StepTwo />;
  return null;
};

const MFAFooter = () => {
  const { step, next, back } = useMFA();

  return (
    <AlertDialogFooter>
      <AlertDialogCancel>Huỷ</AlertDialogCancel>
      {step > MIN_STEP ? (
        <AlertDialogCancel onClick={back}>Trở về</AlertDialogCancel>
      ) : null}
      <AlertDialogAction onClick={next}>
        {step == MAX_STEP ? "Đóng" : "Tiếp tục"}
      </AlertDialogAction>
    </AlertDialogFooter>
  );
};

const MFAContainer = () => {
  const { isOpenModal, handleOpenModal, isCheckedSwitch, handleCheckSwitch } =
    useMFA();

  return (
    <AlertDialog open={isOpenModal}>
      <Switch
        className="cursor-pointer"
        checked={isCheckedSwitch}
        onCheckedChange={handleCheckSwitch}
      />
      <AlertDialogContent className="sm:max-w-[calc(100%-2rem)] md:max-w-2xl">
        <MFAHeader />
        <MFABody />
        <MFAFooter />
      </AlertDialogContent>
    </AlertDialog>
  );
};

const MFAModal = ({ mfa }: { mfa?: MFA }) => {
  return (
    <MFAProvider mfa={mfa}>
      <MFAContainer />
    </MFAProvider>
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

export default MFAModal;
