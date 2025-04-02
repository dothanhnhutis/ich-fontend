import React from "react";
import ResetPasswordForm from "./form";
import { verifyJWT } from "@/lib/utils";
import { UserToken } from "@/schema/user.schema";
import env from "@/configs/env";

const ResetPasswordPage = ({
  searchParams,
}: {
  searchParams: { token?: string | string[] | undefined };
}) => {
  const token =
    typeof searchParams.token == "string" ? searchParams.token : undefined;

  const expiredElement: JSX.Element = (
    <p className="text-sm text-red-500 text-center">
      Your change password token has expired
    </p>
  );

  if (!token) {
    return expiredElement;
  }
  const data = verifyJWT<UserToken>(token, env.NEXT_PUBLIC_JWT_SECRET, {
    ignoreExpiration: false,
  });
  if (!data || data.type != "recover") return expiredElement;
  return <ResetPasswordForm token={token} />;
};

export default ResetPasswordPage;
