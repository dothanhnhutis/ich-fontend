"use client";
import { MFA, TOTP } from "@/data/user";
import React from "react";

type SetupMFAContextState = {
  step: number;
  totp: TOTP | null;
  mfa: MFA | null;
  next: () => void;
  back: () => void;
  handleTOTP: (totp: TOTP | null) => void;
  handleMFA: (mfa: MFA | null) => void;
};

const SetupMFAContext = React.createContext<null | SetupMFAContextState>(null);

export function useSetupMFA() {
  const context = React.useContext(SetupMFAContext);
  if (!context)
    throw new Error("useSetupMFA must be used within a SetupMFAProvider.");
  return context;
}

const MAX_STEP = 3;
const MIN_STEP = 1;

export function SetupMFAProvider({
  children,
  defaultMFa,
}: Readonly<{ children: React.ReactNode; defaultMFa?: MFA | null }>) {
  const [step, setStep] = React.useState<number>(1);
  const [totp, setTOTP] = React.useState<TOTP | null>(null);
  const [mfa, setMFA] = React.useState<MFA | null>(defaultMFa ?? null);

  const handleNext = React.useCallback(() => {
    setStep(step < MAX_STEP ? step + 1 : step);
  }, [step]);

  const handleBack = React.useCallback(() => {
    setStep(step > MIN_STEP ? step - 1 : step);
  }, [step]);

  const handleTOTP = (totp: TOTP | null) => {
    setTOTP(totp);
  };
  const handleMFA = (mfa: MFA | null) => {
    setMFA(mfa);
  };

  const contextValue = React.useMemo<SetupMFAContextState>(
    () => ({
      step,
      totp,
      mfa,
      back: handleBack,
      next: handleNext,
      handleTOTP,
      handleMFA,
    }),
    [step, handleBack, handleNext, totp, mfa]
  );
  return (
    <SetupMFAContext.Provider value={contextValue}>
      {children}
    </SetupMFAContext.Provider>
  );
}

type MFAContext = {
  open: boolean;
  checked: boolean;
  mfa: MFA | null;
  handleModal: (open: boolean) => void;
  handleSwitch: (open: boolean) => void;
  handleMFA: (mfa: MFA | null) => void;
};
const MFAContext = React.createContext<null | MFAContext>(null);

export function useMFA() {
  const context = React.useContext(MFAContext);
  if (!context) throw new Error("useMFA must be used within a MFAProvider.");
  return context;
}

export function MFAProvider({
  children,
  defaultMFa,
}: Readonly<{ children: React.ReactNode; defaultMFa?: null | MFA }>) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [checked, setChecked] = React.useState<boolean>(!!defaultMFa);
  const [mfa, setMFA] = React.useState<MFA | null>(defaultMFa ?? null);

  const handleModal = (open: boolean) => {
    setOpen(open);
  };
  const handleSwitch = (checked: boolean) => {
    setChecked(checked);
  };
  const handleMFA = (mfa: MFA | null) => {
    setMFA(mfa);
  };

  const contextValue = React.useMemo<MFAContext>(
    () => ({
      open,
      checked,
      mfa,
      handleModal,
      handleSwitch,
      handleMFA,
    }),
    [open, checked]
  );
  return (
    <MFAContext.Provider value={contextValue}>{children}</MFAContext.Provider>
  );
}
