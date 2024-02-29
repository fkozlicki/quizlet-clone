import type { Meta, StoryObj } from "@storybook/react";

import StudySetPreview from ".";

const meta: Meta<typeof StudySetPreview> = {
  component: StudySetPreview,
};

export default meta;
type Story = StoryObj<typeof StudySetPreview>;

export const Default: Story = {
  render: () => (
    <StudySetPreview
      studySet={{
        id: "123",
        _count: { cards: 2 },
        createdAt: new Date(),
        description: "",
        title: "Example set",
        user: { id: "123", image: null, name: "John Doe" },
        userId: "123",
      }}
    />
  ),
};
