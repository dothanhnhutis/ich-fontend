"use client";
// import { useSearchParams } from "next/navigation";
import React from "react";

const GooglePage = () => {
  //   const [searchParams] = useSearchParams();
  //   const accessToken = searchParams.("access_token"); // Giả sử máy chủ chuyển hướng với access_token

  React.useEffect(() => {
    console.log("window.opener", window.opener);
    if (window.opener) {
      window.opener.postMessage(
        { type: "oauth2-success", accessToken: "ss" },
        window.opener.location.origin
      );
      window.close(); // Đóng popup sau khi gửi thông báo
    }
  });

  return <div>Đang xử lý xác thực...</div>;
};

export default GooglePage;
