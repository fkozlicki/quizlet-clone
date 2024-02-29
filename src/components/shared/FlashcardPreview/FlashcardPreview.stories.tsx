import type { Meta, StoryObj } from "@storybook/react";

import FlashcardPreview from ".";

const meta: Meta<typeof FlashcardPreview> = {
  component: FlashcardPreview,
};

export default meta;
type Story = StoryObj<typeof FlashcardPreview>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Default: Story = {
  render: () => (
    <FlashcardPreview
      flashcard={{
        id: "123",
        term: "2+2",
        definition: "4",
        position: 1,
        studySetId: "123",
        starred: false,
      }}
    />
  ),
  parameters: {
    nextAuthMock: {
      session: "unknown",
    },
  },
};
