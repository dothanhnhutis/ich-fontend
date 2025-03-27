"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import envs from "@/configs/envs";
import { cn } from "@/lib/utils";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LoaderPinwheelIcon } from "lucide-react";
import { FaFacebook } from "react-icons/fa6";
import { User } from "@/schema/user.schema";

const ConnectBtn = ({
  provider,
  providerId,
}: {
  provider: string;
  providerId?: string;
}) => {
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: async (input: { provider: string; providerId: string }) => {
      // return await disconnectOauth(input);
      return {} as any;
    },
    onSuccess({ success, message }) {
      if (success) {
        toast.success(message);
        queryClient.invalidateQueries({ queryKey: ["me"] });
      } else {
        toast.error(message);
      }
    },
  });

  const handleClick = async () => {
    if (!providerId) {
      window.open(
        `${envs.NEXT_PUBLIC_SERVER_URL}/api/v1/users/connect/${provider}`,
        "asdsadsa",
        "location,status,scrollbars,resizable,width=600, height=800"
      );
    } else {
      mutate({ provider, providerId });
    }
  };

  return (
    <Button
      disabled={isPending}
      onClick={handleClick}
      className="rounded-full"
      variant="outline"
    >
      {isPending && (
        <LoaderPinwheelIcon className="h-4 w-4 animate-spin flex-shrink-0 mr-2" />
      )}
      {providerId ? "Disconnect" : "Connect"}
    </Button>
  );
};

const providerList: {
  id: number;
  label: string;
  provider: string;
  icon: (isConnected: boolean) => JSX.Element;
}[] = [
  {
    id: 1,
    label: "Google",
    provider: "google",
    icon: (isConnected: boolean) => (
      <div
        className={cn(
          "flex items-center gap-2",
          isConnected ? "" : "opacity-50"
        )}
      >
        <div className="p-1 bg-white rounded-full shadow dark:shadow-none">
          <FcGoogle className="size-8" />
        </div>
        <p className="font-medium">Google</p>
      </div>
    ),
  },
  {
    id: 2,
    label: "Facebook",
    provider: "facebook",
    icon: (isConnected: boolean) => (
      <div
        className={cn(
          "flex items-center gap-2",
          isConnected ? "" : "opacity-50"
        )}
      >
        <div className="p-1 bg-white rounded-full shadow dark:shadow-none text-primary">
          <FaFacebook className="size-8" />
        </div>
        <p className="font-medium">Facebook</p>
      </div>
    ),
  },
];

const ProviderList = ({
  oauthProviders,
}: {
  oauthProviders: User["oauthProviders"];
}) => {
  return (
    <div className="w-full space-y-4">
      {providerList.map((p) => (
        <div key={p.id} className="flex gap-4 justify-between">
          {p.icon(oauthProviders.map((o) => o.provider).includes(p.provider))}
          <ConnectBtn
            provider={p.provider}
            providerId={
              oauthProviders.find((o) => o.provider == p.provider)?.providerId
            }
          />
        </div>
      ))}
    </div>
  );
};

export default ProviderList;
