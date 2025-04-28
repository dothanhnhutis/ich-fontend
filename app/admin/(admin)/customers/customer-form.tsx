import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/commons/dialog";
import { Button } from "@/components/commons/button";
import { PlusIcon } from "lucide-react";
import { createNewCustomerAction, Customer } from "./actions";
import { Label } from "@/components/commons/label";
import { Input } from "@/components/commons/input";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type CustomerFormProps = {
  customer?: Customer;
};
const CustomerForm = ({ customer }: CustomerFormProps) => {
  const [cusName, setCusName] = React.useState<string>(customer?.cusName || "");
  const [open, setOpen] = React.useState<boolean>(false);
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return await createNewCustomerAction(cusName);
    },
    onSuccess({ success, message }) {
      if (success) {
        toast.success(message);
        setCusName("");
        setOpen(false);
      } else {
        toast.error(message);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (isPending) return;
        setOpen(v);
      }}
    >
      {!customer ? (
        <DialogTrigger asChild>
          <Button size="icon" variant="ghost">
            <PlusIcon className="size-4 shrink-0" />
          </Button>
        </DialogTrigger>
      ) : null}

      <DialogContent className="min-[456px]:max-w-[425px]">
        <form onSubmit={handleSubmit} className="grid gap-3">
          <DialogHeader>
            <DialogTitle>Tạo khách hàng mới</DialogTitle>
            <DialogDescription>
              Tạo hồ sơ khách hàng để quản lý sản phẩm mà khách muốn gia công
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 mt-2">
            <Label htmlFor="cusName">Tên khách hàng</Label>
            <Input
              id="cusName"
              value={cusName}
              required
              onChange={(e) => setCusName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              Tạo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerForm;
