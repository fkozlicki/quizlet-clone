import { Edit } from "lucide-react";

import type { EditFolderValues } from "@acme/validators";
import { auth } from "@acme/auth";
import { Button } from "@acme/ui/button";

import DeleteFolderDialog from "./delete-folder-dialog";
import FolderDialog from "./folder-dialog";
import FolderStudySetsDialog from "./folder-study-sets-dialog";

interface FolderCTAProps {
  userId: string;
  defaultValues: EditFolderValues;
}

const FolderCTA = async ({ userId, defaultValues }: FolderCTAProps) => {
  const session = await auth();

  return (
    <div className="flex gap-2">
      {userId === session?.user.id && (
        <>
          <FolderStudySetsDialog userId={userId} />
          <FolderDialog defaultValues={defaultValues}>
            <Button size="icon" variant="outline">
              <Edit size={16} />
            </Button>
          </FolderDialog>
          <DeleteFolderDialog id={defaultValues.id} userId={session.user.id} />
        </>
      )}
    </div>
  );
};

export default FolderCTA;
