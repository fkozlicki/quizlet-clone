"use client";

import type { PropsWithChildren } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@acme/ui/dialog";

import { useSignInDialogContext } from "~/contexts/sign-in-dialog-context";
import SignInWithEmail from "./sign-in-with-email";

const SignInDialog = ({ children }: PropsWithChildren) => {
  const { open, onOpenChange } = useSignInDialogContext();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
          <DialogDescription>
            Sign in to create your own study sets and folders. You can always
            remove your account.
          </DialogDescription>
        </DialogHeader>
        <div>
          {children}
          <div className="my-4 flex items-center gap-4">
            <div className="h-px flex-1 bg-border"></div>
            <span className="text-sm text-muted-foreground">OR</span>
            <div className="h-px flex-1 bg-border"></div>
          </div>
          <SignInWithEmail />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignInDialog;
