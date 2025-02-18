"use client";
import React from "react";
import DisplayFilter from "./display-filter";
import DisplayList from "./display-list";
import DisplayFooter from "./display-footer";

const DisplayBody = () => {
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  return (
    <main className="max-w-7xl mx-auto px-2 w-full py-4">
      <DisplayFilter viewMode={viewMode} setViewMode={setViewMode} />
      <DisplayList
        mode={viewMode}
        orders={[
          {
            id: "123",
            cus_name:
              "Thanh To Thanh To Thanh To Thanh To Thanh To Thanh To Thanh To Thanh To Thanh To Thanh To Thanh To Thanh To Thanh To Thanh To Thanh To Thanh To Thanh To Thanh To Thanh To Thanh To Thanh To Thanh To ",
            priority: 0,
            products: [
              {
                pack_spec: 10,
                prod_img:
                  "https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792756/ich/z6113933456468_cadbdc1dd04475224e7c8632416aaa5d_kfsyxj.jpg",
                prod_name: "Face / Kem Face",
                quantity: 10,
                unit: "CARTON",
              },
              {
                pack_spec: 200,
                prod_img:
                  "https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792756/ich/z6113933456468_cadbdc1dd04475224e7c8632416aaa5d_kfsyxj.jpg",
                prod_name: "Face / Kem Face",
                quantity: 10,
                unit: "PACKAGED_GOODS",
              },
            ],
            status: "ON_PROGRESS",
            address:
              "195 Nguyễn Đình Chiểu, Khóm 3, Phường 4, Tp. Sóc Trăng, T. Sóc Trăng",
            phone_number: "0948548844",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: "456",
            cus_name:
              "Thanh To Thanh To Thanh To Thanh To Thanh To Thanh To Thanh To Thanh To Thanh To Thanh To Thanh To Thanh To Thanh To Thanh To Thanh To Thanh To Thanh To Thanh To Thanh To Thanh To Thanh To Thanh To ",
            priority: 0,
            products: [
              {
                pack_spec: 10,
                prod_img:
                  "https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792756/ich/z6113933456468_cadbdc1dd04475224e7c8632416aaa5d_kfsyxj.jpg",
                prod_name: "Face / Kem Face",
                quantity: 10,
                unit: "CARTON",
              },
              {
                pack_spec: 200,
                prod_img:
                  "https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792756/ich/z6113933456468_cadbdc1dd04475224e7c8632416aaa5d_kfsyxj.jpg",
                prod_name: "Face / Kem Face",
                quantity: 10,
                unit: "PACKAGED_GOODS",
              },
            ],
            status: "ON_PROGRESS",
            address:
              "195 Nguyễn Đình Chiểu, Khóm 3, Phường 4, Tp. Sóc Trăng, T. Sóc Trăng",
            phone_number: "0948548844",
            created_at: new Date(),
            updated_at: new Date(),
          },
        ]}
      />
      <DisplayFooter />
    </main>
  );
};

export default DisplayBody;
