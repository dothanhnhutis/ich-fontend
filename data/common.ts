import { string2Cookie } from "@/lib/utils";
import { cookies, headers } from "next/headers";

export const getHeaders = async () => {
  const allCookie = (await cookies())
    .getAll()
    .map((c) => `${c.name}=${encodeURIComponent(c.value)}`)
    .join("; ");
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "Unknown";
  const ipRaw = headersList.get("x-forwarded-for") || "127.0.0.1";
  const clientIP = ipRaw.split(",")[0].trim();

  return {
    Cookie: allCookie,
    "x-forwarded-for": clientIP,
    "user-agent": userAgent,
  };
};

export async function loadCookie(rawCookie: string) {
  const cookiesParse = string2Cookie(rawCookie);
  const cookieStore = await cookies();
  for (const { name, value, options } of cookiesParse) {
    cookieStore.set(name, value, options);
  }
}

export type DefaultResponseData = {
  status: number;
  success: boolean;
  message: string;
};
