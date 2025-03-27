"use client";
import React from "react";
import { CurrentUser } from "@/data/user";

type UserProvider = {
  state: CurrentUser | null;
};

const UserContext = React.createContext<UserProvider | null>(null);

export const useUser = () => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider.");
  }
  return context;
};

export const UserProvider = ({
  children,
  user,
}: Readonly<{ children: React.ReactNode; user?: CurrentUser | null }>) => {
  const [state, setState] = React.useState<CurrentUser | null>(user || null);

  const contextValue = React.useMemo<UserProvider>(
    () => ({
      state,
    }),
    [state]
  );
  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
