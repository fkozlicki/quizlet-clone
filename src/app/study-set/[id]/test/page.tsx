import TestMode from "@/components/test-mode/TestMode";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import React from "react";

export default async function Test({
  params: { id },
}: {
  params: { id: string };
}) {
  const test = await api.studySet.getTest.query({ id });

  if (!test) {
    notFound();
  }

  return <TestMode test={test} setId={id} />;
}
