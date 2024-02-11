import FolderPage from "@/components/FolderPage";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

export default async function Folder({
  params: { slug, id: userId },
}: {
  params: { slug: string; id: string };
}) {
  const folder = await api.folder.getByTitle.query({
    userId,
    slug,
  });

  if (!folder) {
    notFound();
  }

  return <FolderPage folder={folder} userId={userId} slug={slug} />;
}
