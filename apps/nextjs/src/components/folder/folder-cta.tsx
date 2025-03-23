"use client";

import { Edit } from "lucide-react";

import type { Session } from "@acme/auth";
import { Button } from "@acme/ui/button";

import { api } from "~/trpc/react";
import DeleteFolderDialog from "./delete-folder-dialog";
import FolderDialog from "./folder-dialog";
import FolderStudySetsDialog from "./folder-study-sets-dialog";

interface FolderCTAProps {
  slug: string;
  session: Session | null;
}

const FolderCTA = ({ slug, session }: FolderCTAProps) => {
  const [data] = api.folder.bySlug.useSuspenseQuery({ slug });

  if (data.userId !== session?.user.id) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <FolderStudySetsDialog userId={data.userId} />
      <FolderDialog
        defaultValues={{
          id: data.id,
          name: data.name,
          description: data.description ?? undefined,
        }}
      >
        <Button size="icon" variant="outline">
          <Edit size={16} />
        </Button>
      </FolderDialog>
      <DeleteFolderDialog id={data.id} userId={session.user.id} />
    </div>
  );
};

export default FolderCTA;
