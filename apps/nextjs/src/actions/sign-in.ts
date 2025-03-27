"use server";

import { signIn } from "@acme/auth";

export const signInAction = (email: string) =>
  signIn("resend", {
    redirectTo: "/latest",
    email,
  });
