import Image from "next/image";
import Link from "next/link";

import type { Session } from "@acme/auth";
import { Button } from "@acme/ui/button";

import CreateOptionsDropdown from "./create-options-dropdown";
import MobileMenu from "./mobile-menu";
import SignInButton from "./sign-in-button";
import UserDropdown from "./user-dropdown";

const Navbar = ({ session }: { session: Session | null }) => {
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
        {session ? <UserDropdown user={session.user} /> : <SignInButton />}
      </div>
    </div>
  );
};

export default Navbar;
