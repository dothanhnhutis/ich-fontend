import React from "react";
import { UserProvider } from "./UserProvider";
import UserAPI from "@/libs/services/UserAPI";

const PrivateLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const user = await UserAPI.getCurrrentUser();
  return <UserProvider user={user}>{children}</UserProvider>;
};

export default PrivateLayout;
