"use client";
import React from "react";
import { CurrentUser } from "@/data/user";
import {
  QueryObserverResult,
  RefetchOptions,
  useQuery,
} from "@tanstack/react-query";
import { getCurrentUserAction } from "./actions";

type UserProvider = {
  isPending: boolean;
  user: CurrentUser | null;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<CurrentUser | null, Error>>;
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
  const { isPending, data, refetch } = useQuery({
    enabled: !user,
    initialData: user,
    queryKey: ["me"],
    queryFn: async function () {
      return await getCurrentUserAction();
    },
  });

  const contextValue = React.useMemo<UserProvider>(
    () => ({
      isPending,
      user: data ?? null,
      refetch,
    }),
    [data, isPending, refetch]
  );
  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
