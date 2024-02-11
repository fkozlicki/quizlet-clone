"use client";

import AuthDropdownProvider from "@/contexts/AuthDropdownContext";
import FlashcardModalProvider from "@/contexts/FlashcardModalContext";
import FolderModalProvider from "@/contexts/FolderModalContext";
import ThemeProvider from "@/contexts/ThemeProvider";
import { SessionProvider } from "next-auth/react";
import React, { type ReactNode } from "react";
import Layout from "./layout/Layout";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <SessionProvider>
      <ThemeProvider>
        <AuthDropdownProvider>
          <FolderModalProvider>
            <FlashcardModalProvider>
              <Layout>{children}</Layout>
            </FlashcardModalProvider>
          </FolderModalProvider>
        </AuthDropdownProvider>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default Providers;
