import type { Meta, StoryObj } from "@storybook/react";

import StudySetCTA from ".";
import FolderModal from "@/components/layout/FolderModal";
import FolderModalProvider from "@/contexts/FolderModalContext";

const meta: Meta<typeof StudySetCTA> = {
  component: StudySetCTA,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof StudySetCTA>;

export const Default: Story = {
  render: () => <StudySetCTA setId="123" studySetName="Math" userId="123" />,
  parameters: {
    nextAuthMock: {
      session: "unknown",
    },
    nextjs: {
      appDirectory: true,
    },
  },
};

export const Owner: Story = {
  render: () => <StudySetCTA setId="123" studySetName="Math" userId="123" />,
  parameters: {
    nextAuthMock: {
      session: {
        data: {
          user: {
            id: "123",
          },
        },
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <FolderModalProvider>
          <FolderModal session={{ user: { id: "123" }, expires: "" }} />
          <Story />
        </FolderModalProvider>
      );
    },
  ],
};
