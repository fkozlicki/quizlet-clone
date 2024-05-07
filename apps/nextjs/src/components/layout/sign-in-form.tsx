"use client";

import { useState } from "react";
import { LoaderIcon } from "lucide-react";
import { z } from "zod";

import { signIn } from "@acme/auth/react";
import { Button } from "@acme/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@acme/ui/form";
import { Input } from "@acme/ui/input";
import { toast } from "@acme/ui/toast";

import GithubIcon from "../icons/github";
import GoogleIcon from "../icons/google";

const signInSchema = z.object({
  email: z.string().min(1, "Enter your email").email(),
});

type SignInValues = z.infer<typeof signInSchema>;

type Provider = "google" | "github" | "nodemailer";

const SignInForm = () => {
  const [loading, setLoading] = useState<Provider | false>(false);

  const form = useForm({
    schema: signInSchema,
    defaultValues: {
      email: "",
    },
  });

  const handleSignIn = async (provider: Provider, email?: string) => {
    setLoading(provider);
    const res = await signIn(provider, {
      redirectTo: "/latest",
      email,
    });

    if (res) {
      toast.success(`Successfully signed in with ${provider}`);
    }

    setLoading(false);
  };

  const onSubmit = ({ email }: SignInValues) => {
    void handleSignIn("nodemailer", email);
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        <Button
          className="w-full"
          disabled={loading !== false}
          onClick={() => handleSignIn("google")}
        >
          {loading === "google" ? (
            <LoaderIcon size={20} className="animate-spin" />
          ) : (
            <>
              <GoogleIcon className="mr-2 h-4 w-4" />
              Sign In with Google
            </>
          )}
        </Button>
        <Button
          className="w-full"
          disabled={loading !== false}
          onClick={() => handleSignIn("github")}
        >
          {loading === "github" ? (
            <LoaderIcon size={20} className="animate-spin" />
          ) : (
            <>
              <GithubIcon className="mr-2 h-4 w-4" />
              Sign In with Github
            </>
          )}
        </Button>
      </div>
      <div className="my-4 flex items-center gap-4">
        <div className="h-px flex-1 bg-border"></div>
        <span className="text-sm text-muted-foreground">OR</span>
        <div className="h-px flex-1 bg-border"></div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor="email"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Email
                </FormLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  disabled={loading !== false}
                  {...field}
                />
                <FormMessage />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading !== false}
                >
                  {loading === "nodemailer" ? (
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
    </div>
  );
};

export default SignInForm;
