import React from "react";
import BrandLogo from "../commons/brand-logo";
import UserDropdownMenu from "../commons/UserDropdown";

const MiddleLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <div className="sticky top-0 left-0 right-0 z-50 bg-accent-foreground">
        <div className="flex items-center justify-between gap-2 px-2 sm:px-3 py-1 h-[64px] mx-auto max-w-7xl">
          <BrandLogo />
          <UserDropdownMenu />
        </div>
      </div>
      {children}
    </>
  );
};

export default MiddleLayout;
