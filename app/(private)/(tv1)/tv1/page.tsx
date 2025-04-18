import React from "react";

const TVPage = () => {
  return (
    <div className="flex w-full relative h-svh">
      <div className="bg-yellow-300 w-full">
        <p></p>
      </div>
      <div className="absolute top-0 right-0 bottom-0 w-full max-w-[300px] bg-red-300 sm:static sm:max-w-[500px] ">
        <p>Đơn Hàng Hôm Nay</p>
        <div className="grid gap-2 p-1">
          <div className="grid p-2 bg-white rounded-md">
            <p>Tên Khách Hàng</p>
            <div className="grid gap-2">
              <div className="flex gap-2 items-center">
                <div className="bg-green-300 h-12 w-12"></div>
                <div>
                  <p>Tên Sản Phẩm</p>
                  <div className="flex items-center gap-2">
                    <div>Default</div> <p>10 Thùng x 100SP = 1000SP </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <div className="bg-green-300 h-12 w-12"></div>
                <div>
                  <p>Tên Sản Phẩm</p>
                  <div className="flex items-center gap-2">
                    <div>SKU</div> <p>1000SP </p>
                  </div>
                </div>
              </div>
            </div>
            <p>
              Đ/c: 159 Nguyễn Đình Chiểu, Phường 4, Tp. Sóc Trăng, T. Sóc Trăng
            </p>
            <p>SĐT: 0948548844 - 094000000</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TVPage;
