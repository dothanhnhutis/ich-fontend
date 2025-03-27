import React from "react";
import { UserProvider } from "./user-provider";

const PrivateLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return <UserProvider>{children}</UserProvider>;
};

export default PrivateLayout;
