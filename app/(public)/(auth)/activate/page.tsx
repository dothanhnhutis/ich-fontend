import React from "react";
import { notFound } from "next/navigation";
import { activateAccountAction } from "../actions";

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

  const { success, message } = await activateAccountAction(token);
  if (success) return <p>{message}</p>;

  return <p>{message}</p>;
};

export default ReactivatePage;
