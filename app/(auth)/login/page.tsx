import React from "react";
import { Metadata } from "next";
import { cookies } from "next/headers";
import SignInForm from "@/components/commons/authForms/SignInForm";
import { SignInProvider } from "@/libs/contexts/signin-context";
import SignIn from "@/components/features/SignIn";

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
    // <SignInProvider>
    //   <SignInForm
    //     email={email}
    //     statusError={cookieStore.get("oauth2_error_type")?.value}
    //   />
    // </SignInProvider>
    <SignIn />
  );
};

export default LogInPage;
