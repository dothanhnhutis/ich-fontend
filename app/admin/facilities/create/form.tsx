"use client";
import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { Trash2Icon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { createFacilityAction, CreateFacilityActionData } from "../action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const CreateFacilityForm = () => {
  const router = useRouter();
  const [formData, setFormData] = React.useState<CreateFacilityActionData>({
    location_name: "",
    address: "",
    location_type: "Factory",
    room_names: [],
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CreateFacilityActionData) => {
      return await createFacilityAction(data);
    },
    onSuccess(data) {
      if (data.success) {
        toast.success(data.message);
        router.push("/admin/facilities");
        setFormData({
          location_name: "",
          address: "",
          location_type: "Factory",
          room_names: [],
        });
      } else {
        toast.error(data.message);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(formData);
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <div>
          <Label htmlFor="location_name">Tên cơ sở</Label>
          <Input
            required
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                location_name: e.target.value,
              }))
            }
            value={formData.location_name}
            name="location_name"
            id="location_name"
          />
        </div>
        <div>
          <Label htmlFor="address">Địa chỉ</Label>
          <Input
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                address: e.target.value,
              }))
            }
            value={formData.address}
            required
            name="address"
            id="address"
          />
        </div>
        <div>
          <Label>Loại cơ sở</Label>
          <Select
            onValueChange={(v) =>
              setFormData((prev) => ({
                ...prev,
                location_type: v == "Factory" ? "Factory" : "Warehouse",
              }))
            }
            value={formData.location_type}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn loại cơ sở" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Loại cơ sở</SelectLabel>
                <SelectItem value="Factory">Nhà máy</SelectItem>
                <SelectItem value="Warehouse">Nhà kho</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator className="my-2" />
      <div className="grid gap-2">
        <p className="text-sm font-semibold">Phòng thuộc cơ sở</p>
        {formData.room_names.length == 0 ? (
          <p className="w-full text-center text-sm text-muted-foreground">
            Chưa có phòng ban nào.{" "}
            <button
              type="button"
              className="font-bold underline cursor-pointer"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  room_names: [""],
                }));
              }}
            >
              Thêm
            </button>
          </p>
        ) : (
          <div className="grid gap-2">
            {formData.room_names.map((room_name, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <Input
                  value={room_name}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      room_names: prev.room_names.map((room_names, index) =>
                        idx == index ? e.target.value : room_names
                      ),
                    }));
                  }}
                  placeholder="Tên phòng ban"
                  required
                />
                <button
                  type="button"
                  className="text-muted-foreground cursor-pointer"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      room_names: prev.room_names.filter(
                        (_, index) => index != idx
                      ),
                    }));
                  }}
                >
                  <Trash2Icon className="w-4 h-4 shrink-0" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  room_names: [...prev.room_names, ""],
                }));
              }}
              className="py-1 hover:bg-accent text-muted-foreground hover:text-accent-foreground rounded-lg cursor-pointer"
            >
              <p className="text-sm">Thêm</p>
            </button>
          </div>
        )}
        <div className="flex gap-2 justify-end items-center">
          <Button variant="ghost" type="button" asChild disabled={isPending}>
            <Link href="/admin/facilities">Huỷ</Link>
          </Button>
          <Button type="submit" disabled={isPending}>
            Tạo
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CreateFacilityForm;
