import FoldersEmpty from "@/components/FoldersEmpty";
import FolderPreview from "@/components/folder/FolderPreview";
import { api } from "@/trpc/server";

export default async function ProfileFolders({
  params: { id },
}: {
  params: { id: string };
}) {
  const folders = await api.folder.getAll.query({
    userId: id,
  });

  return (
    <>
      {folders.length > 0 ? (
        <div className="grid gap-y-4">
          {folders.map(({ title, slug, studySets }, index) => (
            <FolderPreview
              key={index}
              title={title}
              setsCount={studySets.length}
              href={`/${id}/folders/${slug}`}
            />
          ))}
        </div>
      ) : (
        <FoldersEmpty userId={id} />
      )}
    </>
  );
}
