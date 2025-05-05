"use client";
import React from "react";
import { SignInContext } from "../contexts/signin-context";

export default function useSignIn() {
  const context = React.useContext(SignInContext);
  if (!context) {
    throw new Error("useSignIn must be used within a SignInProvider.");
  }
  return context;
}
