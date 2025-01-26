import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { cn } from "@acme/ui";
import { ThemeProvider } from "@acme/ui/theme";
import { Toaster } from "@acme/ui/toast";

import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";

import { auth } from "@acme/auth";

import CreateActivity from "~/components/layout/create-activity";
import CreateFolderDialog from "~/components/layout/create-folder-dialog";
import Navbar from "~/components/layout/navbar";
import SignInDialog from "~/components/layout/sign-in-dialog";
import FolderDialogProvider from "~/contexts/folder-dialog-context";
import SignInDialogProvider from "~/contexts/sign-in-dialog-context";
import { env } from "~/env";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.NODE_ENV === "production"
      ? "https://turbo.t3.gg"
      : "http://localhost:3000",
  ),
  title: "Quizlet Clone",
  description: "Quizlet clone application built with turbo.t3.gg",
  openGraph: {
    title: "Quizlet Clone",
    description: "Quizlet clone application built with turbo.t3.gg",
    url: "https://create-t3-turbo.vercel.app",
    siteName: "Quizlet Clone",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <SignInDialogProvider>
          <FolderDialogProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <TRPCReactProvider>
                <Navbar session={session} />
                <main className="container min-h-[calc(100vh-65px)] py-8">
                  {props.children}
                </main>
                <Toaster />
                {session && (
                  <>
                    <CreateActivity />
                    <CreateFolderDialog />
                  </>
                )}
                {!session && <SignInDialog />}
              </TRPCReactProvider>
            </ThemeProvider>
          </FolderDialogProvider>
        </SignInDialogProvider>
      </body>
    </html>
  );
}
