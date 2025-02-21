"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RotateCcwIcon, Trash2Icon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { updateFacilityById } from "../../action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type UpdateFacilityData = {
  id: string;
  location_name: string;
  address: string;
  location_type: "Factory" | "Warehouse";
  rooms: {
    type: "new" | "updated" | "init" | "deleted";
    room_id: string;
    room_name: string;
  }[];
};

type UpdateFacilityBody = {
  location_name?: string;
  address?: string;
  location_type?: "Factory" | "Warehouse";
  rooms?: (
    | {
        room_id: string;
        room_name: string;
      }
    | { room_id: string }
    | { room_name: string }
  )[];
};

const UpdateFacilityForm = ({ data }: { data: UpdateFacilityData }) => {
  const router = useRouter();

  const [formData, setFormData] = React.useState<UpdateFacilityData>(data);

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateFacilityBody;
    }) => {
      return await updateFacilityById(id, data);
    },
    onSuccess(data) {
      if (data.success) {
        toast.success(data.message);
        router.push("/admin/facilities");
      } else {
        toast.error(data.message);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const body: UpdateFacilityBody = {};

    if (data.location_name != formData.location_name) {
      body["location_name"] = formData.location_name;
    }

    if (data.address != formData.address) {
      body["address"] = formData.address;
    }

    if (data.location_type != formData.location_type) {
      body["location_type"] = formData.location_type;
    }

    if (formData.rooms.some((room) => room.type != "init")) {
      body.rooms = [];
      for (const room of formData.rooms) {
        if (room.type == "updated") {
          body.rooms.push({
            room_id: room.room_id,
            room_name: room.room_name,
          });
        } else if (room.type == "deleted") {
          body.rooms.push({
            room_id: room.room_id,
          });
        } else if (room.type == "new") {
          body.rooms.push({
            room_name: room.room_name,
          });
        }
      }
    }
    mutate({ id: data.id, data: body });
  };

  const handleUpdateRoom = React.useCallback(
    (currentIdx: number, value: string) => {
      const oldData: UpdateFacilityData["rooms"][number] | undefined =
        data.rooms[currentIdx];
      setFormData((prev) => ({
        ...prev,
        rooms: prev.rooms.map((room, idx) =>
          idx != currentIdx
            ? room
            : oldData
            ? {
                ...room,
                type: oldData.room_name == value ? "init" : "updated",
                room_name: value,
              }
            : {
                ...room,
                room_name: value,
              }
        ),
      }));
    },
    [data.rooms]
  );

  const handleDelete = React.useCallback(
    (
      currentIdx: number,
      currType: UpdateFacilityData["rooms"][number]["type"]
    ) => {
      if (currType == "new") {
        setFormData((prev) => ({
          ...prev,
          rooms: prev.rooms.filter((_, idx) => idx != currentIdx),
        }));
      } else if (currType == "deleted") {
        const oldData = data.rooms[currentIdx];
        setFormData((prev) => ({
          ...prev,
          rooms: prev.rooms.map((room, idx) =>
            idx != currentIdx
              ? room
              : {
                  ...room,
                  type:
                    oldData.room_name == room.room_name ? "init" : "updated",
                }
          ),
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          rooms: prev.rooms.map((room, idx) =>
            idx != currentIdx ? room : { ...room, type: "deleted" }
          ),
        }));
      }
    },
    [data.rooms]
  );

  const handleAdd = () => {
    setFormData((prev) => ({
      ...prev,
      rooms: [
        ...prev.rooms,
        {
          type: "new",
          room_name: "",
          room_id: "",
        },
      ],
    }));
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
        {formData.rooms.length == 0 ? (
          <p className="w-full text-center text-sm text-muted-foreground">
            Chưa có phòng ban nào.{" "}
            <button
              type="button"
              className="font-bold underline cursor-pointer"
              onClick={handleAdd}
            >
              Thêm
            </button>
          </p>
        ) : (
          <div className="grid gap-2">
            {formData.rooms.map(({ type, room_name }, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <Input
                  value={room_name}
                  onChange={(e) => {
                    handleUpdateRoom(idx, e.target.value);
                  }}
                  placeholder="Tên phòng ban"
                  required
                  disabled={type == "deleted"}
                />
                <button
                  type="button"
                  className="text-muted-foreground cursor-pointer"
                  onClick={() => handleDelete(idx, type)}
                >
                  {type == "deleted" ? (
                    <RotateCcwIcon className="w-4 h-4 shrink-0" />
                  ) : (
                    <Trash2Icon className="w-4 h-4 shrink-0" />
                  )}
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAdd}
              className="py-1 hover:bg-accent text-muted-foreground hover:text-accent-foreground rounded-lg cursor-pointer"
            >
              <p className="text-sm">Thêm</p>
            </button>
          </div>
        )}
        <div className="flex gap-2 justify-end items-center">
          <Button variant="ghost" type="button" asChild disabled={isPending}>
            <Link href="/admin/facilities">Trở về</Link>
          </Button>
          <Button type="submit" className="cursor-pointer" disabled={isPending}>
            Lưu
          </Button>
        </div>
      </div>
    </form>
  );
};

export default UpdateFacilityForm;
