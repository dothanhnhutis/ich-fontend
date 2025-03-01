"use server";

import FetchAPI, { FetchError } from "@/lib/fetchApi";
import env from "@/configs/env";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const productInstance = FetchAPI.createInstance({
  baseUrl: env.NEXT_PUBLIC_SERVER_URL + "/api/v1/locations",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const imageInstance = FetchAPI.createInstance({
  baseUrl: env.NEXT_PUBLIC_SERVER_URL + "/api/v1/images",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

type CreateProductActionData = {
  prod_name: string;
  images: File[];
  pack_spec: number;
};
export const createProductAction = async (data: CreateProductActionData) => {
  try {
    const formData = new FormData();
    formData.append("image", data.images[0]);

    const allCookie = (await cookies())
      .getAll()
      .map((c) => `${c.name}=${encodeURIComponent(c.value)}`)
      .join("; ");

    const res = await imageInstance.post<{
      status: number;
      success: boolean;
      message: string;
    }>("/upload", formData, {
      headers: {
        Cookie: allCookie,
      },
    });

    console.log(res.data);

    return {
      success: res.data.success,
      message: res.data.message,
    };
  } catch (error: unknown) {
    if (error instanceof FetchError) {
      return {
        success: false,
        message: error.message,
      };
    }
    console.log(error);
  }

  return { success: false, message: "hmmmmmmm" };
};
