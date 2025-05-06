import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { sendReactivateAccountAction } from "@/libs/actions/AuthActions";

export const metadata: Metadata = {
  title: "Khôi Phục Tài Khoản",
};

const ReactivatePage = async (props: {
  searchParams: Promise<{ token?: string | string[] | undefined }>;
}) => {
  const searchParams = await props.searchParams;
  const token =
    typeof searchParams.token == "string"
      ? searchParams.token
      : Array.isArray(searchParams.token)
      ? searchParams.token.pop()
      : null;

  if (!token) return notFound();

  const { isSuccess, message } = await sendReactivateAccountAction(token);

  if (isSuccess) return <p className="text-green-500">{message}</p>;

  return <p className="text-red-500">{message}</p>;
};

export default ReactivatePage;
