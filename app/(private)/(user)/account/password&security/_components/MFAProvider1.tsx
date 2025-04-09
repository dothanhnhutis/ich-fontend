"use client";
import { MFA, TOTP } from "@/data/user";
import React from "react";

type MFAContext = {
  step: number;
  open: boolean;
  checked: boolean;
  totp: TOTP | null;
  mfa: MFA | null;
  next: () => void;
  back: () => void;
  handleModal: (open: boolean) => void;
  handleSwitch: (open: boolean) => void;
  handleTOTP: (totp: TOTP | null) => void;
  handleMFA: (mfa: MFA | null) => void;
};

const MFAContext = React.createContext<null | MFAContext>(null);

export function useMFA() {
  const context = React.useContext(MFAContext);
  if (!context) throw new Error("useMFA must be used within a MFAProvider.");
  return context;
}

const MAX_STEP = 3;
const MIN_STEP = 1;

export function MFAProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [step, setStep] = React.useState<number>(1);
  const [open, setOpen] = React.useState<boolean>(false);
  const [checked, setChecked] = React.useState<boolean>(false);
  const [totp, setTOTP] = React.useState<TOTP | null>(null);
  const [mfa, setMFA] = React.useState<MFA | null>(null);

  const handleNext = React.useCallback(() => {
    setStep(step < MAX_STEP ? step + 1 : step);
  }, [step]);

  const handleBack = React.useCallback(() => {
    setStep(step > MIN_STEP ? step - 1 : step);
  }, [step]);

  const handleModal = (open: boolean) => {
    setOpen(open);
  };
  const handleSwitch = (checked: boolean) => {
    setChecked(checked);
  };

  const handleTOTP = (totp: TOTP | null) => {
    setTOTP(totp);
  };
  const handleMFA = (mfa: MFA | null) => {
    setMFA(mfa);
  };

  const contextValue = React.useMemo<MFAContext>(
    () => ({
      step,
      open,
      checked,
      totp,
      mfa,
      back: handleBack,
      next: handleNext,
      handleModal,
      handleSwitch,
      handleTOTP,
      handleMFA,
    }),
    [step, handleBack, handleNext, open, checked, totp, mfa]
  );
  return <MFAContext value={contextValue}>{children}</MFAContext>;
}
