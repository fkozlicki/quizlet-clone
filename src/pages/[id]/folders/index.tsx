import { Button, Empty } from "antd";
import type { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import type { ReactElement } from "react";
import FolderPreview from "../../../components/folder/FolderPreview";
import FolderSkeleton from "../../../components/folder/FolderSkeleton";
import ProfileLayout from "../../../components/layout/ProfileLayout";
import { useFolderModalContext } from "../../../contexts/FolderModalContext";
import { generateSSGHelper } from "../../../server/helpers/ssgHelper";
import { api } from "../../../utils/api";
import type { NextPageWithLayout } from "../../_app";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const ssg = generateSSGHelper();
  const userId = context.query?.id;

  if (typeof userId !== "string") {
    throw new Error("No userId");
  }

  await ssg.user.getById.prefetch({ id: userId });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      userId,
    },
  };
};

interface FoldersProps {
  userId: string;
}

const Folders: NextPageWithLayout<FoldersProps> = ({ userId }) => {
  const { data: session } = useSession();
  const {
    data: folders,
    isError,
    isLoading,
    refetch,
  } = api.folder.getAll.useQuery({
    userId,
  });
  const [, dispatch] = useFolderModalContext();

  const openFolderModal = () => {
    dispatch({ type: "open" });
  };

  if (isLoading) {
    return (
      <div className="grid gap-y-4">
        <FolderSkeleton />
        <FolderSkeleton />
        <FolderSkeleton />
        <FolderSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="text-lg">Failed to load data</div>
          <Button onClick={() => refetch()}>Try again</Button>
        </div>
      </div>
    );
  }

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

Folders.getLayout = (page: ReactElement<FoldersProps>) => {
  return <ProfileLayout userId={page.props.userId}>{page}</ProfileLayout>;
};

export default Folders;
