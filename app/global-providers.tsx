import React from "react";
import { Toaster } from "sonner";
import { UserProvider } from "@/libs/contexts/user-context";
import TanstackQueryClientProvider from "@/libs/contexts/query-client-context";
import { getCurrentUserAction } from "@/libs/actions/UserActions";
import { User } from "@/types/user";

const GlobalProvider = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const user = await getCurrentUserAction();

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
