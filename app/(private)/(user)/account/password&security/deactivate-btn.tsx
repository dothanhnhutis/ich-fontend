"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { LoaderPinwheelIcon } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

const DeactivateBtn = () => {
  const { currentUser } = useAuth();
  const [open, setOpen] = React.useState<boolean>(false);
  const { isPending, mutate } = useMutation({
    mutationFn: async () => {},
    onSettled() {
      // setOpen(false);
    },
  });
  return (
    <AlertDialog
      open={open}
      onOpenChange={(open) => {
        if (!isPending) setOpen(open);
      }}
    >
      <AlertDialogTrigger asChild>
        <Button disabled={false} className="rounded-full" variant="destructive">
          Deactivate
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will deactivate your account. Your account must be
            activated when you sign in again
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={() => {
              mutate();
            }}
            className="bg-destructive hover:bg-destructive/80 text-foreground"
          >
            {isPending && (
              <LoaderPinwheelIcon className="h-4 w-4 animate-spin flex-shrink-0 mr-2" />
            )}
            Deactivate
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeactivateBtn;
