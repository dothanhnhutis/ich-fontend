"use client";
import React from "react";
import { useRouter } from "next/navigation";

import { User } from "@/types/user";
import {
  disconnectProviderAction,
  logOutAction,
  reSendVerifyEmailAction,
  updateOrSendOTPUpdateEmailAction,
} from "../actions/UserActions";

type UserProvider = {
  user: User | null;
  logOut: () => Promise<void>;
  handleReSendVerifyEmail(): Promise<{
    isSuccess: boolean;
    message: string;
  }>;
  handleUpdateOrSendOTPUpdateEmail(email: string): Promise<{
    isSuccess: boolean;
    message: string;
  }>;
  handleDisconnectProvider: (provider: "google") => Promise<{
    isSuccess: boolean;
    message: string;
  }>;
};

export const UserContext = React.createContext<UserProvider | null>(null);

export const UserProvider = ({
  children,
  user,
}: Readonly<{ children: React.ReactNode; user: User | null }>) => {
  const router = useRouter();
  const [state, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    setUser(user);
  }, [user]);

  console.log("user", state);

  async function handleLogOut() {
    await logOutAction();
    router.push("/login");
  }

  async function handleReSendVerifyEmail(): Promise<{
    isSuccess: boolean;
    message: string;
  }> {
    if (!state || state.emailVerified)
      return {
        isSuccess: false,
        message: "Tài khoản đã xác thực",
      };
    return await reSendVerifyEmailAction();
  }

  async function handleUpdateOrSendOTPUpdateEmail(email: string): Promise<{
    isSuccess: boolean;
    message: string;
  }> {
    return await updateOrSendOTPUpdateEmailAction(email);
  }

  async function handleDisconnectProvider(provider: "google"): Promise<{
    isSuccess: boolean;
    message: string;
  }> {
    return await disconnectProviderAction(provider);
  }

  const contextValue = React.useMemo<UserProvider>(
    () => ({
      user: state,

      logOut: handleLogOut,
      handleReSendVerifyEmail,
      handleUpdateOrSendOTPUpdateEmail,
      handleDisconnectProvider,
    }),
    [state]
  );
  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
