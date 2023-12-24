import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Input, Modal } from "antd";
import type { Session } from "next-auth";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useFolderModalContext } from "../../contexts/FolderModalContext";
import { api } from "../../utils/api";
import { FormItem } from "react-hook-form-antd";
import type {
  CreateFolderValues,
  EditFolderValues,
} from "../../schemas/folder";
import { createFolderSchema } from "../../schemas/folder";

interface FolderModalProps {
  session: Session;
}

const FolderModal = ({ session }: FolderModalProps) => {
  const [{ open, defaultData }, dispatch] = useFolderModalContext();
  const { push } = useRouter();
  const { mutate: createFolder, isLoading: createLoading } =
    api.folder.create.useMutation({
      onSuccess: async ({ slug }) => {
        await push(`/${session.user.id}/folders/${slug}`);
        onClose();
      },
    });
  const { mutate: editFolder, isLoading: editLoading } =
    api.folder.edit.useMutation({
      onSuccess: () => {
        onClose();
      },
    });
  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<CreateFolderValues | EditFolderValues>({
    defaultValues: defaultData,
    resolver: zodResolver(createFolderSchema),
  });

  const onFinish = (values: CreateFolderValues | EditFolderValues) => {
    if ("id" in values) {
      editFolder(values);
    } else {
      createFolder(values);
    }
  };

  const onClose = () => {
    dispatch({ type: "setDefaultData", payload: undefined });
    dispatch({ type: "close" });
    reset();
  };

  return (
    <Modal
      title="Create folder"
      centered
      open={open}
      onOk={handleSubmit(onFinish)}
      onCancel={onClose}
      confirmLoading={editLoading || createLoading}
      okButtonProps={{
        disabled: !isValid,
      }}
    >
      <Form layout="vertical" requiredMark="optional">
        <FormItem control={control} name="title" label="Title">
          <Input placeholder="Title" />
        </FormItem>
        <FormItem control={control} name="description" label="Description">
          <Input.TextArea placeholder="Description" />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default FolderModal;
