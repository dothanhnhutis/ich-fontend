"use client";
import React from "react";

const ImageEditor = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return null;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        drawImage(img);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const drawImage = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    console.log("first");
    ctx.drawImage(img, 0, 0, 500, 500);
    ctx.restore();
  };

  return (
    <div>
      <input type="file" onChange={handleImageUpload} />

      <div className="relative ">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="bg-red-300 relative"
        />
        <div className="absolute inset-0 z-10 overflow-hidden">
          <div
            className="absolute outline-[100vw] outline-gray-500/40 w-[200px] h-[200px] bg-transparent border-2 border-white z-20"
            style={{
              transform: "translate(100px, 100px)",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
