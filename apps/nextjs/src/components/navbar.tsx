import Image from "next/image";
import Link from "next/link";

import { auth } from "@acme/auth";
import { Button } from "@acme/ui/button";

import CreateOptionsDropdown from "./create-options-dropdown";
import MobileMenu from "./mobile-menu";
import SignInSheet from "./sign-in-sheet";
import UserDropdown from "./user-dropdown";

const Navbar = async () => {
  const session = await auth();

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
        <div className="hidden md:block">
          <CreateOptionsDropdown />
        </div>
      </div>
      <div className="flex items-center">
        {!session && <SignInSheet />}
        {session && <UserDropdown session={session} />}
      </div>
    </div>
  );
};

export default Navbar;
