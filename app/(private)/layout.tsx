import React from "react";
import { UserProvider } from "./user-provider";
import { getCurrrentUser } from "@/data/user";

const PrivateLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const user = await getCurrrentUser();
  return <UserProvider user={user}>{children}</UserProvider>;
};

export default PrivateLayout;
