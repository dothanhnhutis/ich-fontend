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
  // const user = await getCurrentUserAction();

  // const user: User = {
  //   id: "219fa80c-9e14-4508-befc-417f18c4227e",
  //   email: "dothanhnhutis@gmail.com",
  //   emailVerified: new Date("2025-05-08T09:13:34.382Z"),
  //   avatar:
  //     "https://lh3.googleusercontent.com/a/ACg8ocKbXbfk2PekhZEgLScP0Y1l3AVFAae5HuICO-l-ug-FZEESDIg=s96-c",
  //   username: "Thành Nhựt Đỗ",
  //   isDisabled: false,
  //   disabledAt: null,
  //   isBanned: false,
  //   bannedAt: null,
  //   banExpires: null,
  //   banReason: null,
  //   createdAt: new Date("2025-05-08T09:13:34.383Z"),
  //   updatedAt: new Date("2025-05-08T09:13:34.383Z"),
  //   roles: [],
  //   session: {
  //     id: "f5ade75817371ecf1619ce02d98e63e14d31dd12",
  //     provider: "google",
  //     userId: "219fa80c-9e14-4508-befc-417f18c4227e",
  //     cookie: {
  //       path: "/",
  //       httpOnly: true,
  //       secure: false,
  //       expires: new Date("2025-06-07T09:22:09.576Z"),
  //     },
  //     ip: "::1",
  //     userAgent: {
  //       ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
  //       browser: {},
  //       cpu: {},
  //       device: {},
  //       engine: {},
  //       os: {},
  //     },
  //     lastAccess: new Date("2025-05-08T09:22:09.576Z"),
  //     createAt: new Date("2025-05-08T09:13:34.409Z"),
  //   },
  //   hasPassword: false,
  // };
  return (
    <>
      <TanstackQueryClientProvider>
        <UserProvider>
          {children}
          <Toaster visibleToasts={5} richColors />
        </UserProvider>
      </TanstackQueryClientProvider>
    </>
  );
};

export default GlobalProvider;
