"use server";
import FetchAPI, { FetchError } from "@/lib/_fetchApi";
import { revalidatePath } from "next/cache";
import env from "@/configs/env";
import { getHeaders } from "@/lib/action";

const locationApi = FetchAPI.createInstance({
  baseUrl: env.NEXT_PUBLIC_SERVER_URL + "/api/v1/locations",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export type CreateLocationActionData = {
  locationName: string;
  address: string;
  locationType: "Factory" | "Warehouse";
  roomNames: string[];
};

export type Location = {
  id: string;
  locationName: string;
  address: string;
  locationType: "Factory" | "Warehouse";
  createdAt: string;
  updatedAt: string;
};

export type Room = {
  id: string;
  roomName: string;
  locationId: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateLocationData = {
  locationName?: string;
  address?: string;
  locationType?: "Factory" | "Warehouse";
  rooms?: (
    | {
        roomId: string;
        roomName: string;
      }
    | { roomId: string }
    | { roomName: string }
  )[];
};

export const createLocationAction = async (
  formData: CreateLocationActionData
) => {
  try {
    const { roomNames, ...locationData } = formData;
    const res = await locationApi.post<{
      success: boolean;
      message: string;
      data: Location;
    }>("/", locationData, {
      headers: await getHeaders(),
    });

    await Promise.all(
      roomNames.map((roomName) =>
        createRoomOfLocationAction(res.data.data.id, roomName)
      )
    );

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

export const getLocationsAction = async () => {
  try {
    const res = await locationApi.get<{
      success: boolean;
      message: string;
      data: Location[];
    }>("/", {
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

export const getLocationByIdAction = async (locationId: string) => {
  try {
    const { data } = await locationApi.get<{
      success: boolean;
      message: string;
      data: Location;
    }>("/" + locationId, {
      headers: await getHeaders(),
    });

    return data.data;
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

export const getRoomsOfLocationAction = async (locationId: string) => {
  try {
    const { data } = await locationApi.get<{
      success: boolean;
      message: string;
      data: Room[];
    }>(`${locationId}/rooms`, {
      headers: await getHeaders(),
    });

    return data.data;
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

export const createRoomOfLocationAction = async (
  locationId: string,
  roomName: string
) => {
  try {
    const { data } = await locationApi.post<{
      success: boolean;
      message: string;
      data: Room[];
    }>(
      `/${locationId}/rooms`,
      { roomName },
      {
        headers: await getHeaders(),
      }
    );

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

export const updateRoomOfLocationAction = async (
  locationId: string,
  roomId: string,
  newroomName: string
) => {
  try {
    const { data } = await locationApi.put<{
      success: boolean;
      message: string;
      data: Room[];
    }>(
      `/${locationId}/rooms/${roomId}`,
      { roomName: newroomName },
      {
        headers: await getHeaders(),
      }
    );

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

export const deleteRoomOfLocationAction = async (
  locationId: string,
  roomId: string
) => {
  try {
    const { data } = await locationApi.delete<{
      success: boolean;
      message: string;
      data: Room[];
    }>(
      `/${locationId}/rooms/${roomId}`,

      {
        headers: await getHeaders(),
      }
    );

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

export const updateLocationByIdAction = async (
  locationId: string,
  formData: UpdateLocationData
) => {
  try {
    const res = await locationApi.put<{
      status: number;
      success: boolean;
      message: string;
    }>("/" + locationId, formData, {
      headers: await getHeaders(),
    });

    if (formData.rooms) {
      await Promise.all(
        formData.rooms.map((room) => {
          if ("roomId" in room && "roomName" in room) {
            updateRoomOfLocationAction(locationId, room.roomId, room.roomName);
          } else if ("roomId" in room) {
            deleteRoomOfLocationAction(locationId, room.roomId);
          } else {
            createRoomOfLocationAction(locationId, room.roomName);
          }
        })
      );
    }

    revalidatePath("/admin/locations/" + locationId + "/edit");

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

export const deleteLocationByIdAction = async (locationId: string) => {
  try {
    const res = await locationApi.delete<{
      status: number;
      success: boolean;
      message: string;
    }>("/" + locationId, {
      headers: await getHeaders(),
    });

    revalidatePath("/admin/locations/" + locationId + "/edit");

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
