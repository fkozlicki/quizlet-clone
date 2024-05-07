"use client";

import Image from "next/image";
import Link from "next/link";

import type { Session } from "@acme/auth";
import { Button } from "@acme/ui/button";

import { useSignInDialogContext } from "~/contexts/sign-in-dialog-context";
import CreateOptionsDropdown from "./create-options-dropdown";
import MobileMenu from "./mobile-menu";
import UserDropdown from "./user-dropdown";

const Navbar = ({ session }: { session: Session | null }) => {
  const { onOpenChange } = useSignInDialogContext();

  return (
    <div className="flex min-h-16 items-center justify-between border-b px-4">
      <div className="flex items-center">
        <MobileMenu session={session} />
        <Link
          href="/"
          className="hidden h-full px-2 leading-[4rem] md:flex md:items-center"
        >
          <Image src="/logo.svg" alt="logo" width={110} height={24} />
        </Link>
        <Link
          href={session ? "/latest" : "/"}
          className="mx-2 hidden md:inline"
        >
          <Button variant="link">Home</Button>
        </Link>
        <CreateOptionsDropdown session={session} />
      </div>
      <div className="flex items-center">
        {!session && (
          <Button onClick={() => onOpenChange(true)}>Sign In</Button>
        )}
        {session && <UserDropdown user={session.user} />}
      </div>
    </div>
  );
};

export default Navbar;
