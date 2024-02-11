"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Input, Modal, message } from "antd";
import { useEffect } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";
import { useFlashcardModalContext } from "../../contexts/FlashcardModalContext";
import {
  editFlashcardSchema,
  type EditFlashcardValues,
} from "../../schemas/flashcard";
import { api } from "@/trpc/react";

const FlashcardModal = () => {
  const [{ flashcard }, dispatch] = useFlashcardModalContext();
  const {
    studySet: {
      getById: { setData },
    },
  } = api.useUtils();
  const { mutate: editFlashcard, isLoading } = api.card.edit.useMutation({
    onSuccess: (data) => {
      if (!flashcard) {
        return;
      }
      void message.success("Edited successfully");
      setData({ id: flashcard.studySetId }, (oldData) => {
        if (!oldData) {
          return;
        }
        const newCards = oldData.cards.map((card) =>
          card.id === data.id ? data : card,
        );
        return {
          ...oldData,
          cards: newCards,
        };
      });
      dispatch({ type: "close" });
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
    dispatch({ type: "close" });
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
