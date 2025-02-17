"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInAction } from "@/actions/signin";
import { useMutation } from "@tanstack/react-query";

export const SignInServerActionForm = () => {
  const [state, formAction, pending] = React.useActionState<
    {
      message: string | null;
    },
    FormData
  >(signInAction, {
    message: null,
  });

  return (
    <form className="grid gap-2" action={formAction}>
      <Input
        name="email"
        type="email"
        id="email"
        placeholder="abc@example.com"
        disabled={pending}
      />
      <Input
        name="password"
        type="password"
        id="password"
        placeholder="******"
        disabled={pending}
      />
      {state.message && <p>{state.message}</p>}

      <Button disabled={pending}>Sign In</Button>
    </form>
  );
};

type SignInFormData = {
  email: string;
  password: string;
};

export const SignInForm = () => {
  const [formData, setFormData] = React.useState<SignInFormData>({
    email: "",
    password: "",
  });

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const { data, error, mutate, isPending } = useMutation({
    mutationFn: async () => {},
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate();
  };
  return (
    <form className="grid gap-2" onSubmit={handleSubmit}>
      <Input
        name="email"
        type="email"
        id="email"
        onChange={handleOnchange}
        placeholder="abc@example.com"
        disabled={isPending}
      />
      <Input
        name="password"
        type="password"
        id="password"
        placeholder="******"
        disabled={isPending}
        onChange={handleOnchange}
      />

      <Button disabled={isPending}>Sign In</Button>
    </form>
  );
};
