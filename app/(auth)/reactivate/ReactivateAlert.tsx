"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { sendReactivateAccountAction } from "../actions";

const ReactivateAlert = ({ token }: { token: string }) => {
  const { isPending, data } = useQuery({
    queryKey: ["reactivate"],
    queryFn: async function () {
      return await sendReactivateAccountAction(token);
    },
  });

  if (isPending) return <p>...Loading</p>;

  return <div>{data?.message}</div>;
};

export default ReactivateAlert;
