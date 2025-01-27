import type { Metadata } from "next";

import FolderAuthor from "~/components/folder/folder-author";
import FolderCTA from "~/components/folder/folder-cta";
import FolderInfo from "~/components/folder/folder-info";
import FolderStudySets from "~/components/folder/folder-study-sets";
import { api, HydrateClient } from "~/trpc/server";

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
  await api.folder.bySlug.prefetch({ slug });

  await api.user.byId({ id });
  const folder = await api.folder.bySlug({
    slug,
  });

  const defaultValues = {
    ...folder,
    description: folder.description ?? undefined,
  };

  return (
    <HydrateClient>
      <div className="mb-4 flex flex-wrap items-center justify-between">
        <FolderAuthor />
        <FolderCTA userId={id} defaultValues={defaultValues} />
      </div>
      <FolderInfo />
      <h2 className="mb-4 text-2xl font-bold">Study sets</h2>
      <FolderStudySets />
    </HydrateClient>
  );
}
