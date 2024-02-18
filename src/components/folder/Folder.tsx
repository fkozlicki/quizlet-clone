"use client";

import { api } from "@/trpc/react";
import { type Folder } from "@prisma/client";
import { Button, Empty } from "antd";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";
import { useState } from "react";
import StudySetPreview from "../shared/StudySetPreview";
import AddSetModal from "./AddSetModal";
import FolderAuthor from "./FolderAuthor";
import FolderCTA from "./FolderCTA";
import FolderInfo from "./FolderInfo";

const Folder = ({ userId, slug }: { userId: string; slug: string }) => {
  const { data: folder } = api.folder.getByTitle.useQuery({ userId, slug });
  const [addSetModalOpen, setAddSetModalOpen] = useState<boolean>(false);
  const { data: session } = useSession();

  const openAddSetModal = () => {
    setAddSetModalOpen(true);
  };

  const closeAddSetModal = () => {
    setAddSetModalOpen(false);
  };

  if (!folder) {
    notFound();
  }

  const { studySets, user, title, description, id } = folder;

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <FolderAuthor setsCount={studySets.length} user={user} />
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
              slug={slug}
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
            ),
          )}
        </div>
      ) : (
        <Empty description="This folder has no sets yet">
          {session?.user.id === userId && (
            <Button type="primary" onClick={openAddSetModal}>
              Create now
            </Button>
          )}
        </Empty>
      )}
    </>
  );
};

export default Folder;
