"use client";
import React from "react";

export type CreateCustomerFormData = {
  cus_name: string;
  storages: {
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
  disableNext: boolean;
  setCusName: (value: string) => void;
  addStorage: (storage: CreateCustomerFormData["storages"][number]) => void;
  editStorage: (
    idx: number,
    newStorage: CreateCustomerFormData["storages"][number]
  ) => void;
  removeStorage: (idx: number) => void;
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
  const [step, setStep] = React.useState<number>(3);
  const [formData, setFormData] = React.useState<CreateCustomerFormData>({
    cus_name: "Thanh Nhut",
    storages: [
      {
        address: "das",
        phone_number: "as",
        storekeeper: "asdsa",
      },
    ],
    products: [],
  });

  const hasNext = React.useMemo(() => {
    return step < 4;
  }, [step]);

  const next = React.useCallback(() => {
    if (hasNext) setStep(step + 1);
  }, [step, hasNext]);

  const disableNext = React.useMemo(() => {
    if (step == 1 && formData.cus_name == "") {
      return true;
    }

    if (step == 2 && formData.storages.length == 0) {
      return true;
    }

    if (step == 3 && formData.products.length == 0) {
      return true;
    }

    return false;
  }, [step, formData]);

  const back = React.useCallback(() => {
    if (step > 1) setStep(step - 1);
  }, [step]);

  const setCusName = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      cus_name: value,
    }));
  };

  const addStorage = (storage: CreateCustomerFormData["storages"][number]) => {
    setFormData((prev) => ({
      ...prev,
      storages: [...prev.storages, storage],
    }));
  };

  const editStorage = (
    idx: number,
    newStorage: CreateCustomerFormData["storages"][number]
  ) => {
    setFormData((prev) => ({
      ...prev,
      storages: prev.storages.map((storage, index) =>
        idx == index ? newStorage : storage
      ),
    }));
  };

  const removeStorage = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      storages: prev.storages.filter((_, index) => index != idx),
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
      disableNext,
      addStorage,
      editStorage,
      removeStorage,
    }),
    [step, hasNext, formData, next, back, disableNext]
  );

  return (
    <CreateCustomerContext.Provider value={contextValue}>
      {children}
    </CreateCustomerContext.Provider>
  );
};
