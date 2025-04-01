import React from "react";
import Link from "next/link";
import { Folder } from "lucide-react";

import type { RouterOutputs } from "@acme/api";
import { Badge } from "@acme/ui/badge";
import { Card, CardContent } from "@acme/ui/card";

const FolderCard = ({
  folder,
}: {
  folder: RouterOutputs["folder"]["allByUser"][0];
}) => {
  const { name, studySetsCount, userId, slug } = folder;

  return (
    <Link href={`/users/${userId}/folders/${slug}`}>
      <Card className="transition duration-200 hover:shadow-md">
        <CardContent className="p-6">
          <Badge className="mb-3">{studySetsCount} sets</Badge>
          <div className="flex items-center gap-2">
            <Folder size={24} />
            <span>{name}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default FolderCard;
