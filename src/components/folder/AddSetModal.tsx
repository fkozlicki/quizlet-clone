import { LoadingOutlined } from "@ant-design/icons";
import type { StudySet } from "@prisma/client";
import { Button, Empty, Modal } from "antd";
import Link from "next/link";
import FolderStudySet from "./FolderStudySet";
import { api } from "@/trpc/react";

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
      {status === "loading" && <LoadingOutlined />}
      {status === "error" && (
        <div>
          <div>Couldn&apos;t load sets</div>
          <Button onClick={() => refetch()}>Try again</Button>
        </div>
      )}
      {status === "success" && (
        <div className="flex flex-col gap-4">
          <Link href="/create-set">
            <Button className="w-full">Create a new set</Button>
          </Link>
          {studySets.map(({ title, id }) => (
            <FolderStudySet
              key={id}
              setId={id}
              title={title}
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
