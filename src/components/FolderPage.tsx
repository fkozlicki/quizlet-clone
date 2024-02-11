"use client";

import {
  type Flashcard,
  type Folder,
  type StudySet,
  type User,
} from "@prisma/client";
import React, { useState } from "react";
import FolderAuthor from "./folder/FolderAuthor";
import { useSession } from "next-auth/react";
import FolderCTA from "./folder/FolderCTA";
import AddSetModal from "./folder/AddSetModal";
import FolderInfo from "./folder/FolderInfo";
import StudySetPreview from "./shared/StudySetPreview";
import { Button, Empty } from "antd";

type FolderData = Folder & {
  studySets: (StudySet & { cards: Flashcard[]; user: User })[];
  user: User;
};

const FolderPage = ({
  folder,
  userId,
  slug,
}: {
  folder: FolderData;
  userId: string;
  slug: string;
}) => {
  const [addSetModalOpen, setAddSetModalOpen] = useState<boolean>(false);
  const { data: session } = useSession();

  const openAddSetModal = () => {
    setAddSetModalOpen(true);
  };

  const closeAddSetModal = () => {
    setAddSetModalOpen(false);
  };

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
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="This folder has no sets yet"
        >
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

export default FolderPage;
