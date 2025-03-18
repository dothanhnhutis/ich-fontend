"use server";

import env from "@/configs/env";
import { getHeaders } from "@/lib/action";
import FetchAPI, { FetchError } from "@/lib/fetchApi";

const customerProductApi = FetchAPI.createInstance({
  baseUrl: env.NEXT_PUBLIC_SERVER_URL + "/api/v1/customers",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export type Product = {
  id: string;
  prodName: string;
  packSpec: number;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  images: {
    id: string;
    url: string;
    priority: number;
    width?: number;
    height?: number;
    altText?: string;
  }[];
};

export const getCustomerProducts = async (customerId: string) => {
  try {
    const res = await customerProductApi.get<{
      success: boolean;
      message: string;
      data: Product[];
    }>(`/${customerId}/products`, {
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
    return [];
  }
};
