import { Button, Empty } from "antd";
import type { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useState } from "react";
import StudySetPreview from "../../../components/shared/StudySetPreview";
import AddSetModal from "../../../components/folder/AddSetModal";
import FolderAuthor from "../../../components/folder/FolderAuthor";
import FolderCTA from "../../../components/folder/FolderCTA";
import FolderInfo from "../../../components/folder/FolderInfo";
import { generateSSGHelper } from "../../../server/helpers/ssgHelper";
import { api } from "../../../utils/api";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const ssg = generateSSGHelper();
  const slug = context.query?.slug;
  const userId = context.query?.id;

  if (typeof slug !== "string") {
    throw new Error("No setId");
  }

  if (typeof userId !== "string") {
    throw new Error("No userId");
  }

  await ssg.folder.getByTitle.prefetch({ slug, userId });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      slug,
      userId,
    },
  };
};

const Folder = ({ slug, userId }: { slug: string; userId: string }) => {
  const { data: session } = useSession();
  const [addSetModalOpen, setAddSetModalOpen] = useState<boolean>(false);
  const { data: folder } = api.folder.getByTitle.useQuery({
    userId,
    slug,
  });

  if (!folder) {
    return <div>404</div>;
  }

  const { studySets, user, title, description, id } = folder;

  const openAddSetModal = () => {
    setAddSetModalOpen(true);
  };

  const closeAddSetModal = () => {
    setAddSetModalOpen(false);
  };

  return (
    <>
      <NextSeo title={`Quizlet 2.0 | ${title} Folder`} />
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

export default Folder;
