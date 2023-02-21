import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import AddSetModal from "../../../components/pages/folder/AddSetModal";
import FolderCTA from "../../../components/pages/folder/FolderCTA";
import FolderAuthor from "../../../components/pages/folder/FolderAuthor";
import { api } from "../../../utils/api";
import FolderInfo from "../../../components/pages/folder/FolderInfo";
import EmptyFolder from "../../../components/pages/folder/EmptyFolder";
import FolderContent from "../../../components/pages/folder/FolderContent";
import { NextSeo } from "next-seo";

const Folder = () => {
  const [addSetModalOpen, setAddSetModalOpen] = useState<boolean>(false);

  const { query } = useRouter();
  const { data: session } = useSession();
  const userId = query.id as string;
  const slug = query.slug as string;
  const {
    data: folder,
    isLoading,
    isError,
    error,
    refetch,
  } = api.folder.getByTitle.useQuery(
    {
      userId,
      slug,
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

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>{error.message}</div>;

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
      <div className="relative bg-slate-100 py-5 sm:py-10">
        <div className="mx-4 max-w-[75rem] sm:mx-6 xl:m-auto">
          <div className="pb-8">
            <div className="mb-4 flex items-center justify-between">
              <FolderAuthor
                setsCount={studySets.length}
                userImage={image}
                userName={name}
              />
              {session && (
                <FolderCTA
                  openAddSetModal={openAddSetModal}
                  folderId={id}
                  defaultData={{ title, description }}
                  refetch={refetch}
                  slug={slug}
                  userId={userId}
                />
              )}
            </div>
            <FolderInfo title={title} description={description} />
          </div>
          <div>
            {studySets.length > 0 ? (
              <FolderContent studySets={studySets} />
            ) : (
              <EmptyFolder openAddSetModal={openAddSetModal} />
            )}
          </div>
          {addSetModalOpen && (
            <AddSetModal
              closeModal={closeAddSetModal}
              folderId={id}
              refetch={refetch}
              setsInFolder={studySets}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Folder;
