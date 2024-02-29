import type { Meta, StoryObj } from "@storybook/react";

import StudySetSkeleton from ".";

const meta: Meta<typeof StudySetSkeleton> = {
  component: StudySetSkeleton,
};

export default meta;
type Story = StoryObj<typeof StudySetSkeleton>;

export const Default: Story = {
  render: () => <StudySetSkeleton />,
};
