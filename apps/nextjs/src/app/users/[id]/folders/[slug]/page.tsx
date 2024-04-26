import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createServerSideHelpers } from "@trpc/react-query/server";
import SuperJSON from "superjson";

import { appRouter } from "@acme/api";

import FolderAuthor from "~/components/folder/folder-author";
import FolderCTA from "~/components/folder/folder-cta";
import FolderInfo from "~/components/folder/folder-info";
import FolderStudySets from "~/components/folder/folder-study-sets";
import { api, createContext } from "~/trpc/server";

interface FolderProps {
  params: { slug: string };
}

export async function generateMetadata({
  params: { slug },
}: FolderProps): Promise<Metadata> {
  const folder = await api.folder.bySlug({ slug });

  if (!folder) {
    return {};
  }

  return {
    title: folder.name,
  };
}

export default async function Folder({ params: { slug } }: FolderProps) {
  const helper = createServerSideHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: SuperJSON,
  });
  await helper.folder.bySlug.prefetch({ slug });
  const state = dehydrate(helper.queryClient);
  const folder = await api.folder.bySlug({
    slug,
  });

  if (!folder) {
    notFound();
  }

  const { user, name, description, id } = folder;

  const defaultValues = { id, name, description: description ?? undefined };

  return (
    <HydrationBoundary state={state}>
      <div className="mb-4 flex items-center justify-between">
        <FolderAuthor />
        <FolderCTA userId={user.id} defaultValues={defaultValues} />
      </div>
      <FolderInfo />
      <h2 className="mb-4 text-2xl font-bold">Study sets</h2>
      <FolderStudySets />
    </HydrationBoundary>
  );
}
