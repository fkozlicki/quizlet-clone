import { zodResolver } from "@hookform/resolvers/zod";
import type { Flashcard } from "@prisma/client";
import { Form, Input, Modal, message } from "antd";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";
import {
  editFlashcardSchema,
  type EditFlashcardValues,
} from "../../../schemas/flashcard";
import { api } from "../../../utils/api";
import { useEffect } from "react";

interface FlashcardModalProps {
  setId: string;
  flashcard?: Flashcard;
  closeModal: () => void;
}

const FlashcardModal = ({
  setId,
  flashcard,
  closeModal,
}: FlashcardModalProps) => {
  const {
    studySet: {
      getById: { setData },
    },
  } = api.useUtils();
  const { mutate: editFlashcard, isLoading } = api.card.edit.useMutation({
    onSuccess: (data) => {
      void message.success("Edited successfully");
      setData({ id: setId }, (oldData) => {
        if (!oldData) {
          return;
        }
        const newCards = oldData.cards.map((card) =>
          card.id === data.id ? data : card
        );
        return {
          ...oldData,
          cards: newCards,
        };
      });
      closeModal();
    },
  });
  const {
    handleSubmit,
    control,
    formState: { isValid },
    reset,
  } = useForm<EditFlashcardValues>({
    resolver: zodResolver(editFlashcardSchema),
    defaultValues: flashcard,
  });

  useEffect(() => {
    reset(flashcard);
  }, [flashcard, reset]);

  const onFinish: SubmitHandler<EditFlashcardValues> = (values) => {
    editFlashcard(values);
  };

  const onCancel = () => {
    reset();
    closeModal();
  };

  return (
    <Modal
      open={!!flashcard}
      onOk={handleSubmit(onFinish)}
      onCancel={onCancel}
      title="Edit flashcard"
      centered
      confirmLoading={isLoading}
      okButtonProps={{
        disabled: !isValid,
      }}
    >
      <Form disabled={isLoading} layout="vertical">
        <FormItem control={control} name="term" label="Term">
          <Input placeholder="Term" />
        </FormItem>
        <FormItem control={control} name="definition" label="Definition">
          <Input placeholder="Definition" />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default FlashcardModal;
