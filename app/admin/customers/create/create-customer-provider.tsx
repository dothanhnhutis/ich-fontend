"use client";
import React from "react";

export type CreateCustomerFormData = {
  cus_name: string;
  storage: {
    storekeeper: string;
    phone_number: string;
    address: string;
  }[];
  products: {
    prod_name: string;
    images: {
      srcUpload: string;
      fileUpload: File;
      srcCropped: string;
      fileCropped: File;
    }[];
    pack_spec: number;
  }[];
};

type CreateCustomerContextType = {
  step: number;
  hasNext: boolean;
  next: () => void;
  back: () => void;
  setCusName: (value: string) => void;
  formData: CreateCustomerFormData;
};

const CreateCustomerContext =
  React.createContext<CreateCustomerContextType | null>(null);

export const useCreateCustomer = () => {
  const context = React.useContext(CreateCustomerContext);
  if (!context) {
    throw new Error(
      "useCreateCustomer must be used within a CreateCustomerContext."
    );
  }
  return context;
};

export const CreateCustomerProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [step, setStep] = React.useState<number>(1);
  const [formData, setFormData] = React.useState<CreateCustomerFormData>({
    cus_name: "",
    storage: [],
    products: [],
  });

  const hasNext = React.useMemo(() => {
    return step < 4;
  }, [step]);

  const next = React.useCallback(() => {
    if (hasNext) setStep(step + 1);
  }, [step, hasNext]);

  const back = React.useCallback(() => {
    if (step > 1) setStep(step - 1);
  }, [step]);

  const setCusName = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      cus_name: value,
    }));
  };

  const contextValue = React.useMemo(
    () => ({
      step,
      hasNext,
      formData,
      next,
      back,
      setCusName,
    }),
    [step, hasNext, formData, next, back]
  );

  return (
    <CreateCustomerContext.Provider value={contextValue}>
      {children}
    </CreateCustomerContext.Provider>
  );
};
