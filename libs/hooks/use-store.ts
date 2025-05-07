"use client";
import React from "react";

export function useStore(key: string): [string | null, (data: string) => void] {
  const data: string | null =
    typeof window != "undefined" ? window.localStorage.getItem(key) : null;

  const handleSetData = (data: string): void => {
    if (typeof window != "undefined") window.localStorage.setItem(key, data);
  };

  return [data, handleSetData];
}

export function useStore1<
  T extends
    | string
    | number
    | { [index: string]: string | number }
    | string[]
    | number[]
    | { [index: string]: string | number }[]
>(key: string): [T | null, (value: T) => void] {
  // 1. Khởi tạo state từ localStorage (chỉ chạy lần đầu)
  const [storedValue, setStoredValue] = React.useState<T | null>(() => {
    if (typeof window === "undefined") return null;
    const item = window.localStorage.getItem(key);
    if (item === null) return null;
    try {
      return JSON.parse(item) as T;
    } catch {
      return item as T;
    }
  });

  // 2. Hàm cập nhật state và sync ngược lại localStorage
  const setValue = React.useCallback(
    (value: T) => {
      try {
        const serialized = JSON.stringify(value);
        window.localStorage.setItem(key, serialized);
      } catch (error) {
        window.localStorage.setItem(key, `${value}`);
      }
      // setStoredValue(value);
    },
    [key]
  );

  return [storedValue, setValue];
}
