"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Reorder } from "framer-motion";
import { LoaderCircle } from "lucide-react";

import type {
  CreateStudySetValues,
  EditStudySetValues,
} from "@acme/validators";
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
  const { fields, replace, append } = useFieldArray({
    name: "flashcards",
    control: form.control,
  });
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const utils = api.useUtils();
  const create = api.studySet.create.useMutation({
    async onSuccess() {
      form.reset();
      await utils.studySet.invalidate();
      router.push("/latest");
    },
  });
  const edit = api.studySet.edit.useMutation({
    async onSuccess(data) {
      await utils.studySet.invalidate();
      router.push(`/study-sets/${data?.id}`);
    },
  });

  const isPending = create.isPending || edit.isPending;

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
            <Label>Flashcards</Label>
            <Reorder.Group
              axis="y"
              values={fields}
              onReorder={replace}
              className="mt-2 flex flex-col gap-8"
            >
              {fields.map((field, index) => (
                <Reorder.Item key={field.position} value={field}>
                  <Card>
                    <CardHeader className="pb-4">
                      <span>{index + 1}</span>
                    </CardHeader>
                    <CardContent className="flex gap-4">
                      <FormField
                        control={form.control}
                        name={`flashcards.${index}.term`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Term</FormLabel>
                            <FormControl>
                              <Input
                                disabled={isPending}
                                placeholder="2+2"
                                {...field}
                              />
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
                              <Input
                                disabled={isPending}
                                placeholder="4"
                                {...field}
                              />
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
