"use client";
import React from "react";
import UploadImage from "./upload-image";

const ImgUploadPage = () => {
  return (
    <UploadImage
      aspectRatios={["1:1"]}
      onSave={(data) => console.log(data.base64Url)}
    >
      <p>upload</p>
    </UploadImage>
  );
};

export default ImgUploadPage;
