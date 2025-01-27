"use client";

import React from "react";

import { Button } from "@acme/ui/button";

import { useSignInDialogContext } from "~/contexts/sign-in-dialog-context";

export default function SignInButton() {
  const { onOpenChange } = useSignInDialogContext();

  return <Button onClick={() => onOpenChange(true)}>Sign In</Button>;
}
