import type { Meta, StoryObj } from "@storybook/react";

import TrueOrFalse from ".";

const meta: Meta<typeof TrueOrFalse> = {
  component: TrueOrFalse,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TrueOrFalse>;

export const Default: Story = {
  render: () => <TrueOrFalse term="2+2" answer="4" index={1} />,
};

export const CorrectWhenTrue: Story = {
  render: () => (
    <TrueOrFalse
      term="2+2"
      answer="4"
      definition="4"
      userAnswer="true"
      index={1}
      result
    />
  ),
};

export const CorrectWhenFalse: Story = {
  render: () => (
    <TrueOrFalse
      term="2+2"
      answer="8"
      definition="4"
      userAnswer="false"
      index={1}
      result
    />
  ),
};

export const IncorrectWhenTrue: Story = {
  render: () => (
    <TrueOrFalse
      term="2+2"
      answer="8"
      definition="4"
      userAnswer="true"
      index={1}
      result
    />
  ),
};

export const IncorrectWhenFalse: Story = {
  render: () => (
    <TrueOrFalse
      term="2+2"
      answer="4"
      definition="4"
      userAnswer="false"
      index={1}
      result
    />
  ),
};
