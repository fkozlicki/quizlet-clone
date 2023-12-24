import { zodResolver } from "@hookform/resolvers/zod";
import type { Flashcard } from "@prisma/client";
import { Form, Input, Modal } from "antd";
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
  flashcard?: Flashcard;
  closeModal: () => void;
}

const FlashcardModal = ({ flashcard, closeModal }: FlashcardModalProps) => {
  const { mutate: editFlashcard, isLoading } = api.card.edit.useMutation();
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

  return (
    <Modal
      open={!!flashcard}
      onOk={handleSubmit(onFinish)}
      onCancel={() => {
        reset();
        closeModal();
      }}
      title="Edit flashcard"
      centered
      confirmLoading={isLoading}
      okButtonProps={{
        disabled: !isValid,
      }}
    >
      <Form layout="vertical">
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
