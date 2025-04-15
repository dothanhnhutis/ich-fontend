import React from "react";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { sendReactivateAccountAction } from "../actions";
import ReactivateAlert from "./ReactivateAlert";

export const metadata: Metadata = {
  title: "Khôi Phục Tài Khoản",
};

const ReactivatePage = async () => {
  const cookieStore = await cookies();

  const reactivateCookie = cookieStore.get("reactivate");
  if (!reactivateCookie) return notFound();

  return <ReactivateAlert />;
};

export default ReactivatePage;
