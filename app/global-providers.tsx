import React from "react";
import { Toaster } from "sonner";
import { UserProvider } from "@/libs/contexts/user-context";
import UserAPI from "@/libs/services/UserAPI";
import TanstackQueryClientProvider from "@/libs/contexts/query-client-context";

const GlobalProvider = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const user = await UserAPI.getCurrrentUser();

  return (
    <>
      <TanstackQueryClientProvider>
        <UserProvider user={user}>
          {children}
          <Toaster visibleToasts={5} richColors />
        </UserProvider>
      </TanstackQueryClientProvider>
    </>
  );
};

export default GlobalProvider;
