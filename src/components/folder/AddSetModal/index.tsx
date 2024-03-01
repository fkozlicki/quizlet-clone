import { api } from "@/trpc/react";
import type { StudySet } from "@prisma/client";
import { Button, Empty, Modal, Skeleton } from "antd";
import Text from "antd/es/typography/Text";
import Link from "next/link";
import FolderStudySet from "../FolderStudySet";

interface AddSetModalProps {
  open: boolean;
  closeModal: () => void;
  folderId: string;
  setsInFolder: StudySet[];
  userId: string;
  slug: string;
}

const AddSetModal = ({
  open,
  closeModal,
  folderId,
  setsInFolder,
  userId,
  slug,
}: AddSetModalProps) => {
  const {
    data: studySets,
    status,
    refetch,
  } = api.studySet.getAll.useQuery({
    userId,
  });

  return (
    <Modal
      open={open}
      onCancel={closeModal}
      title="Add a set"
      centered
      classNames={{
        header: "[&>div]:text-xl mb-6",
        footer: "hidden",
      }}
    >
      {status === "loading" && <Skeleton active title={false} />}
      {status === "error" && (
        <div className="flex flex-col items-center py-4">
          <Text className="mb-2">Couldn&apos;t load sets</Text>
          <Button onClick={() => refetch()}>Try again</Button>
        </div>
      )}
      {status === "success" && (
        <div className="flex flex-col gap-4">
          <Link href="/create-set">
            <Button className="w-full">Create a new set</Button>
          </Link>
          {studySets.map((studySet) => (
            <FolderStudySet
              key={studySet.id}
              studySet={studySet}
              folderId={folderId}
              setsInFolder={setsInFolder}
              userId={userId}
              slug={slug}
            />
          ))}
          {studySets.length === 0 && (
            <Empty description="You have not sets yet">
              <Link href="/create-set">
                <Button type="primary">Create set</Button>
              </Link>
            </Empty>
          )}
        </div>
      )}
    </Modal>
  );
};

export default AddSetModal;
