"use client";
import React from "react";
import { CurrentUser } from "@/data/user";
import {
  QueryObserverResult,
  RefetchOptions,
  useQuery,
} from "@tanstack/react-query";
import { getCurrentUserAction, logOutAction } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type UserProvider = {
  isPending: boolean;
  user: CurrentUser | null;
  logOut: () => Promise<void>;
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
  const router = useRouter();

  const { isPending, data, refetch } = useQuery({
    enabled: !user,
    initialData: user,
    queryKey: ["me"],
    queryFn: async function () {
      return await getCurrentUserAction();
    },
  });

  async function handleLogOut() {
    await logOutAction();
    router.push("/login");
  }

  const contextValue = React.useMemo<UserProvider>(
    () => ({
      isPending,
      user: data ?? null,
      refetch,
      logOut: handleLogOut,
    }),
    [data, isPending, refetch]
  );
  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
