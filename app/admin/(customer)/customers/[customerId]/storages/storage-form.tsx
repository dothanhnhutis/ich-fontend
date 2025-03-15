"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { CreateCustomerStorage, createCustomerStorageAction } from "./actions";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
const StorageForm = ({ customerId }: { customerId: string }) => {
  const [formData, setFormData] = React.useState<CreateCustomerStorage>({
    storekeeper: "",
    address: "",
    phoneNumber: "",
  });

  const router = useRouter();

  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      return await createCustomerStorageAction(customerId, formData);
    },
    onSuccess({ success, message }) {
      if (success) {
        router.push(`/admin/customers/${customerId}/storages`);
        setFormData({
          storekeeper: "",
          address: "",
          phoneNumber: "",
        });
        toast.success(message);
      } else {
        toast.error(message);
      }
    },
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-2 pb-5">
        <div className="grid gap-2">
          <Label htmlFor="storekeeper">Tên thủ kho</Label>
          <Input
            type="text"
            name="storekeeper"
            id="storekeeper"
            required
            value={formData.storekeeper}
            onChange={handleOnChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phoneNumber">Số điện thoại</Label>
          <Input
            type="text"
            name="phoneNumber"
            id="phoneNumber"
            required
            value={formData.phoneNumber}
            onChange={handleOnChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="address">Địa chỉ</Label>
          <Input
            type="text"
            name="address"
            id="address"
            required
            value={formData.address}
            onChange={handleOnChange}
          />
        </div>
      </div>
      <Separator />
      <div className="flex gap-2 justify-end items-center py-2">
        <Button variant="ghost" type="button" asChild disabled={isPending}>
          <Link href={`/admin/customers/${customerId}/storages`}>Huỷ</Link>
        </Button>
        <Button disabled={isPending}>Tạo</Button>
      </div>
    </form>
  );
};

export default StorageForm;
