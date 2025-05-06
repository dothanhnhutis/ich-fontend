"use client";
import React from "react";
import { useRouter } from "next/navigation";

import { User } from "@/types/user";
import { logOutAction } from "../actions/UserActions";

type UserProvider = {
  user: User | null;
  logOut: () => Promise<void>;
};

export const UserContext = React.createContext<UserProvider | null>(null);

export const UserProvider = ({
  children,
  user,
}: Readonly<{ children: React.ReactNode; user?: User | null }>) => {
  const router = useRouter();
  const [state, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    setUser(user || null);
  }, [user]);

  async function handleLogOut() {
    await logOutAction();
    router.push("/login");
  }

  const contextValue = React.useMemo<UserProvider>(
    () => ({
      user: state,
      logOut: handleLogOut,
    }),
    [state]
  );
  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
