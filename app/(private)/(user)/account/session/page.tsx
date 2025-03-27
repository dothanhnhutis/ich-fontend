import React from "react";

const page = () => {
  return (
    <div>
      <div className="min-[300px]:flex-row w-full gap-4 border-b pb-4">
        <h3 className="text-3xl font-bold">Sessions</h3>
        <p className="text-xs font-normal leading-snug text-muted-foreground">
          This is a list of devices that have logged into your account. Revoke
          any sessions that you do not recognize.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full gap-4 py-4 ">
        {sessions.map((session) => (
          <SessionItem
            key={session.id}
            session={session}
            action={deleteSessionByIdAction}
          />
        ))}
      </div>
    </div>
  );
};

export default page;
