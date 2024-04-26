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
  params: { slug: string; id: string };
}

export async function generateMetadata({
  params: { slug },
}: FolderProps): Promise<Metadata> {
  try {
    const { name } = await api.folder.bySlug({ slug });

    return {
      title: name,
    };
  } catch {
    return {};
  }
}

export default async function Folder({ params: { slug, id } }: FolderProps) {
  const helper = createServerSideHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: SuperJSON,
  });
  await helper.folder.bySlug.prefetch({ slug });
  const state = dehydrate(helper.queryClient);

  try {
    await api.user.byId({ id });
    const folder = await api.folder.bySlug({
      slug,
    });

    const defaultValues = {
      ...folder,
      description: folder.description ?? undefined,
    };

    return (
      <HydrationBoundary state={state}>
        <div className="mb-4 flex items-center justify-between">
          <FolderAuthor />
          <FolderCTA userId={id} defaultValues={defaultValues} />
        </div>
        <FolderInfo />
        <h2 className="mb-4 text-2xl font-bold">Study sets</h2>
        <FolderStudySets />
      </HydrationBoundary>
    );
  } catch {
    notFound();
  }
}
