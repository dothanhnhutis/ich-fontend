"use client";
import React from "react";
import { Input } from "@/components/commons/input";
import { Label } from "@/components/commons/label";
import { Separator } from "@/components/commons/separator";
import { RotateCcwIcon, Trash2Icon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/commons/select";
import { Button } from "@/components/commons/button";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { updateLocationByIdAction, UpdateLocationData } from "../../action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Location } from "../../action";
type UpdateLocationProps = {
  data: Location & {
    rooms: {
      type: "new" | "updated" | "init" | "deleted";
      roomId: string;
      roomName: string;
    }[];
  };
};

const UpdateLocationForm = ({ data }: UpdateLocationProps) => {
  const router = useRouter();

  const [formData, setFormData] =
    React.useState<UpdateLocationProps["data"]>(data);

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateLocationData;
    }) => {
      return await updateLocationByIdAction(id, data);
    },
    onSuccess(data) {
      if (data.success) {
        toast.success(data.message);
        router.push("/admin/locations");
      } else {
        toast.error(data.message);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const body: UpdateLocationData = {};

    if (data.locationName != formData.locationName) {
      body["locationName"] = formData.locationName;
    }

    if (data.address != formData.address) {
      body["address"] = formData.address;
    }

    if (data.locationType != formData.locationType) {
      body["locationType"] = formData.locationType;
    }

    if (formData.rooms.some((room) => room.type != "init")) {
      body.rooms = [];
      for (const room of formData.rooms) {
        if (room.type == "updated") {
          body.rooms.push({
            roomId: room.roomId,
            roomName: room.roomName,
          });
        } else if (room.type == "deleted") {
          body.rooms.push({
            roomId: room.roomId,
          });
        } else if (room.type == "new") {
          body.rooms.push({
            roomName: room.roomName,
          });
        }
      }
    }
    mutate({ id: data.id, data: body });
  };

  const handleUpdateRoom = React.useCallback(
    (currentIdx: number, value: string) => {
      const oldData: UpdateLocationProps["data"]["rooms"][number] | undefined =
        data.rooms[currentIdx];
      setFormData((prev) => ({
        ...prev,
        rooms: prev.rooms.map((room, idx) =>
          idx != currentIdx
            ? room
            : oldData
            ? {
                ...room,
                type: oldData.roomName == value ? "init" : "updated",
                roomName: value,
              }
            : {
                ...room,
                roomName: value,
              }
        ),
      }));
    },
    [data.rooms]
  );

  const handleDelete = React.useCallback(
    (
      currentIdx: number,
      currType: UpdateLocationProps["data"]["rooms"][number]["type"]
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
                  type: oldData.roomName == room.roomName ? "init" : "updated",
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
          roomName: "",
          roomId: "",
        },
      ],
    }));
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
            {formData.rooms.map(({ type, roomName }, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <Input
                  value={roomName}
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
            <Link href="/admin/locations">Trở về</Link>
          </Button>
          <Button type="submit" className="cursor-pointer" disabled={isPending}>
            Lưu
          </Button>
        </div>
      </div>
    </form>
  );
};

export default UpdateLocationForm;
