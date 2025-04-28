import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import SignInForm from "../../_components/forms/SignInForm";
import { cookies } from "next/headers";
export const metadata: Metadata = {
  title: "Đăng Nhập",
};

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const LogInPage = async (props: {
  params: Params;
  searchParams: SearchParams;
}) => {
  const searchParams = await props.searchParams;
  const cookieStore = await cookies();
  const email = typeof searchParams.email == "string" ? searchParams.email : "";

  return (
    <div className="flex flex-col items-center gap-6 bg-background p-2 sm:p-10">
      <SignInForm
        email={email}
        statusError={cookieStore.get("oauth2_error_type")?.value}
      />
    </div>
  );
};

export default LogInPage;
