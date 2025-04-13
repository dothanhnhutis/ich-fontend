import Image from "next/image";
import Link from "next/link";
import React from "react";

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <div className="sticky top-0 left-0 right-0 z-50 bg-accent-foreground">
        <div className="flex items-center justify-between gap-2 px-2 sm:px-3 py-1 h-[64px] mx-auto max-w-7xl">
          <Link href={"/"}>
            <Image
              priority
              className="object-cover"
              src="/logo2.png"
              alt="logo"
              width={200}
              height={56}
            />
          </Link>
        </div>
      </div>

      {children}
    </>
  );
};

export default AuthLayout;
