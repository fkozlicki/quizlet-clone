import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import FolderPreview from "../../../components/FolderPreview";
import ProfileLayout from "../../../components/layout/ProfileLayout";
import { api } from "../../../utils/api";
import type { NextPageWithLayout } from "../../_app";
import FolderSkeleton from "../../../components/FolderSkeleton";
import { Button, Empty } from "antd";
import { useFolderModalContext } from "../../../contexts/FolderModalContext";

const Folders: NextPageWithLayout = () => {
  const { data: session } = useSession();
  const { query } = useRouter();
  const { id: userId } = query as { id?: string };
  const {
    data: folders,
    isError,
    isLoading,
    refetch,
  } = api.folder.getAll.useQuery(
    {
      userId: userId!,
    },
    {
      enabled: !!userId,
    }
  );
  const [, dispatch] = useFolderModalContext();

  const openFolderModal = () => {
    dispatch({ type: "open" });
  };

  if (isLoading || !userId)
    return (
      <div className="grid gap-y-4">
        <FolderSkeleton />
        <FolderSkeleton />
        <FolderSkeleton />
        <FolderSkeleton />
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="text-lg">Failed to load data</div>
          <Button onClick={() => refetch()}>Try again</Button>
        </div>
      </div>
    );

  return (
    <>
      <NextSeo title="Quizlet 2.0 - Folders" />
      {folders.length > 0 ? (
        <div className="grid gap-y-4">
          {folders.map(({ title, slug, studySets }, index) => (
            <FolderPreview
              key={index}
              title={title}
              setsCount={studySets.length}
              href={`/${userId}/folders/${slug}`}
            />
          ))}
        </div>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={`${
            userId === session?.user.id ? "You have" : "User has"
          } no folders yet`}
        >
          {userId === session?.user.id && (
            <Button onClick={openFolderModal} type="primary">
              Create
            </Button>
          )}
        </Empty>
      )}
    </>
  );
};

Folders.getLayout = (page) => {
  return <ProfileLayout>{page}</ProfileLayout>;
};

export default Folders;
