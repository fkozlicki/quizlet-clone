import Folder from "@/components/folder/Folder";
import { createSSRHelper } from "@/server/helpers/ssgHelper";
import { Hydrate, dehydrate } from "@tanstack/react-query";

export default async function FolderPage({
  params: { slug, id: userId },
}: {
  params: { slug: string; id: string };
}) {
  const helpers = await createSSRHelper();
  await helpers.folder.getByTitle.prefetch({ userId, slug });
  const dehydrateState = dehydrate(helpers.queryClient);

  return (
    <Hydrate state={dehydrateState}>
      <Folder userId={userId} slug={slug} />
    </Hydrate>
  );
}
