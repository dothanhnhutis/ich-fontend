"use client";
import { MFAToken } from "@/types/auth";
import React from "react";

type SignInContextProps = {
  mfaToken: null | MFAToken;
  handleMFAToken: (data: null | MFAToken) => void;
};

const SignInContext = React.createContext<SignInContextProps | null>(null);

export function useSignIn() {
  const context = React.useContext(SignInContext);
  if (!context) {
    throw new Error("useSignIn must be used within a SignInProvider.");
  }
  return context;
}

export function SignInProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [mfaToken, setMFAToken] =
    React.useState<SignInContextProps["mfaToken"]>(null);

  const handleMFAToken = (data: SignInContextProps["mfaToken"]) => {
    setMFAToken(data);
  };

  const contextValue = React.useMemo<SignInContextProps>(
    () => ({
      mfaToken,
      handleMFAToken,
    }),
    [mfaToken]
  );

  return (
    <SignInContext.Provider value={contextValue}>
      {children}
    </SignInContext.Provider>
  );
}
