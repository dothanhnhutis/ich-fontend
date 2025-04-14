import React from "react";
import Link from "next/link";

import env from "@/configs/env";
import { Button } from "@/components/ui/button";
import { verifyJWT } from "@/lib/jwt";
import { confirmEmailAction } from "../actions";

const ConfirmEmailPage = async (props: {
  searchParams: Promise<{ token?: string | string[] | undefined }>;
}) => {
  const searchParams = await props.searchParams;
  const token =
    typeof searchParams.token == "string" ? searchParams.token : undefined;

  const expiredElement: React.JSX.Element = (
    <div className="flex flex-col items-center sm:mx-auto sm:max-w-md gap-2 text-center text-red-500">
      <h4 className="font-semibold text-2xl text-black">Xác Thực Tài Khoản</h4>
      <p>Xác thực email không thành công.</p>
      <p>Mã thông báo đã hết hạn</p>

      <Button asChild>
        <Link href="/">Go to Home</Link>
      </Button>
    </div>
  );

  if (!token) {
    return expiredElement;
  }

  const { success } = await confirmEmailAction(token);

  if (!success) return expiredElement;

  return (
    <div className="flex flex-col items-center sm:mx-auto sm:max-w-md gap-2 text-center text-green-500">
      <h4 className="font-semibold text-2xl text-black">Xác Thực Tài Khoản</h4>
      <p className="text-sm text-green-500 text-center">
        Xác thực tài khoản thành công
      </p>
      <Button asChild>
        <Link href="/">Go to Home</Link>
      </Button>
    </div>
  );
};

export default ConfirmEmailPage;
