import type { Meta, StoryObj } from "@storybook/react";

import StudySetFolder from ".";

const meta: Meta<typeof StudySetFolder> = {
  component: StudySetFolder,
};

export default meta;
type Story = StoryObj<typeof StudySetFolder>;

export const Default: Story = {
  render: () => (
    <StudySetFolder
      folder={{
        id: "123",
        description: "Lorem ipsum dolor sit amet",
        slug: "example-folder",
        studySets: [],
        title: "Example folder",
        userId: "123",
      }}
      setId="123"
      userId="123"
    />
  ),
  parameters: {
    nextAuthMock: {
      session: "unknown",
    },
  },
};
