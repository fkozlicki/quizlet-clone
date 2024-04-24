import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";

import type { Session } from "@acme/auth";
import { Button } from "@acme/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@acme/ui/sheet";

const MobileMenu = ({ session }: { session: Session | null }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="md:hidden" size="icon">
          <Menu size={16} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader className="items-center">
          <Image src="/logo.svg" alt="logo" width={110} height={24} />
        </SheetHeader>
        <div className="flex flex-col py-4">
          <Link href={session ? "/latest" : "/"}>
            <Button variant="ghost" className="w-full justify-start">
              Home
            </Button>
          </Link>
          <span className="p-4 text-sm font-medium">Create</span>
          <div className="flex flex-col">
            <Link href="/create-set">
              <Button variant="ghost" className="ml-4 w-full justify-start">
                Study set
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="ml-4 w-full justify-start">
                Folder
              </Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
