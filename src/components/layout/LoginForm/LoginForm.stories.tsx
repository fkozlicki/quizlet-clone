import type { Meta, StoryObj } from "@storybook/react";

import LoginForm from ".";

const meta: Meta<typeof LoginForm> = {
  component: LoginForm,
  decorators: [
    (Story) => (
      <div className="max-w-xl bg-white p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LoginForm>;

export const Default: Story = {
  render: () => <LoginForm />,
};
