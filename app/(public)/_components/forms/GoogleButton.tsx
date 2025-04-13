"use client";
import React from "react";
import { Button } from "@/components/ui/button";

const GoogleButton = ({
  label = "Đăng nhập bằng Google",
}: {
  label?: string;
}) => {
  const popupWindowRef = React.useRef<WindowProxy | null>(null);

  function handleOnClick() {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;
    popupWindowRef.current = window.open(
      "http://localhost:4000/api/v1/auth/google",
      "googleLogin",
      `toolbar=no, menubar=no, width=${width}, height=${height}, left=${left}, top=${top}`
    );

    // window.addEventListener("message", (event) => {
    //   if (event.origin !== window.location.origin) return;

    //   const { token } = event.data;
    //   if (token) {
    //     console.log("Access Token từ Google:", token);
    //   }
    // });
  }

  React.useEffect(() => {
    const handleMessage = (event: any) => {
      if (event.origin === "http://localhost:3000") {
        // Xử lý dữ liệu nhận được từ popup
        console.log("Xử lý dữ liệu nhận được từ popup");
        popupWindowRef.current?.close();
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  });

  return (
    <Button
      variant="outline"
      className="w-full"
      type="button"
      onClick={handleOnClick}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path
          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
          fill="currentColor"
        />
      </svg>
      {label}
    </Button>
  );
};

export default GoogleButton;
