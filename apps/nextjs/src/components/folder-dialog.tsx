"use client";

import type { ReactNode } from "react";
import type { z } from "zod";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";

import type { EditFolderValues } from "@acme/validators";
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
import { CreateFolderSchema } from "@acme/validators";

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
    schema: CreateFolderSchema,
    defaultValues: defaultValues ?? {
      name: "",
      description: "",
    },
  });
  const { mutate, isPending } = api.folder.create.useMutation({
    async onSuccess(data) {
      form.reset();
      await utils.folder.invalidate();
      onOpenChange && onOpenChange(false);
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
    },
    onError() {
      toast.error("Couldn't create folder, try again");
    },
  });

  function onSubmit(values: z.infer<typeof CreateFolderSchema>) {
    mutate(values);
  }

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
