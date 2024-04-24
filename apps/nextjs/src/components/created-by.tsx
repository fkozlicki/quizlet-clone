import React from "react";
import Link from "next/link";

import type { RouterOutputs } from "@acme/api";
import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";

const CreatedBy = ({
  user,
}: {
  user: RouterOutputs["studySet"]["byId"]["user"];
}) => {
  const { id, image, name } = user;

  return (
    <Link href={`/users/${id}`} className="flex items-center gap-4">
      <Avatar>
        <AvatarImage src={image ?? undefined} alt="" />
        <AvatarFallback>{name?.at(0)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-xs font-semibold">Created by</span>
        <span className="text-sm font-medium">{name}</span>
      </div>
    </Link>
  );
};

export default CreatedBy;
