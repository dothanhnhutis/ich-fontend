import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

import { Button } from "@/components/commons/button";
import { confirmEmailAction, getTokenAction } from "@/libs/actions/AuthActions";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Xác Thực Tài Khoản",
};
const ConfirmEmailPage = async (props: {
  searchParams: Promise<{ token?: string | string[] | undefined }>;
}) => {
  const searchParams = await props.searchParams;
  const token =
    typeof searchParams.token == "string"
      ? searchParams.token
      : Array.isArray(searchParams.token)
      ? searchParams.token.pop()
      : undefined;

  if (!token) notFound();

  const tokenData = await getTokenAction(token);

  if (
    !tokenData ||
    tokenData.tokenKey != "verify-email" ||
    tokenData.disabledAt != null
  )
    return notFound();

  const { isSuccess } = await confirmEmailAction(token);
  if (!isSuccess)
    return (
      <div className="flex flex-col items-center sm:mx-auto sm:max-w-md gap-2 text-center text-green-500">
        <h4 className="font-semibold text-2xl text-black">
          Xác Thực Tài Khoản
        </h4>
        <p className="text-sm text-red-500 text-center">
          Xác thực tài khoản thất bại
        </p>
        <Button asChild>
          <Link href="/">Go to Home</Link>
        </Button>
      </div>
    );

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
