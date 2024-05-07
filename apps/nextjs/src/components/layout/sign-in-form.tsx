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

import GithubIcon from "../icons/github";
import GoogleIcon from "../icons/google";

const signInSchema = z.object({
  email: z.string().min(1, "Enter your email").email(),
});

type SignInValues = z.infer<typeof signInSchema>;

const SignInForm = () => {
  const [loadingGoogle, setLoadingGoogle] = useState<boolean>(false);
  const [loadingGithub, setLoadingGithub] = useState<boolean>(false);
  const [loadingNodemailer, setLoadingNodemailer] = useState<boolean>(false);

  const form = useForm({
    schema: signInSchema,
    defaultValues: {
      email: "",
    },
  });

  const signInWithGoogle = async () => {
    setLoadingGoogle(true);
    await signIn("google", {
      redirectTo: "/latest",
    });
    setLoadingGoogle(false);
  };
  const signInWithGithub = async () => {
    setLoadingGithub(true);
    await signIn("github", {
      redirectTo: "/latest",
    });
    setLoadingGithub(false);
  };

  const signInWithNodemailer = async (email: string) => {
    setLoadingNodemailer(true);
    await signIn("nodemailer", {
      email,
      redirectTo: "/latest",
    });
    setLoadingNodemailer(false);
  };

  const onSubmit = ({ email }: SignInValues) => {
    void signInWithNodemailer(email);
  };

  const isDisabled = loadingGithub || loadingGoogle || loadingNodemailer;

  return (
    <div>
      <div className="flex flex-col gap-4">
        <Button
          className="w-full"
          disabled={isDisabled}
          onClick={signInWithGoogle}
        >
          {loadingGoogle ? (
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
          disabled={isDisabled}
          onClick={signInWithGithub}
        >
          {loadingGithub ? (
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
                  disabled={isDisabled}
                  {...field}
                />
                <FormMessage />
                <Button type="submit" className="w-full" disabled={isDisabled}>
                  {loadingNodemailer ? (
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
