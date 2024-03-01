import type { Meta, StoryObj } from "@storybook/react";

import AuthDropdown from ".";
import AuthDropdownProvider, {
  useAuthDropdownContext,
} from "@/contexts/AuthDropdownContext";
import { useEffect } from "react";
import { Button } from "antd";

const meta: Meta<typeof AuthDropdown> = {
  component: AuthDropdown,
  decorators: [
    (Story) => (
      <AuthDropdownProvider>
        <Story />
      </AuthDropdownProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AuthDropdown>;

export const Default: Story = {
  render: () => {
    const [, dispatch] = useAuthDropdownContext();

    useEffect(() => {
      dispatch("openLogin");
    }, []);

    return (
      <>
        <AuthDropdown />
        <Button onClick={() => dispatch("openLogin")}>Open</Button>
      </>
    );
  },
};
