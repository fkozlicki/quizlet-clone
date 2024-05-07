"use client";

import type { PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";

interface SignInDialogState {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialState: SignInDialogState = {
  open: false,
  onOpenChange: () => undefined,
};

const SignInDialogContext = createContext<SignInDialogState>(initialState);

const SignInDialogProvider = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = useState<SignInDialogState["open"]>(
    initialState.open,
  );

  return (
    <SignInDialogContext.Provider value={{ open, onOpenChange: setOpen }}>
      {children}
    </SignInDialogContext.Provider>
  );
};

export default SignInDialogProvider;

export const useSignInDialogContext = (): SignInDialogState =>
  useContext(SignInDialogContext);
