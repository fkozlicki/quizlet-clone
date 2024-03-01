import type { Meta, StoryObj } from "@storybook/react";

import FolderStudySet from ".";

const meta: Meta<typeof FolderStudySet> = {
  component: FolderStudySet,
};

export default meta;
type Story = StoryObj<typeof FolderStudySet>;

export const Default: Story = {
  render: () => (
    <FolderStudySet
      userId="123"
      folderId="123"
      setsInFolder={[]}
      slug=""
      studySet={{
        id: "123",
        title: "example study set",
        description: "Lorem ipsum",
        _count: { cards: 12 },
        createdAt: new Date(),
        user: {
          id: "123",
          image: null,
          name: "John Doe",
        },
        userId: "123",
      }}
    />
  ),
  parameters: {
    nextAuthMock: {
      session: "unknown",
    },
  },
};
