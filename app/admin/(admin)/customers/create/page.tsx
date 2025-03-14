import React from "react";
import { CreateCustomerProvider } from "./create-customer-provider";
import CreateCustomerForm from "./form2";

const CreateCustomerPage = () => {
  return (
    <div className="h-[calc(100vh_-_48px)] w-full overflow-y-scroll relative">
      <div className="max-w-3xl mx-auto px-2 w-full py-4">
        <div className="bg-white rounded-lg p-2 px-3 shadow-md">
          <h3 className="font-bold lg:text-2xl text-lg">Tạo khách hàng mới</h3>
          <CreateCustomerProvider>
            <CreateCustomerForm />
          </CreateCustomerProvider>
        </div>
      </div>
    </div>
  );
};

export default CreateCustomerPage;
