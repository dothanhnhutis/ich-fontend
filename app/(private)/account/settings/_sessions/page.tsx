import React from "react";
import { Metadata } from "next";

import Sessions from "./sessions";
import { getSessionsAction } from "@/libs/actions/UserActions";

export const metadata: Metadata = {
  title: "Phiên đăng nhập",
};

const SessionsPage = async () => {
  const sessions = await getSessionsAction();

  return (
    <div className="w-full">
      <p className="text-sm font-normal leading-snug text-muted-foreground border-b pb-4">
        Đây là danh sách các thiết bị đã đăng nhập vào tài khoản của bạn. Thu
        hồi bất kỳ phiên nào mà bạn không nhận ra.
      </p>
      {sessions.length == 0 ? (
        <p>No result.</p>
      ) : (
        <Sessions sessions={sessions} />
      )}
    </div>
  );
};

export default SessionsPage;
