import React from "react";
import RecoverForm from "./form";

const RecoverPage = async (props: {
  searchParams: Promise<{ email?: string | string[] | undefined }>;
}) => {
  const searchParams = await props.searchParams;
  const email =
    typeof searchParams.email == "string"
      ? searchParams.email
      : Array.isArray(searchParams.email)
      ? searchParams.email.pop()
      : "";

  return <RecoverForm email={email} />;
};

export default RecoverPage;
