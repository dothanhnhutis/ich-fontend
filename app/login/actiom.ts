"use server";

import FetchAPI from "@/lib/fetchApi";
import { headers } from "next/headers";

const authApi = FetchAPI.createInstance({
  baseUrl: "http://localhost:4000" + "/api/v1/users",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const login = async (data: { email: string; password: string }) => {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "Unknown";
  const ipRaw = headersList.get("x-forwarded-for") || "127.0.0.1";
  const clientIP = ipRaw.split(",")[0].trim();
  console.log(userAgent);
  console.log(clientIP);

  await authApi.post("/signin", data, {
    headers: {
      "x-forwarded-for": clientIP,
      "user-agent": userAgent,
    },
  });
};
