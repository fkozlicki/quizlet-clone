import type { Meta, StoryObj } from "@storybook/react";

import { useForm } from "react-hook-form";
import WrittenAnswer from ".";
import { TestInputs } from "../TestForm";

const meta: Meta<typeof WrittenAnswer> = {
  component: WrittenAnswer,
};

export default meta;
type Story = StoryObj<typeof WrittenAnswer>;

export const Default: Story = {
  render: () => {
    const { control } = useForm<TestInputs>();

    return (
      <WrittenAnswer
        term="2+2"
        definition="4"
        control={control}
        name="written.0.userAnswer"
      />
    );
  },
};

export const Correct: Story = {
  render: () => (
    <WrittenAnswer term="2+2" definition="4" userAnswer="4" result />
  ),
};

export const Wrong: Story = {
  render: () => (
    <WrittenAnswer term="2+2" definition="4" userAnswer="12" result />
  ),
};
