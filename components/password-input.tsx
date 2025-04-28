"use client";
import cn from "@/utils/cn";
import { EyeIcon, EyeClosedIcon } from "lucide-react";
import React from "react";

const PasswordInput = ({
  className,
  isPassword,
  onTypeChange,
  defaultPassword,
  disabled,
  isError,
  ...props
}: Omit<React.ComponentPropsWithoutRef<"input">, "type"> &
  Partial<{
    defaultPassword: boolean;
    isPassword: boolean;
    onTypeChange: (isPassword: boolean) => void;
    isError?: boolean;
  }>) => {
  const [hiddenPassword, setHiddenPassword] = React.useState<boolean>(
    defaultPassword ?? true
  );

  React.useEffect(() => {
    if (isPassword) setHiddenPassword(isPassword);
  }, [isPassword]);

  return (
    <div
      className={cn(
        "flex items-center gap-2 border h-9 rounded-md px-3 py-1 group focus-within:ring-4 focus-within:outline-1 ring-ring/10 ",
        disabled ? "cursor-not-allowed opacity-50" : "",
        isError ? "border-red-500 bg-red-50 outline-red-50 ring-red-50" : "",
        className
      )}
    >
      <input
        className={cn(
          "w-full h-full focus-visible:outline-0 focus-visible:ring-0 ",
          disabled ? "cursor-not-allowed" : ""
        )}
        type={isPassword ?? hiddenPassword ? "password" : "text"}
        disabled={disabled}
        {...props}
      />
      {isPassword ?? hiddenPassword ? (
        <EyeClosedIcon
          onClick={() => {
            setHiddenPassword(!hiddenPassword);
            if (onTypeChange) {
              onTypeChange(!hiddenPassword);
            }
          }}
          className={cn(
            "shrink-0 h-4 w-4 cursor-pointer",
            disabled ? "cursor-not-allowed" : ""
          )}
        />
      ) : (
        <EyeIcon
          onClick={() => {
            setHiddenPassword(!hiddenPassword);
            if (onTypeChange) {
              onTypeChange(!hiddenPassword);
            }
          }}
          className={cn(
            "shrink-0 h-4 w-4 cursor-pointer",
            disabled ? "cursor-not-allowed" : ""
          )}
        />
      )}
    </div>
  );
};

export default PasswordInput;
