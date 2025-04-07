import React from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

const ReactivatePage = async () => {
  const cookieStore = await cookies();

  const data = cookieStore.get("reActiveAccount");
  if (!data) {
    return notFound();
  } else {
    await activateAccountAction(data.value);
    return <div>ReactivatePage</div>;
  }
};

export default ReactivatePage;
