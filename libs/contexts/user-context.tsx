"use client";
import React from "react";
import { useRouter } from "next/navigation";

import { User } from "@/types/user";
import { logOutAction, reSendVerifyEmailAction } from "../actions/UserActions";

type UserProvider = {
  user: User | null;
  isPending: boolean;
  logOut: () => Promise<void>;
  handleReSendVerifyEmail(): Promise<{
    isSuccess: boolean;
    message: string;
  }>;
};

export const UserContext = React.createContext<UserProvider | null>(null);

export const UserProvider = ({
  children,
  user,
}: Readonly<{ children: React.ReactNode; user?: User | null }>) => {
  const router = useRouter();
  const [state, setUser] = React.useState<User | null>(null);
  const [isPending, setIsPending] = React.useState<boolean>(true);

  React.useEffect(() => {
    setUser(user || null);
    setIsPending(false);
  }, [user]);

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

  const contextValue = React.useMemo<UserProvider>(
    () => ({
      user: state,
      isPending,
      logOut: handleLogOut,
      handleReSendVerifyEmail,
    }),
    [state, isPending]
  );
  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
