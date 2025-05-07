import React from "react";
import MiddleLayout from "@/components/layouts/MiddleLayout";

const MiddleLayoutPage = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <MiddleLayout>{children}</MiddleLayout>;
};

export default MiddleLayoutPage;
