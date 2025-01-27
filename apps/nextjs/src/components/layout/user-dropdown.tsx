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

const UserDropdown = ({ user }: { user: Session["user"] }) => {
  const { id, image, name, email } = user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar>
          <AvatarImage src={image ?? undefined} alt="" />
          <AvatarFallback>{name?.at(0) ?? "U"}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="max-w-[120px] overflow-hidden text-ellipsis">
          {email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={`/users/${id}`}>
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </Link>
        <Link href="/settings">
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </Link>
        <Link href="/settings#dark-mode">
          <DropdownMenuItem>Dark mode</DropdownMenuItem>
        </Link>
        <form>
          <DropdownMenuItem asChild>
            <button
              className="w-full"
              formAction={async () => {
                "use server";
                await signOut();
              }}
            >
              Sign out
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild></DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
