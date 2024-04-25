"use client";

import React from "react";
import { z } from "zod";

import { signIn } from "@acme/auth/react";
import { Button } from "@acme/ui/button";
import { Form, FormField, FormItem, useForm } from "@acme/ui/form";
import { Input } from "@acme/ui/input";
import { Label } from "@acme/ui/label";

const signInSchema = z.object({
  email: z.string().min(1),
});

type SignInValues = z.infer<typeof signInSchema>;

const SignInForm = () => {
  const form = useForm({
    schema: signInSchema,
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async ({ email }: SignInValues) => {
    await signIn("nodemailer", {
      email,
      redirectTo: "/latest",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <Label
                htmlFor="email"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                {...field}
              />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>
    </Form>
  );
};

export default SignInForm;
