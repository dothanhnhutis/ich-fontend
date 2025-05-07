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
  function getLocalStorage<T>(key: string) {
    if (typeof window === "undefined") return null;
    const item = window.localStorage.getItem(key);
    if (item === null) return null;
    try {
      return JSON.parse(item) as T;
    } catch {
      return item as T;
    }
  }

  const [localStorage, setLocalStorage] = React.useState<T | null>(
    getLocalStorage(key)
  );

  React.useEffect(() => {
    setLocalStorage(getLocalStorage(key));
  }, [key]);

  const setValue = React.useCallback(
    (value: T) => {
      try {
        if (typeof value == "string" || typeof value == "number") {
          window.localStorage.setItem(key, `${value}`);
        } else {
          window.localStorage.setItem(key, JSON.stringify(value));
        }
      } catch (error) {
        return;
      }
      setLocalStorage(value);
    },
    [key]
  );

  return [localStorage, setValue];
}
