"use client";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeClosedIcon } from "lucide-react";
import React from "react";

const PasswordInput = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"input">) => {
  const [hiddenPassword, setHiddenPassword] = React.useState<boolean>(true);

  return (
    <div className={cn("flex items-center border", className)}>
      <input className={""} type={"password"} {...props} />
      {hiddenPassword ? (
        <EyeClosedIcon className="shrink-0 h-4 w-4" />
      ) : (
        <EyeIcon className="shrink-0 h-4 w-4" />
      )}
    </div>
  );
};

export default PasswordInput;
