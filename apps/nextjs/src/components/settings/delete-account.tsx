import { CircleAlert, X } from "lucide-react";

import type { Session } from "@acme/auth";
import { Alert, AlertDescription, AlertTitle } from "@acme/ui/alert";
import { Card, CardContent, CardFooter, CardHeader } from "@acme/ui/card";

import DeleteAccountDialog from "./delete-account-dialog";

const DeleteAccount = ({ user }: { user: Session["user"] }) => {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
      <div className="flex items-center gap-2 lg:basis-48 lg:flex-col lg:justify-center">
        <X size={64} />
        <span className="text-xl font-semibold">Delete Account</span>
      </div>
      <Card className="flex-1">
        <CardHeader>
          <span className="text-xl font-semibold">
            Permanently delete {user.name}
          </span>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <CircleAlert size={16} />
            <AlertTitle>Be careful!</AlertTitle>
            <AlertDescription>
              This will delete all your data and connot be undone
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <DeleteAccountDialog />
        </CardFooter>
      </Card>
    </div>
  );
};

export default DeleteAccount;
