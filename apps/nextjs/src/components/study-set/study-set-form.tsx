"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Reorder } from "framer-motion";
import { LoaderCircle, Trash2Icon } from "lucide-react";

import type {
  CreateStudySetValues,
  EditStudySetValues,
} from "@acme/validators";
import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";
import { Card, CardContent, CardHeader } from "@acme/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFieldArray,
  useForm,
} from "@acme/ui/form";
import { Input } from "@acme/ui/input";
import { Label } from "@acme/ui/label";
import { Textarea } from "@acme/ui/textarea";
import { CreateStudySetSchema, EditStudySetSchema } from "@acme/validators";

import { api } from "~/trpc/react";

const initialFlashcards = Array.from({ length: 4 }, (_, index) => ({
  term: "",
  definition: "",
  position: index,
}));

interface StudySetFormProps {
  defaultValues?: EditStudySetValues;
}

const StudySetForm = ({ defaultValues }: StudySetFormProps) => {
  const form = useForm({
    schema: defaultValues ? EditStudySetSchema : CreateStudySetSchema,
    defaultValues: defaultValues ?? {
      title: "",
      description: "",
      flashcards: initialFlashcards,
    },
  });
  const { fields, append, remove, swap } = useFieldArray({
    name: "flashcards",
    control: form.control,
    keyName: "fieldId",
  });
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const utils = api.useUtils();
  const create = api.studySet.create.useMutation({
    onSuccess() {
      void utils.studySet.invalidate();
      form.reset();
      router.push("/latest");
    },
  });
  const edit = api.studySet.edit.useMutation({
    onSuccess(data) {
      void utils.studySet.invalidate();
      router.push(`/study-sets/${data.id}`);
    },
  });
  const [active, setActive] = useState(0);

  const onSubmit = (values: EditStudySetValues | CreateStudySetValues) => {
    const flashcards = values.flashcards.map((flashcard, index) => ({
      ...flashcard,
      position: index,
    }));

    if ("id" in values) {
      edit.mutate({
        ...values,
        flashcards,
      });
    } else {
      create.mutate({ ...values, flashcards });
    }
  };

  const addEmptyFlashcard = async () => {
    await new Promise<void>((resolve) => {
      append({
        term: "",
        definition: "",
        position: fields.length,
      });
      resolve();
    });
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  const swapCards = (from: number, to: number) => {
    swap(from, to);
  };

  const isPending = create.isPending || edit.isPending;

  return (
    <div ref={ref} className="m-auto max-w-xl py-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="Mathematics"
                    {...field}
                  />
                </FormControl>
                <FormDescription>This is your study set title.</FormDescription>
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
                    placeholder="Addition learning set..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your study set description.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Label
              className={cn({
                "text-destructive": form.formState.errors.flashcards?.root,
              })}
            >
              Flashcards
            </Label>
            {form.formState.errors.flashcards?.root && (
              <p className="text-[0.8rem] font-medium text-destructive">
                {form.formState.errors.flashcards.root.message}
              </p>
            )}
            <Reorder.Group
              axis="y"
              values={fields}
              onReorder={(newOrder) => {
                const activeElement = fields[active];
                newOrder.forEach((item, index) => {
                  if (item === activeElement) {
                    swapCards(active, index);
                    setActive(index);
                  }
                });
              }}
              className="mt-2 flex flex-col gap-8"
            >
              {fields.map((field, index) => (
                <Reorder.Item
                  key={field.fieldId}
                  value={field}
                  onDragStart={() => setActive(index)}
                >
                  <Card>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <span>{index + 1}</span>
                        <Button
                          type="button"
                          onClick={() => remove(index)}
                          size="icon"
                          variant="ghost"
                        >
                          <Trash2Icon size={16} />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="flex gap-4">
                      <FormField
                        control={form.control}
                        name={`flashcards.${index}.term`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Term</FormLabel>
                            <FormControl>
                              <div
                                data-value={field.value}
                                className="grid after:invisible after:whitespace-pre-wrap after:border after:py-2 after:text-sm after:content-[attr(data-value)_'\n'] after:[grid-area:1/1]"
                              >
                                <Textarea
                                  disabled={isPending}
                                  placeholder="2+2"
                                  {...field}
                                  className="min-h-10 resize-none [grid-area:1/1]"
                                  rows={1}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`flashcards.${index}.definition`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Definition</FormLabel>
                            <FormControl>
                              <div
                                data-value={field.value}
                                className="grid after:invisible after:whitespace-pre-wrap after:border after:py-2 after:text-sm after:content-[attr(data-value)_'\n'] after:[grid-area:1/1]"
                              >
                                <Textarea
                                  disabled={isPending}
                                  placeholder="4"
                                  {...field}
                                  className="min-h-10 resize-none [grid-area:1/1]"
                                  rows={1}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </Reorder.Item>
              ))}
            </Reorder.Group>
            <Button
              type="button"
              onClick={addEmptyFlashcard}
              className="mt-8 w-full"
            >
              Add flashcard
            </Button>
          </div>
          <Button disabled={isPending} type="submit">
            {isPending ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : defaultValues ? (
              "Save"
            ) : (
              "Create"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default StudySetForm;
