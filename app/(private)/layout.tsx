import React from "react";
import { UserProvider } from "./UserProvider";
import UserApi from "@/lib/services/user";

const PrivateLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const user = await UserApi.getCurrrentUser();
  return <UserProvider user={user}>{children}</UserProvider>;
};

export default PrivateLayout;
