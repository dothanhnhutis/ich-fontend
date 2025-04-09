import { MFA, TOTP } from "@/data/user";
import React from "react";
import { getSetupMFAAction } from "../../actions";

type MFAContext = {
  mFAData: MFA | null;
  step: number;
  isOpenModal: boolean;
  isCheckedSwitch: boolean;
  totp: TOTP | null;
  handleTOTP: (totp: TOTP | null) => void;
  handleOpenModal: (open: boolean) => void;
  handleCheckSwitch: (checked: boolean) => void;
  handleMFA: (mfa: MFA | null) => void;
  handleStep: (number: 4 | 5) => void;
  next: () => void;
  back: () => void;
};

const MFAContext = React.createContext<null | MFAContext>(null);

export function useMFA() {
  const context = React.useContext(MFAContext);
  if (!context) throw new Error("useMFA must be used within a MFAProvider.");
  return context;
}

const MAX_STEP = 3;
const MIN_STEP = 1;

export const MFAProvider = ({
  children,
  mfa,
}: Readonly<{ children: React.ReactNode; mfa?: MFA | null }>) => {
  const [step, setStep] = React.useState<number>(mfa ? 4 : 1);
  const [isOpenModal, setIsOpenModal] = React.useState<boolean>(false);
  const [isCheckedSwitch, setIsCheckedSwitch] = React.useState<boolean>(!!mfa);
  const [totp, setTotp] = React.useState<null | TOTP>(null);
  const [mFAData, setMFAData] = React.useState<MFA | null>(mfa ?? null);

  React.useEffect(() => {
    const loadSetupMFA = async () => {
      if (totp == null) {
        const totp = await getSetupMFAAction();
        if (totp) setTotp(totp);
      }
    };
    loadSetupMFA();
  }, [isOpenModal]);

  const handleMFA = (mfa: MFA | null) => {
    setMFAData(mfa);
  };

  const handleTOTP = (totp: null | TOTP) => {
    setTotp(totp);
  };

  const handleNext = React.useCallback(() => {
    setStep(step < MAX_STEP ? step + 1 : step);
  }, [step]);

  const handleBack = React.useCallback(() => {
    setStep(step > MIN_STEP ? step - 1 : step);
  }, [step]);

  const handleStep = (step: 4 | 5) => {
    setStep(step);
  };

  const handleCheckSwitch = (checked: boolean) => {
    setIsCheckedSwitch(checked);
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
      handleStep,
    }),
    [step, isOpenModal, isCheckedSwitch, totp, handleNext, handleBack]
  );

  return <MFAContext value={contextValue}>{children}</MFAContext>;
};
