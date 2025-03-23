"use client";

import type { MouseEvent } from "react";
import type { z } from "zod";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Edit, Loader2Icon } from "lucide-react";

import type { RouterOutputs } from "@acme/api";
import { Button } from "@acme/ui/button";
import {
  Dialog,
  DialogClose,
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
import { toast } from "@acme/ui/toast";
import { EditFlashcardSchema } from "@acme/validators";

import { api } from "~/trpc/react";

interface EditFlashcardDialogProps {
  flashcard: RouterOutputs["studySet"]["byId"]["flashcards"][number];
}

const EditFlashcardDialog = ({ flashcard }: EditFlashcardDialogProps) => {
  const { id }: { id: string } = useParams();
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm({
    schema: EditFlashcardSchema,
    defaultValues: flashcard,
  });
  const utils = api.useUtils();
  const { mutate, isPending } = api.flashcard.edit.useMutation({
    onSuccess() {
      toast.success("Saved flashcard");
      setOpen(false);
      void utils.studySet.byId.invalidate({ id });
    },
    onError({ message }) {
      toast.error(message);
    },
  });

  useEffect(() => {
    form.reset(flashcard);
  }, [flashcard]);

  const handleStopPropagation = (
    event: MouseEvent<HTMLElement, globalThis.MouseEvent>,
  ) => {
    event.stopPropagation();
  };

  function onSubmit(values: z.infer<typeof EditFlashcardSchema>) {
    mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={handleStopPropagation}
          className="rounded-full"
          variant="ghost"
          size="icon"
        >
          <Edit size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="term"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Term</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder="2+2" {...field} />
                  </FormControl>
                  <FormDescription>Head of your flashcard.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="definition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Definition</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder="4" {...field} />
                  </FormControl>
                  <FormDescription>Tail of your flashcard.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              <Button disabled={isPending} type="submit">
                {isPending ? (
                  <Loader2Icon className="size-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditFlashcardDialog;
