"use client";

import { useState } from "react";
import { LoaderIcon } from "lucide-react";
import { z } from "zod";

import { Button } from "@acme/ui/button";
import { Form, FormField, FormItem, FormMessage, useForm } from "@acme/ui/form";
import { Input } from "@acme/ui/input";
import { Label } from "@acme/ui/label";

import { signInAction } from "./sign-in-action";

const signInSchema = z.object({
  email: z.string().min(1, "Enter your email").email(),
});

type SignInValues = z.infer<typeof signInSchema>;

const SignInWithEmail = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm({
    schema: signInSchema,
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async ({ email }: SignInValues) => {
    setLoading(true);

    await signInAction("resend", {
      redirectTo: "/latest",
      email,
    });

    setLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="example@email.com"
                disabled={loading}
                {...field}
              />
              <FormMessage />
              <Button
                type="submit"
                className="w-full"
                disabled={loading !== false}
              >
                {loading ? (
                  <LoaderIcon size={20} className="animate-spin" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default SignInWithEmail;
