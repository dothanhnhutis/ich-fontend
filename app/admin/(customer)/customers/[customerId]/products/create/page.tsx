import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
const CreateProductPage = () => {
  return (
    <>
      <div className="bg-white flex shrink-0 items-center py-2 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1 size-8 [&_svg]:size-5" />
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              {/* <BreadcrumbItem>
                <BreadcrumbPage className="text-muted-foreground">
                  Khách hàng
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Nguyen Van A</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator /> */}
              <BreadcrumbItem>
                <BreadcrumbPage>Sản phẩm</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Tạo sản phẩm mới</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className="h-[calc(100vh_-_48px)] w-full overflow-y-scroll relative">
        <div className="max-w-3xl mx-auto px-2 w-full py-4">
          <div className="bg-white rounded-lg p-2 px-3 shadow-md">
            <h3 className="font-bold lg:text-2xl text-lg">Tạo sản phẩm mới</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Tạo sản phẩm đã được gia công tại nhà máy
            </p>
            <div className="flex flex-col sm:flex-row gap-2 pb-5">
              <div className="grid gap-2 w-full">
                <Label>Hình sản phẩm</Label>
                <div className="flex items-center flex-wrap gap-1 min-[324px]:grid min-[324px]:grid-cols-4 min-[324px]:w-[268px]">
                  <div className="relative overflow-hidden h-16 w-16 rounded-md min-[324px]:h-[132px] min-[324px]:w-[132px] min-[324px]:col-span-2 min-[324px]:row-span-2">
                    <Image
                      className="object-contain"
                      priority
                      fill
                      src="https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792753/ich/z5974402587004_71c5e83969511daeadd3003bbbfdfce4_hrr11j.jpg"
                      alt="product"
                      sizes="128px"
                    />
                  </div>
                  <div className="relative overflow-hidden h-16 w-16 rounded-md">
                    <Image
                      className="object-contain"
                      priority
                      fill
                      src="https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792753/ich/z5974402587004_71c5e83969511daeadd3003bbbfdfce4_hrr11j.jpg"
                      alt="product"
                      sizes="64px"
                    />
                  </div>
                  <div className="relative overflow-hidden h-16 w-16 rounded-md">
                    <Image
                      className="object-contain"
                      priority
                      fill
                      src="https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792753/ich/z5974402587004_71c5e83969511daeadd3003bbbfdfce4_hrr11j.jpg"
                      alt="product"
                      sizes="64px"
                    />
                  </div>
                  <div className="relative overflow-hidden h-16 w-16 rounded-md">
                    <Image
                      className="object-contain"
                      priority
                      fill
                      src="https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792753/ich/z5974402587004_71c5e83969511daeadd3003bbbfdfce4_hrr11j.jpg"
                      alt="product"
                      sizes="64px"
                    />
                  </div>
                  <div className="relative overflow-hidden h-16 w-16 rounded-md">
                    <Image
                      className="object-contain"
                      priority
                      fill
                      src="https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792753/ich/z5974402587004_71c5e83969511daeadd3003bbbfdfce4_hrr11j.jpg"
                      alt="product"
                      sizes="64px"
                    />
                  </div>
                  <div className="relative overflow-hidden h-16 w-16 rounded-md">
                    <Image
                      className="object-contain"
                      priority
                      fill
                      src="https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792753/ich/z5974402587004_71c5e83969511daeadd3003bbbfdfce4_hrr11j.jpg"
                      alt="product"
                      sizes="64px"
                    />
                  </div>
                  <div className="relative overflow-hidden h-16 w-16 rounded-md">
                    <Image
                      className="object-contain"
                      priority
                      fill
                      src="https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792753/ich/z5974402587004_71c5e83969511daeadd3003bbbfdfce4_hrr11j.jpg"
                      alt="product"
                      sizes="64px"
                    />
                  </div>
                  <div className="relative overflow-hidden h-16 w-16 rounded-md">
                    <Image
                      className="object-contain"
                      priority
                      fill
                      src="https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792753/ich/z5974402587004_71c5e83969511daeadd3003bbbfdfce4_hrr11j.jpg"
                      alt="product"
                      sizes="64px"
                    />
                  </div>
                  <div className="relative overflow-hidden h-16 w-16 rounded-md">
                    <Image
                      className="object-contain"
                      priority
                      fill
                      src="https://res.cloudinary.com/dr1ntj4ar/image/upload/v1733792753/ich/z5974402587004_71c5e83969511daeadd3003bbbfdfce4_hrr11j.jpg"
                      alt="product"
                      sizes="64px"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <div className="grid gap-2">
                  <Label>Tên sản phẩm</Label>
                  <Input type="text" />
                </div>
                <div className="grid gap-2">
                  <Label>Quy cách</Label>
                  <Input type="text" />
                </div>
              </div>
            </div>
            <Separator />
            <div className="flex gap-2 justify-end items-center py-2">
              <Button variant="ghost" type="button" asChild>
                <Link href="/admin/products">Huỷ</Link>
              </Button>
              <Button>Tạo</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateProductPage;
