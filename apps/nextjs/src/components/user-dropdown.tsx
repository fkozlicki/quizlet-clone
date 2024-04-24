import Link from "next/link";

import type { Session } from "@acme/auth";
import { signOut } from "@acme/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";

const UserDropdown = ({ session }: { session: Session }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar>
          <AvatarImage src={session.user.image ?? undefined} alt="" />
          <AvatarFallback>{session.user.name?.at(0) ?? "U"}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="max-w-[120px] overflow-hidden text-ellipsis">
          {session.user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={`/users/${session.user.id}`}>
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </Link>
        <Link href="/settings">
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </Link>
        <Link href="/settings#dark-mode">
          <DropdownMenuItem>Dark mode</DropdownMenuItem>
        </Link>
        <form>
          <button
            formAction={async () => {
              "use server";
              await signOut();
            }}
            className="w-full"
          >
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
