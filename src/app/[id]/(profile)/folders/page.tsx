import UserFolders from "@/components/folder/UserFolders";
import { createSSRHelper } from "@/server/helpers/ssgHelper";
import { Hydrate, dehydrate } from "@tanstack/react-query";

export default async function ProfileFolders({
  params: { id },
}: {
  params: { id: string };
}) {
  const helpers = await createSSRHelper();
  await helpers.folder.getAll.prefetch({ userId: id });
  const dehydrateState = dehydrate(helpers.queryClient);

  return (
    <Hydrate state={dehydrateState}>
      <UserFolders id={id} />
    </Hydrate>
  );
}
