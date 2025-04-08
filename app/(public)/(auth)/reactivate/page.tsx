import React from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import ReactivateForm from "./form";

const ReactivatePage = async () => {
  const cookieStore = await cookies();
  const data = cookieStore.get("reActiveAccount");

  if (!data) {
    return notFound();
  } else {
    return <ReactivateForm email={data.value} />;
  }
};

export default ReactivatePage;
