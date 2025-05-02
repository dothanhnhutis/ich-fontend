import React from "react";
import { notFound } from "next/navigation";
import { activateAccountAction } from "@/libs/actions/AuthActions";

const ReactivatePage = async (props: {
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

  const { message, isSuccess } = await activateAccountAction(token);
  if (isSuccess) return <p className="text-green-500">{message}</p>;

  return <p className="text-red-500">{message}</p>;
};

export default ReactivatePage;
