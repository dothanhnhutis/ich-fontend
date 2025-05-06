import React from "react";
import { Metadata } from "next";
import ProfileForm from "./ProfileForm";

export const metadata: Metadata = {
  title: "Hồ sơ",
};

const ProfilePage = () => {
  return <ProfileForm />;
};

export default ProfilePage;
