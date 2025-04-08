"use server";

import env from "@/configs/env";
import { getHeaders } from "@/lib/action";
import FetchAPI, { FetchError } from "@/lib/_fetchApi";

const customerApi = FetchAPI.createInstance({
  baseUrl: env.NEXT_PUBLIC_SERVER_URL + "/api/v1/customers",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export type Customer = {
  id: string;
  cusName: string;
  createdAt: Date;
  updatedAt: Date;
};

export const getCustomerById = async (customerId: string) => {
  try {
    const res = await customerApi.get<{
      success: boolean;
      message: string;
      data: Customer;
    }>(`/${customerId}`, {
      headers: await getHeaders(),
    });
    return res.data.data;
  } catch (error: unknown) {
    let mess = "unknown error";
    if (error instanceof FetchError) {
      mess = error.message;
    } else if (error instanceof Error) {
      mess = error.message;
    }
    console.log(mess);
    return null;
  }
};
