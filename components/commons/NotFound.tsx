import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <div className="mx-auto max-w-screen-md w-full text-center">
      <div className="bg-not-found bg-no-repeat bg-center h-[400px]">
        <h1 className="text-[80px] font-bold">404</h1>
      </div>
      <div className="mt-[-50px]">
        <h2 className="text-[35px]">Có lẽ bạn đang bị lạc</h2>
        <p className="text-sm">trang bạn đang tìm kiếm không có sẵn!</p>
        <Link
          href={"/"}
          className="inline-block my-5 px-5 py-2.5 bg-primary text-white rounded-md"
        >
          Trở về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
