import React from "react";
import ResetPasswordForm from "./form";
import { notFound } from "next/navigation";
import { getTokenAction } from "../actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Khôi Phục Tài Khoản",
};

const ResetPasswordPage = async (props: {
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

  const expiredElement: React.JSX.Element = (
    <p className="text-sm text-red-500 text-center">
      Your change password token has expired
    </p>
  );

  const tokenData = await getTokenAction(token);

  if (!tokenData) return expiredElement;

  if (tokenData.sessionType != "recoverAccount") return notFound();

  if (tokenData.disableAt == null) return <ResetPasswordForm token={token} />;

  return expiredElement;
};

export default ResetPasswordPage;
