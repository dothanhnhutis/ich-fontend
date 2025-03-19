"use server";

import env from "@/configs/env";
import { getHeaders } from "@/lib/action";
import FetchAPI, { FetchError } from "@/lib/fetchApi";

const customerProductApi = FetchAPI.createInstance({
  baseUrl: env.NEXT_PUBLIC_SERVER_URL + "/api/v1/customers",
  credentials: "include",
  headers: {
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

export type ProductImage = {
  id: string;
  url: string;
  mimeType: string;
  size: number;
  width: number;
  height: number;
  priority: number;
  storagePath: string;
  createdAt: Date;
  deletedAt: Date | null;
  altText: string;
  uploadedById: string;
  productId: string;
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

export const createCustomerProductAction = async (
  customerId: string,
  formData: { prodName: string; packSpec: number; images: File[] }
) => {
  try {
    const headers = await getHeaders();
    const { data } = await customerProductApi.post<{
      success: boolean;
      message: string;
      data: Product;
    }>(
      `/${customerId}/products`,
      {
        prodName: formData.prodName,
        packSpec: formData.packSpec,
      },
      {
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      }
    );
    let priority = 1;
    for (const image of formData.images) {
      const form = new FormData();
      form.append("image", image);

      await customerProductApi.post<{
        success: boolean;
        message: string;
        data: ProductImage;
      }>(`/${customerId}/products/${data.data.id}/images/${priority}`, form, {
        headers,
      });
      priority = priority + 1;
    }

    return { success: data.success, message: data.message };
  } catch (error: unknown) {
    let mess = "unknown error";
    if (error instanceof FetchError) {
      mess = error.message;
    } else if (error instanceof Error) {
      mess = error.message;
    }
    return { success: false, message: mess };
  }
};
