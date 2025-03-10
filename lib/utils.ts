import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CookieOpt {
  domain?: string | undefined;
  encode?(value: string): string;
  expires?: Date | undefined;
  httpOnly?: boolean | undefined;
  maxAge?: number | undefined;
  partitioned?: boolean | undefined;
  path?: string | undefined;
  priority?: "low" | "medium" | "high" | undefined;
  sameSite?: true | false | "lax" | "strict" | "none" | undefined;
  secure?: boolean | undefined;
}

export function string2Cookie(cookieHeader: string) {
  const cookieRegex = /[^,]+(?:,(?!\s*[A-Za-z0-9!#$%&'*+\-.^_`|~]+=)[^,]+)*/g;
  const cookiesArray = cookieHeader.match(cookieRegex);

  const cookies: {
    name: string;
    value: string;
    options: CookieOpt;
  }[] = [];

  if (cookiesArray) {
    cookiesArray.forEach((cookieStr) => {
      const parts = cookieStr.split(";").map((part) => part.trim());
      const [nameValue, ...attributes] = parts;
      const [name, value] = nameValue.split("=");

      const options: CookieOpt = { path: "/" };

      attributes.forEach((attr) => {
        const [attrName, attrVal] = attr.split("=");
        switch (attrName.toLowerCase()) {
          case "expires":
            options.expires = new Date(attrVal);
            break;
          case "path":
            options.path = attrVal;
            break;
          case "httponly":
            options.httpOnly = true;
            break;
          case "secure":
            options.secure = true;
            break;
          case "samesite":
            options.sameSite = attrVal as CookieOpt["sameSite"];
            break;
          default:
            break;
        }
      });
      cookies.push({
        name,
        value,
        options,
      });
    });
  }

  return cookies;
}

export function caculatorPagination({
  totalPage,
  currentPage,
  centerItem = 1,
  firstLastItem = 5,
}: {
  totalPage: number;
  currentPage: number;
  centerItem?: number;
  firstLastItem?: number;
}) {
  if (totalPage < 1) totalPage = 1;
  if (currentPage > totalPage || currentPage <= 0) currentPage = 1;
  if (firstLastItem + (centerItem * 2 + 1) >= totalPage) {
    return Array.from({ length: totalPage }, (_, ix) => ix + 1);
  }
  const firstList: number[] = Array.from(
    { length: firstLastItem },
    (_, ix) => ix + 1
  ).filter((v) => v >= 1 && v <= totalPage);
  const lastList: number[] = Array.from(
    { length: firstLastItem },
    (_, ix) => totalPage - firstLastItem + ix + 1
  ).filter((v) => v >= 1 && v <= totalPage);
  const centerList: number[] = Array.from(
    { length: centerItem * 2 + 1 },
    (_, ix) => currentPage - Math.floor((centerItem * 2 + 1) / 2) + ix
  ).filter((v) => v >= 1 && v <= totalPage);
  let result: number[] = [];
  if (firstList.includes(currentPage)) {
    result = [...firstList, ...centerList, -1, totalPage];
  } else if (lastList.includes(currentPage)) {
    result = [1, -1, ...centerList, ...lastList];
  } else {
    result = [1, -1, ...centerList, -1, totalPage];
  }
  return result.filter((v, ix, arr) => v == -1 || arr.indexOf(v) === ix);
}

export const generateUniqueID = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

export const gcd = (a: number, b: number): number =>
  b === 0 ? a : gcd(b, a % b);

export const isValidAspectRatio = (ratio: string): boolean => {
  const aspectRatioRegex: RegExp = /^(\d+([.,]\d+)?)[:](\d+([.,]\d+)?)$/;
  return aspectRatioRegex.test(ratio);
};

export type ImgDataFormSrc = {
  height: number;
  width: number;
  aspectRatio: string;
  imageHtml: HTMLImageElement;
};
export const getImgProperty = (src: string): Promise<ImgDataFormSrc> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      const divisor = gcd(width, height);
      const aspectRatio = `${width / divisor}:${height / divisor}`;
      resolve({
        aspectRatio,
        width,
        height,
        imageHtml: img,
      });
    };
    img.onerror = reject;
  });
};

export type ImgDataUpload = ImgDataFormSrc & {
  src: string;
  file: File;
};

export const getDataFromImageFile = (file: File): Promise<ImgDataUpload> => {
  return new Promise((resolve, reject) => {
    if (!file.type.includes("image"))
      reject(new Error("Please select an image!"));
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const result = reader.result as string;
      const imgProperty = await getImgProperty(result);
      resolve({
        ...imgProperty,
        src: result,
        file: file,
      });
    };
    reader.onerror = reject;
  });
};

export const convertUrlToFile = async (url: string) => {
  try {
    // Bước 1: Tải image từ URL
    const response = await fetch(url);

    // Bước 2: Chuyển response thành Blob
    const blob = await response.blob();

    // Bước 3: Chuyển Blob thành File
    const filename = url.split("/").pop(); // Lấy tên file từ URL
    const file = new File([blob], filename!, {
      type: blob.type || "image/jpeg", // Fallback type
    });

    return file;
  } catch (error) {
    console.error("Error converting URL to File:", error);
    return null;
  }
};
