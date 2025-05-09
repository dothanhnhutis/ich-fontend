import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: {
    default: "Nhà Máy Sản Xuất Gia Công Mỹ Phẩm I.C.H",
    template: "%s | Nhà Máy Sản Xuất Gia Công Mỹ Phẩm I.C.H",
  },
  description:
    "Công ty TNHH MTV Sản Xuất I.C.H chuyên cung cấp các dịch vụ gia công, sản xuất mỹ phẩm và phát triển sản phẩm theo trend trên thị trường.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
