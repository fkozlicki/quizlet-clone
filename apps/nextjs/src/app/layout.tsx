import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { cn } from "@acme/ui";
import { ThemeProvider } from "@acme/ui/theme";
import { Toaster } from "@acme/ui/toast";

import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";

import { auth } from "@acme/auth";

import CreateActivity from "~/components/create-activity";
import Navbar from "~/components/navbar";
import FolderDialogProvider from "~/contexts/folder-dialog-context";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_ENV === "production"
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
        <FolderDialogProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TRPCReactProvider>
              <Navbar />
              <main className="container min-h-[calc(100vh-65px)] py-8">
                {props.children}
              </main>
              <Toaster />
              {session && <CreateActivity />}
            </TRPCReactProvider>
          </ThemeProvider>
        </FolderDialogProvider>
      </body>
    </html>
  );
}
