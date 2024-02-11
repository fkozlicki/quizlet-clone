"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Input, Modal, message } from "antd";
import type { Session } from "next-auth";
import { useForm } from "react-hook-form";
import { useFolderModalContext } from "../../contexts/FolderModalContext";
import { FormItem } from "react-hook-form-antd";
import type {
  CreateFolderValues,
  EditFolderValues,
} from "../../schemas/folder";
import { createFolderSchema, editFolderSchema } from "../../schemas/folder";
import { useEffect } from "react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import TextArea from "antd/es/input/TextArea";

interface FolderModalProps {
  session: Session;
}

const FolderModal = ({ session }: FolderModalProps) => {
  const [{ open, defaultData }, dispatch] = useFolderModalContext();
  const router = useRouter();
  const { mutate: createFolder, isLoading: createLoading } =
    api.folder.create.useMutation({
      onSuccess: ({ slug }) => {
        void message.success("Created successfully");
        router.push(`/${session.user.id}/folders/${slug}`);
        onClose();
      },
      onError: () => {
        void message.error("Couldn't create folder");
      },
    });
  const { mutate: editFolder, isLoading: editLoading } =
    api.folder.edit.useMutation({
      onSuccess: () => {
        void message.success("Edited successfully");
        onClose();
      },
      onError: () => {
        void message.error("Couldn't edit folder");
      },
    });
  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<CreateFolderValues | EditFolderValues>({
    defaultValues: defaultData,
    resolver: zodResolver(defaultData ? editFolderSchema : createFolderSchema),
  });

  useEffect(() => {
    if (defaultData) {
      reset(defaultData);
    }
  }, [defaultData, reset]);

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
    reset({});
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
        disabled: !isValid || editLoading || createLoading,
      }}
    >
      <Form
        disabled={editLoading || createLoading}
        layout="vertical"
        requiredMark="optional"
      >
        <FormItem control={control} name="title" label="Title" required>
          <Input placeholder="Title" />
        </FormItem>
        <FormItem control={control} name="description" label="Description">
          <TextArea placeholder="Description" />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default FolderModal;
