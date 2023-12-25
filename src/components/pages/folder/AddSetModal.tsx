import type { StudySet } from "@prisma/client";
import { Button, Modal } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "../../../utils/api";
import StudySetCard from "./StudySetCard";

interface AddSetModalProps {
  open: boolean;
  closeModal: () => void;
  folderId: string;
  setsInFolder: StudySet[];
}

const AddSetModal = ({
  open,
  closeModal,
  folderId,
  setsInFolder,
}: AddSetModalProps) => {
  const { query } = useRouter();
  const id = query.id as string;
  const { data: studySets, status } = api.studySet.getUserSets.useQuery({
    id,
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
      {status === "loading" && <div>Loading sets</div>}
      {status === "error" && <div>Couldn&apos;t load sets</div>}
      {status === "success" && (
        <div className="flex flex-col gap-4">
          <Link href="/create-set">
            <Button className="w-full">Create a new set</Button>
          </Link>
          {studySets.map(({ title, id }) => (
            <StudySetCard
              key={id}
              setId={id}
              title={title}
              folderId={folderId}
              setsInFolder={setsInFolder}
            />
          ))}
        </div>
      )}
    </Modal>
  );
};

export default AddSetModal;
