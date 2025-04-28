"use client";
import React from "react";
import Link from "next/link";
import { Input } from "@/components/commons/input";
import { Label } from "@/components/commons/label";
import { Separator } from "@/components/commons/separator";
import { Button } from "@/components/commons/button";

import { Trash2Icon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/commons/select";
import { useMutation } from "@tanstack/react-query";
import { createLocationAction, CreateLocationActionData } from "../action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const CreateLocationForm = () => {
  const router = useRouter();
  const [formData, setFormData] = React.useState<CreateLocationActionData>({
    locationName: "",
    address: "",
    locationType: "Factory",
    roomNames: [],
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CreateLocationActionData) => {
      return await createLocationAction(data);
    },
    onSuccess(data) {
      if (data.success) {
        toast.success(data.message);
        router.push("/admin/locations");
        setFormData({
          locationName: "",
          address: "",
          locationType: "Factory",
          roomNames: [],
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
          <Label htmlFor="locationName">Tên cơ sở</Label>
          <Input
            required
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                locationName: e.target.value,
              }))
            }
            value={formData.locationName}
            name="locationName"
            id="locationName"
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
                locationType: v == "Factory" ? "Factory" : "Warehouse",
              }))
            }
            value={formData.locationType}
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
        {formData.roomNames.length == 0 ? (
          <p className="w-full text-center text-sm text-muted-foreground">
            Chưa có phòng ban nào.{" "}
            <button
              type="button"
              className="font-bold underline cursor-pointer"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  roomNames: [""],
                }));
              }}
            >
              Thêm
            </button>
          </p>
        ) : (
          <div className="grid gap-2">
            {formData.roomNames.map((room_name, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <Input
                  value={room_name}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      roomNames: prev.roomNames.map((roomNames, index) =>
                        idx == index ? e.target.value : roomNames
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
                      roomNames: prev.roomNames.filter(
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
                  roomNames: [...prev.roomNames, ""],
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
            <Link href="/admin/locations">Huỷ</Link>
          </Button>
          <Button type="submit" disabled={isPending}>
            Tạo
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CreateLocationForm;
