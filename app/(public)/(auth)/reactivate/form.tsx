"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { sendReactivateAccountAction } from "../actions";

const ReactivateForm = ({ email }: { email: string }) => {
  const { isPending } = useQuery({
    queryKey: ["reactivate"],
    queryFn: async () => {
      return await sendReactivateAccountAction(email);
    },
  });

  return <div>{isPending ? <p>Loading...</p> : <p>ReactivateForm</p>}</div>;
};

export default ReactivateForm;
