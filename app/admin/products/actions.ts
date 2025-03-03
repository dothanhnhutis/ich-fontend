"use server";

import FetchAPI, { FetchError } from "@/lib/fetchApi";
import env from "@/configs/env";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const productInstance = FetchAPI.createInstance({
  baseUrl: env.NEXT_PUBLIC_SERVER_URL + "/api/v1/products",
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
    Accept: "application/json",
  },
});

export const uploadImageAction = async (file: File) => {
  try {
    const allCookie = (await cookies())
      .getAll()
      .map((c) => `${c.name}=${encodeURIComponent(c.value)}`)
      .join("; ");

    const formData = new FormData();
    formData.append("image", file);

    const { data } = await imageInstance.post<{
      status: number;
      success: boolean;
      message: string;
      data: string;
    }>("/upload", formData, {
      headers: {
        Cookie: allCookie,
      },
    });

    return {
      success: data.success,
      message: data.message,
      data: data.data,
    };
  } catch (error: unknown) {
    if (error instanceof FetchError) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
    console.log(error);
  }

  return { success: false, message: "hmmmmmmm", data: null };
};

type CreateProductActionData = {
  prod_name: string;
  images: File[];
  pack_spec: number;
};

export type Product = {
  id: string;
  prod_name: string;
  images: string[];
  pack_spec: number;
  created_at: string;
  updated_at: string;
};

export const createProductAction = async (data: CreateProductActionData) => {
  try {
    const allCookie = (await cookies())
      .getAll()
      .map((c) => `${c.name}=${encodeURIComponent(c.value)}`)
      .join("; ");

    const imgUrls: string[] = [];

    for (const file of data.images) {
      const { data } = await uploadImageAction(file);
      if (data) {
        imgUrls.push(data);
      }
    }

    const res = await productInstance.post<{
      status: number;
      success: boolean;
      message: string;
      data: Product;
    }>(
      "/",
      {
        prod_name: data.prod_name,
        pack_spec: data.pack_spec,
        images: imgUrls,
      },
      {
        headers: {
          Cookie: allCookie,
        },
      }
    );

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

export const getProductsAction = async () => {
  try {
    const allCookie = (await cookies())
      .getAll()
      .map((c) => `${c.name}=${encodeURIComponent(c.value)}`)
      .join("; ");

    const res = await productInstance.get<{
      success: boolean;
      message: string;
      data: Product[];
    }>("/", {
      headers: {
        Cookie: allCookie,
      },
    });

    return {
      success: res.data.success,
      message: res.data.message,
      data: res.data.data,
    };
  } catch (error: unknown) {
    if (error instanceof FetchError) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
    console.log(error);
  }

  return { success: false, message: "hmmmmmmm", data: null };
};

export const getProductByIdAction = async (id: string) => {
  try {
    const allCookie = (await cookies())
      .getAll()
      .map((c) => `${c.name}=${encodeURIComponent(c.value)}`)
      .join("; ");

    const res = await productInstance.get<{
      success: boolean;
      message: string;
      data: Product;
    }>("/" + id, {
      headers: {
        Cookie: allCookie,
      },
    });

    return {
      success: res.data.success,
      message: res.data.message,
      data: res.data.data,
    };
  } catch (error: unknown) {
    if (error instanceof FetchError) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
    console.log(error);
  }

  return { success: false, message: "hmmmmmmm", data: null };
};
