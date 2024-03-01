import type { Meta, StoryObj } from "@storybook/react";

import FolderModal from ".";
import FolderModalProvider, {
  useFolderModalContext,
} from "@/contexts/FolderModalContext";
import { Button } from "antd";
import { useEffect } from "react";

const meta: Meta<typeof FolderModal> = {
  component: FolderModal,
  decorators: [
    (Story) => (
      <FolderModalProvider>
        <Story />
      </FolderModalProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FolderModal>;

export const Default: Story = {
  render: () => {
    const [, dispatch] = useFolderModalContext();

    useEffect(() => {
      dispatch({ type: "open" });
    }, []);

    return (
      <>
        <FolderModal session={{ user: { id: "123" }, expires: "" }} />
        <Button onClick={() => dispatch({ type: "open" })}>Open</Button>
      </>
    );
  },
};
