import React from "react";
import { Metadata } from "next";
import ProfileForm from "./profile-form";

export const metadata: Metadata = {
  title: "Cơ sở",
};

const ProfilePage = () => {
  return <ProfileForm />;
};

export default ProfilePage;
