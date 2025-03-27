import React from "react";
import { UserProvider } from "./user-provider";
import { currrentUser } from "@/data/user";

const PrivateLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const user = await currrentUser();
  return <UserProvider user={user}>{children}</UserProvider>;
};

export default PrivateLayout;
