import React from "react";
import Link from "next/link";
import Image from "next/image";

const BrandLogo = () => {
  return (
    <Link href={"/"}>
      <Image
        priority
        className="object-cover"
        src="/images/logo2.png"
        alt="logo"
        width={200}
        height={56}
      />
    </Link>
  );
};

export default BrandLogo;
