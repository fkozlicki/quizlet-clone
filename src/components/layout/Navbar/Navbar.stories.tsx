import type { Meta, StoryObj } from "@storybook/react";

import Navbar from ".";
import { useState } from "react";
import MobileMenu from "../MobileMenu";
import FolderModal from "../FolderModal";
import FolderModalProvider from "@/contexts/FolderModalContext";
import AuthDropdown from "../AuthDropdown";
import AuthDropdownProvider from "@/contexts/AuthDropdownContext";

const meta: Meta<typeof Navbar> = {
  component: Navbar,
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Default: Story = {
  render: () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

    const openMobileMenu = () => {
      setMobileMenuOpen(true);
    };

    const closeMobileMenu = () => {
      setMobileMenuOpen(false);
    };

    return (
      <FolderModalProvider>
        <AuthDropdownProvider>
          <Navbar openMobileMenu={openMobileMenu} />
          <MobileMenu open={mobileMenuOpen} onClose={closeMobileMenu} />
          <FolderModal session={{ expires: "", user: { id: "123" } }} />
          <AuthDropdown />
        </AuthDropdownProvider>
      </FolderModalProvider>
    );
  },
};
