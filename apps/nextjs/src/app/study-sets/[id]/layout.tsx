import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { api } from "~/trpc/server";

export default async function layout({
  params: { id },
  children,
}: {
  params: { id: string };
  children: ReactNode;
}) {
  try {
    await api.studySet.byId({ id });
    return children;
  } catch {
    notFound();
  }
}
