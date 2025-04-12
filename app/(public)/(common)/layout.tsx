import React from "react";

const PiblicLayout = ({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) => {
  return (
    <>
      {modal}
      {children}
    </>
  );
};

export default PiblicLayout;
