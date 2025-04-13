import React from "react";
import { UserProvider } from "./UserProvider";
import { getCurrrentUser } from "@/data/user";

const PrivateLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const user = await getCurrrentUser();
  console.log("PrivateLayout", user);
  return <UserProvider user={user}>{children}</UserProvider>;
};

export default PrivateLayout;
