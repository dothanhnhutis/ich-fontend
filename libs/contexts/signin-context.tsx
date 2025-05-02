"use client";
import React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

import {
  signInAction,
  signInMFAAction,
} from "@/components/commons/authForms/actions";

type SignInContextProps = {
  data: { email: string; password: string; code: string };
  handleChangeData: (data: Partial<SignInContextProps["data"]>) => void;
  signInMutation: UseMutationResult<
    {
      message: string;
      token: string | null;
      status: string;
    },
    Error,
    void,
    unknown
  >;
  signInMFAMutation: UseMutationResult<
    {
      status: string;
      message: string;
    },
    Error,
    void,
    unknown
  >;
};

export const SignInContext = React.createContext<SignInContextProps | null>(
  null
);

export function SignInProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [data, setData] = React.useState<SignInContextProps["data"]>({
    email: "",
    password: "",
    code: "",
  });

  const signInMutation = useMutation({
    mutationFn: async () => {
      return await signInAction({ email: data.email, password: data.password });
    },
    onSuccess({ status, message }) {
      if (status == "SUCCESS") {
        setData((prev) => ({ ...prev, email: "", password: "" }));
        router.refresh();
        toast.success(message);
      } else if (status == "MFA_REQUIRED") {
        setData((prev) => ({ ...prev, password: "" }));
        return;
      } else {
        setData((prev) => ({ ...prev, email: "", password: "" }));
      }
    },
  });

  const signInMFAMutation = useMutation({
    mutationFn: async () => {
      return await signInMFAAction(signInMutation.data?.token ?? "", {
        email: data.email,
        code: data.code,
      });
    },
    onSuccess({ status, message }) {
      switch (status) {
        case "SUCCESS":
          router.refresh();
          toast.success(message);
          break;
        case "ERROR":
          setData((prev) => ({ ...prev, code: "" }));
          break;
        default:
          break;
      }
    },
  });

  function handleChangeData(data: Partial<SignInContextProps["data"]>) {
    if (signInMutation.data && signInMutation.data.status == "ERROR") {
      signInMutation.reset();
    }
    if (signInMFAMutation.data && signInMFAMutation.data.status == "ERROR") {
      signInMFAMutation.reset();
    }
    setData((prev) => ({ ...prev, ...data }));
  }

  const contextValue = React.useMemo<SignInContextProps>(
    () => ({
      data,
      handleChangeData,
      signInMutation,
      signInMFAMutation,
    }),
    [data, signInMutation]
  );

  return (
    <SignInContext.Provider value={contextValue}>
      {children}
    </SignInContext.Provider>
  );
}
