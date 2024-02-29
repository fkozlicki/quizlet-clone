import type { Meta, StoryObj } from "@storybook/react";

import AddToFolderModal from ".";
import { useState } from "react";
import FolderModalProvider from "@/contexts/FolderModalContext";
import FolderModal from "@/components/layout/FolderModal";
import { Button } from "antd";

const meta: Meta<typeof AddToFolderModal> = {
  component: AddToFolderModal,
};

export default meta;
type Story = StoryObj<typeof AddToFolderModal>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true);

    return (
      <FolderModalProvider>
        <FolderModal session={{ user: { id: "123" }, expires: "" }} />
        <AddToFolderModal
          open={open}
          onCancel={() => setOpen(false)}
          setId="123"
          userId="123"
        />
        <Button onClick={() => setOpen(true)}>Open</Button>
      </FolderModalProvider>
    );
  },
  parameters: {
    nextAuthMock: {
      session: "unknown",
    },
  },
};
