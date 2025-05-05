import React from "react";
import { Metadata } from "next";
import { cookies } from "next/headers";
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

  return <SignIn email={email} />;
};

export default LogInPage;
