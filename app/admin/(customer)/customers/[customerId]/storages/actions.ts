"use server";

import env from "@/configs/env";
import { getHeaders } from "@/lib/action";
import FetchAPI, { FetchError } from "@/lib/fetchApi";
import { revalidatePath } from "next/cache";

const customerStorageApi = FetchAPI.createInstance({
  baseUrl: env.NEXT_PUBLIC_SERVER_URL + "/api/v1/customers",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export type Storage = {
  id: string;
  storekeeper: string;
  phoneNumber: string;
  address: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
};

export const getStoragesOfCustomerAction = async (customerId: string) => {
  try {
    const res = await customerStorageApi.get<{
      success: boolean;
      message: string;
      data: Storage[];
    }>(`/${customerId}/storages`, {
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

export type CustomerStorageData = {
  storekeeper: string;
  phoneNumber: string;
  address: string;
};

export const createCustomerStorageAction = async (
  customerId: string,
  formData: CustomerStorageData
) => {
  try {
    const res = await customerStorageApi.post<{
      success: boolean;
      message: string;
      data: Location;
    }>(`/${customerId}/storages`, formData, {
      headers: await getHeaders(),
    });

    revalidatePath(`/admin/customers/${customerId}/storages`);

    return {
      success: res.data.success,
      message: res.data.message,
    };
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

export const deleteStorageOfCustomerAction = async (
  customerId: string,
  storageId: string
) => {
  try {
    const { data } = await customerStorageApi.delete<{
      success: boolean;
      message: string;
    }>(
      `/${customerId}/storages/${storageId}`,

      {
        headers: await getHeaders(),
      }
    );
    revalidatePath(`/admin/customers/${customerId}/storages`);
    revalidatePath(`/admin/customers/${customerId}/storages/${storageId}`);

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

export const getStorageOfCustomer = async (
  customerId: string,
  storageId: string
) => {
  try {
    const res = await customerStorageApi.get<{
      success: boolean;
      message: string;
      data: Storage;
    }>(`/${customerId}/storages/${storageId}`, {
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

export const updateCustomerStorageAction = async (
  customerId: string,
  storageId: string,
  formData: CustomerStorageData
) => {
  try {
    const res = await customerStorageApi.put<{
      success: boolean;
      message: string;
      data: Location;
    }>(`/${customerId}/storages/${storageId}`, formData, {
      headers: await getHeaders(),
    });

    revalidatePath(`/admin/customers/${customerId}/storages`);
    revalidatePath(`/admin/customers/${customerId}/storages/${storageId}`);

    return {
      success: res.data.success,
      message: res.data.message,
    };
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
