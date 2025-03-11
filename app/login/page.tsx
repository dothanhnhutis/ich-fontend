"use client";
import React from "react";
import { login } from "./actiom";

const LoginPage = () => {
  const [data, setData] = React.useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await login(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={data.email}
        onChange={(e) => {
          setData((prev) => ({
            ...prev,
            email: e.target.value,
          }));
        }}
      />
      <input
        type="text"
        value={data.password}
        onChange={(e) => {
          setData((prev) => ({
            ...prev,
            password: e.target.value,
          }));
        }}
      />
      <button type="submit">login</button>
    </form>
  );
};

export default LoginPage;
