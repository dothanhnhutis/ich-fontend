import React from "react";
import SignInForm from "../../_components/forms/signin-form";

const SignIn = async ({
  searchParams,
}: {
  searchParams: { email?: string | string[] | undefined };
}) => {
  const email = typeof searchParams.email == "string" ? searchParams.email : "";
  return <SignInForm />;
};

export default SignIn;
