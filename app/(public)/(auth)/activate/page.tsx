import React from "react";
import { notFound } from "next/navigation";

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

  return <p>123</p>;
};

export default ReactivatePage;
