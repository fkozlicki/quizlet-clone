import type { Meta, StoryObj } from "@storybook/react";

import FlashcardModalProvider, {
  useFlashcardModalContext,
} from "@/contexts/FlashcardModalContext";
import { Button } from "antd";
import { useEffect } from "react";
import FlashcardModal from ".";

const meta: Meta<typeof FlashcardModal> = {
  component: FlashcardModal,
  decorators: [
    (Story) => (
      <FlashcardModalProvider>
        <Story />
      </FlashcardModalProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FlashcardModal>;

export const Default: Story = {
  render: () => {
    const [, dispatch] = useFlashcardModalContext();

    const open = () => {
      dispatch({
        type: "open",
        payload: {
          id: "123",
          position: 1,
          definition: "4",
          term: "2+2",
          studySetId: "123",
        },
      });
    };

    useEffect(() => {
      open();
    }, []);

    return (
      <>
        <FlashcardModal />
        <Button onClick={open}>Open</Button>
      </>
    );
  },
};
