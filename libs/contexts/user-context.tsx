"use client";
import React from "react";
import { useRouter } from "next/navigation";
// import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { User } from "@/types/user";
import { logOutAction } from "../actions/UserActions";

type UserProvider = {
  user: User | null;
  logOut: () => Promise<void>;
  // userQuery: UseQueryResult<User | null, Error>;
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

  console.log(state);

  // const userQuery = useQuery({
  //   enabled: !user,
  //   initialData: user,
  //   queryKey: ["me"],
  //   queryFn: async function () {
  //     return await getCurrentUserAction();
  //   },
  // });

  async function handleLogOut() {
    await logOutAction();
    router.push("/login");
  }

  const contextValue = React.useMemo<UserProvider>(
    () => ({
      // userQuery,
      user: state,
      logOut: handleLogOut,
    }),
    [state]
    // [userQuery]
  );
  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
