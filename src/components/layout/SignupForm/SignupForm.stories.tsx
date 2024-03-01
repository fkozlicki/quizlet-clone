import type { Meta, StoryObj } from "@storybook/react";

import SignupForm from ".";

const meta: Meta<typeof SignupForm> = {
  component: SignupForm,
  decorators: [
    (Story) => (
      <div className="max-w-xl bg-white p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SignupForm>;

export const Default: Story = {
  render: () => <SignupForm />,
};
