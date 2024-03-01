import type { Meta, StoryObj } from "@storybook/react";

import MobileMenu from ".";

const meta: Meta<typeof MobileMenu> = {
  component: MobileMenu,
};

export default meta;
type Story = StoryObj<typeof MobileMenu>;

export const Default: Story = {
  render: () => (
    <div>
      <MobileMenu open={true} onClose={() => undefined} />
    </div>
  ),
};
