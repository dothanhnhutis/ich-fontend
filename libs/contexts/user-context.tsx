"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { User } from "@/types/user";
import { getCurrentUserAction, logOutAction } from "@/app/(private)/actions";

type UserProvider = {
  logOut: () => Promise<void>;
  userQuery: UseQueryResult<User | null, Error>;
};

export const UserContext = React.createContext<UserProvider | null>(null);

export const UserProvider = ({
  children,
  user,
}: Readonly<{ children: React.ReactNode; user?: User | null }>) => {
  const router = useRouter();

  const userQuery = useQuery({
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
      userQuery,
      logOut: handleLogOut,
    }),
    [userQuery]
  );
  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
