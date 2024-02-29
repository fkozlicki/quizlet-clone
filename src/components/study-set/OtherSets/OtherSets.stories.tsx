import type { Meta, StoryObj } from "@storybook/react";

import OtherSets from ".";

const meta: Meta<typeof OtherSets> = {
  component: OtherSets,
};

export default meta;
type Story = StoryObj<typeof OtherSets>;

export const Default: Story = {
  render: () => (
    <OtherSets
      otherSets={[
        {
          title: "set 1",
          description: "",
          _count: { cards: 12 },
          id: "123",
          createdAt: new Date(),
          user: { id: "123", name: "John Doe", image: null },
          userId: "123",
        },
        {
          title: "set 2",
          description: "",
          _count: { cards: 7 },
          id: "123",
          createdAt: new Date(),
          user: { id: "123", name: "John Doe", image: null },
          userId: "123",
        },
        {
          title: "set 3",
          description: "",
          _count: { cards: 33 },
          id: "123",
          createdAt: new Date(),
          user: { id: "123", name: "John Doe", image: null },
          userId: "123",
        },
        {
          title: "set 4",
          description: "",
          _count: { cards: 9 },
          id: "123",
          createdAt: new Date(),
          user: { id: "123", name: "John Doe", image: null },
          userId: "123",
        },
      ]}
    />
  ),
  parameters: {
    nextAuthMock: {
      session: "unknown",
    },
  },
};
