"use client";
import React from "react";
import { z } from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { EllipsisIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/(private)/user-provider";
import { Session } from "@/data/user";
import { useMutation } from "@tanstack/react-query";
import { deleteSessionByIdAction } from "../actions";

const ipSchema = z.string().ip({ version: "v4" });

const SessionItem = ({
  session,
  isCurrentSession,
}: {
  session: Session;
  isCurrentSession: boolean;
}) => {
  const router = useRouter();

  const { isPending, mutate } = useMutation({
    mutationFn: async (sessionId: string) => {
      return await deleteSessionByIdAction(sessionId);
    },
    onSuccess({ success, message }) {
      if (success) {
        toast.success(message);
      } else {
        toast.error(message);
      }
      router.refresh();
    },
  });

  return (
    <div
      key={session.id}
      className={cn(
        "flex flex-col min-[400px]:flex-row gap-2 border-b p-2 relative",
        isPending ? "animate-pulse" : ""
      )}
    >
      <div className="text-sm w-full relative">
        <p>
          {`Địa chỉ mạng: ${
            ipSchema.safeParse(session.ip).success ? session.ip : "unknown"
          }`}
        </p>
        <p>{`Thiết bị: ${session.userAgent.browser["name"] || "unknown"} on ${
          session.userAgent.device["model"] ||
          session.userAgent.device["type"] ||
          "unknown"
        }`}</p>

        <p>
          {`Lần truy cập cuối: ${format(session.lastAccess, "dd/MM/yy HH:mm")}`}
        </p>
        <p>{`Đã đăng nhập: ${format(session.createAt, "dd/MM/yy HH:mm")}`}</p>

        <button type="button">
          <EllipsisIcon className="shrink-0 size-6" />
        </button>
      </div>
      {isCurrentSession ? (
        <div className="flex items-center justify-center text-sm text-center text-nowrap align-middle h-10">
          <p>Current Session</p>
        </div>
      ) : (
        <Button
          onClick={() => mutate(session.id)}
          disabled={isPending}
          variant="ghost"
          className="hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
        >
          Revoke
        </Button>
      )}
    </div>
  );
};

const Sessions = ({ sessions }: { sessions: Session[] }) => {
  const { state } = useUser();

  return (
    <div className="grid w-full gap-4 py-4">
      {sessions.length == 0 ? (
        <div
          className={cn(
            "flex flex-col min-[400px]:flex-row sm:grid gap-2 border-b sm:border p-2 sm:rounded-2xl relative"
          )}
        ></div>
      ) : (
        sessions.map((session) => (
          <SessionItem
            key={session.id}
            session={session}
            isCurrentSession={session.id == state?.session.id}
          />
        ))
      )}
    </div>
  );
};

export default Sessions;
