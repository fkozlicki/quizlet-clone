"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";

import type { CreateFolderValues, EditFolderValues } from "@acme/validators";
import { Button } from "@acme/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@acme/ui/form";
import { Input } from "@acme/ui/input";
import { Textarea } from "@acme/ui/textarea";
import { toast } from "@acme/ui/toast";
import { CreateFolderSchema, EditFolderSchema } from "@acme/validators";

import { api } from "~/trpc/react";

interface FolderDialogProps {
  children?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultValues?: EditFolderValues;
}

const FolderDialog = ({
  children,
  open,
  onOpenChange,
  defaultValues,
}: FolderDialogProps) => {
  const utils = api.useUtils();
  const form = useForm({
    schema: defaultValues ? EditFolderSchema : CreateFolderSchema,
    defaultValues: defaultValues ?? {
      name: "",
      description: "",
    },
  });
  const create = api.folder.create.useMutation({
    async onSuccess(data) {
      await utils.folder.invalidate();
      toast.success(
        <span>
          Successfully created new folder, you can find it{" "}
          <Link
            href={`/users/${data.userId}/folders/${data.slug}`}
            className="underline"
          >
            here
          </Link>
        </span>,
      );
      form.reset();
      if (onOpenChange) {
        onOpenChange(false);
      }
    },
    onError() {
      toast.error("Couldn't create folder, try again");
    },
  });
  const edit = api.folder.edit.useMutation({
    async onSuccess(data) {
      await utils.folder.invalidate();
      toast.success("Successfully edited folder");
      form.reset({
        name: data.name,
        description: data.description ?? undefined,
      });
      if (onOpenChange) {
        onOpenChange(false);
      }
    },
    onError() {
      toast.error("Couldn't edit folder, try again");
    },
  });

  function onSubmit(values: EditFolderValues | CreateFolderValues) {
    if ("id" in values) {
      edit.mutate(values);
    } else {
      create.mutate(values);
    }
  }

  const isPending = create.isPending || edit.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{defaultValues ? "Edit" : "Create"} folder</DialogTitle>
          <DialogDescription>
            Manage your study sets within folder.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Biology"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isPending}
                      placeholder="Biology exam study sets..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isPending}
              type="submit"
              className="ml-auto block"
            >
              {isPending ? (
                <LoaderCircle className="animate-spin" />
              ) : defaultValues ? (
                "Save"
              ) : (
                "Create"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FolderDialog;
