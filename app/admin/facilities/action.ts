"use server";

import FetchAPI, { FetchError } from "@/lib/fetchApi";
import env from "@/configs/env";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const facilityInstance = FetchAPI.createInstance({
  baseUrl: env.NEXT_PUBLIC_SERVER_URL + "/api/v1/locations",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export type CreateFacilityActionData = {
  location_name: string;
  address: string;
  location_type: "Factory" | "Warehouse";
  room_names: string[];
};

export const createFacilityAction = async (
  formData: CreateFacilityActionData
) => {
  try {
    const allCookie = (await cookies())
      .getAll()
      .map((c) => `${c.name}=${encodeURIComponent(c.value)}`)
      .join("; ");

    const res = await facilityInstance.post<{
      status: number;
      success: boolean;
      message: string;
    }>("/", formData, {
      headers: {
        Cookie: allCookie,
      },
    });

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

export type Facility = {
  id: string;
  location_name: string;
  address: string;
  location_type: "Factory" | "Warehouse";
  created_at: string;
  updated_at: string;
  rooms: {
    id: string;
    room_name: string;
    location_id: string;
    created_at: string;
    updated_at: string;
  }[];
};

export const getFacilitiesAction = async () => {
  try {
    const allCookie = (await cookies())
      .getAll()
      .map((c) => `${c.name}=${encodeURIComponent(c.value)}`)
      .join("; ");

    const res = await facilityInstance.get<{
      success: boolean;
      message: string;
      data: Facility[];
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
        data: [],
      };
    }
    console.log(error);
  }

  return { success: false, message: "hmmmmmmm", data: [] };
};

export const getFacilityById = async (facilityId: string) => {
  try {
    const allCookie = (await cookies())
      .getAll()
      .map((c) => `${c.name}=${encodeURIComponent(c.value)}`)
      .join("; ");

    const res = await facilityInstance.get<{
      success: boolean;
      message: string;
      data: Facility;
    }>("/" + facilityId, {
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

export type UpdateFacilityData = {
  location_name?: string;
  address?: string;
  location_type?: "Factory" | "Warehouse";
  rooms?: (
    | {
        room_id: string;
        room_name: string;
      }
    | { room_id: string }
    | { room_name: string }
  )[];
};
export const updateFacilityById = async (
  facilityId: string,
  formData: UpdateFacilityData
) => {
  try {
    const allCookie = (await cookies())
      .getAll()
      .map((c) => `${c.name}=${encodeURIComponent(c.value)}`)
      .join("; ");

    const res = await facilityInstance.put<{
      status: number;
      success: boolean;
      message: string;
    }>("/" + facilityId, formData, {
      headers: {
        Cookie: allCookie,
      },
    });

    revalidatePath("/admin/facilities/" + facilityId + "/edit");

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

export const deleteFacilityById = async (facilityId: string) => {
  try {
    const allCookie = (await cookies())
      .getAll()
      .map((c) => `${c.name}=${encodeURIComponent(c.value)}`)
      .join("; ");

    const res = await facilityInstance.delete<{
      status: number;
      success: boolean;
      message: string;
    }>("/" + facilityId, {
      headers: {
        Cookie: allCookie,
      },
    });

    revalidatePath("/admin/facilities/" + facilityId + "/edit");

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
