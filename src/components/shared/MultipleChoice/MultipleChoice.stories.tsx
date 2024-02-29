import { type Meta, type StoryObj } from "@storybook/react";
import MultipleChoice from ".";

const meta: Meta<typeof MultipleChoice> = {
  component: MultipleChoice,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof MultipleChoice>;

export const Default: Story = {
  render: () => (
    <MultipleChoice answers={["1", "2", "3", "4"]} index={1} term="2+2" />
  ),
};

export const GoodAnswer: Story = {
  render: () => (
    <MultipleChoice
      answers={["1", "2", "3", "4"]}
      index={1}
      term="2+2"
      definition="4"
      userAnswer="4"
    />
  ),
};

export const WrongAnswer: Story = {
  render: () => (
    <MultipleChoice
      answers={["1", "2", "3", "4"]}
      index={1}
      term="2+2"
      definition="4"
      userAnswer="3"
    />
  ),
};
