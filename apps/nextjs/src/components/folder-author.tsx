"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
import { Button } from "@acme/ui/button";

import { api } from "~/trpc/react";

const FolderAuthor = () => {
  const { slug }: { slug: string } = useParams();
  const { data } = api.folder.bySlug.useQuery({ slug });

  if (!data) {
    return null;
  }

  const { studySets, user } = data;

  return (
    <div className="flex items-center gap-6">
      <span className="text-sm">{studySets.length} sets</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold">created by</span>
        <Link href={`/users/${user.id}`} className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={user.image ?? undefined} alt="user avatar" />
            <AvatarFallback>
              <User size={16} />
            </AvatarFallback>
          </Avatar>
          <Button className="p-0" variant="link">
            {user.name}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default FolderAuthor;
