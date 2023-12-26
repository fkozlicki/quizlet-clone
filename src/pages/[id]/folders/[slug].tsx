import { Button, Skeleton } from "antd";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useState } from "react";
import StudySetPreview from "../../../components/StudySetPreview";
import StudySetSkeleton from "../../../components/StudySetSkeleton";
import AddSetModal from "../../../components/pages/folder/AddSetModal";
import EmptyFolder from "../../../components/pages/folder/EmptyFolder";
import FolderAuthor from "../../../components/pages/folder/FolderAuthor";
import FolderCTA from "../../../components/pages/folder/FolderCTA";
import FolderInfo from "../../../components/pages/folder/FolderInfo";
import { api } from "../../../utils/api";

const Folder = () => {
  const { query } = useRouter();
  const { data: session } = useSession();
  const [addSetModalOpen, setAddSetModalOpen] = useState<boolean>(false);
  const { id: userId, slug } = query as { id?: string; slug?: string };
  const {
    data: folder,
    isLoading,
    isError,
    refetch,
  } = api.folder.getByTitle.useQuery(
    {
      userId: userId!,
      slug: slug!,
    },
    {
      enabled: !!userId && !!slug,
    }
  );

  const openAddSetModal = () => {
    setAddSetModalOpen(true);
  };

  const closeAddSetModal = () => {
    setAddSetModalOpen(false);
  };

  if (isLoading || !userId) {
    return (
      <div>
        <div className="flex items-center justify-between">
          <Skeleton.Input className="h-4 w-full max-w-xs" active />
          <div className="flex gap-2">
            <Skeleton.Avatar size="large" active />
            <Skeleton.Avatar size="large" active />
          </div>
        </div>
        <Skeleton.Input className="mb-10 mt-2 h-12 w-full max-w-sm" active />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <StudySetSkeleton />
          <StudySetSkeleton />
          <StudySetSkeleton />
          <StudySetSkeleton />
        </div>
      </div>
    );
  }

  if (isError)
    return (
      <div className="flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="text-lg">Failed to load data</div>
          <Button onClick={() => refetch()}>Try again</Button>
        </div>
      </div>
    );

  const {
    studySets,
    user: { image, name },
    title,
    description,
    id,
  } = folder;

  return (
    <>
      <NextSeo title={`Quizlet 2.0 | ${title} Folder`} />
      <div className="mb-4 flex items-center justify-between">
        <FolderAuthor
          setsCount={studySets.length}
          userImage={image}
          userName={name}
        />
        {session && userId === session.user.id && (
          <>
            <FolderCTA
              userId={userId}
              openAddSetModal={openAddSetModal}
              defaultData={folder}
            />
            <AddSetModal
              folderId={id}
              userId={userId}
              setsInFolder={studySets}
              closeModal={closeAddSetModal}
              open={addSetModalOpen}
            />
          </>
        )}
      </div>
      <FolderInfo title={title} description={description} />
      {studySets.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {studySets.map(
            ({ title, id, cards, user: { image, name }, userId }, index) => (
              <StudySetPreview
                key={index}
                title={title}
                id={id}
                termsCount={cards.length}
                authorImage={image}
                authorName={name}
                authorId={userId}
              />
            )
          )}
        </div>
      ) : (
        <EmptyFolder openAddSetModal={openAddSetModal} ownerId={userId} />
      )}
    </>
  );
};

export default Folder;
