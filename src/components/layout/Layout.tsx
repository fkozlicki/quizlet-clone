import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState, type PropsWithChildren } from "react";
import { Toaster } from "react-hot-toast";
import AuthDropdown from "./AuthDropdown";
import CreateFolder from "./CreateFolder";
import MobileMenu from "./MobileMenu";
import Navbar from "./Navbar";

const Layout = ({ children }: PropsWithChildren) => {
  const [authDropdownOpen, setAuthDropdownOpen] = useState<
    "signup" | "login" | false
  >(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [createFolderModalOpen, setCreateFolderModalOpen] =
    useState<boolean>(false);
  const { pathname } = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    closeMobileMenu();
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileMenuOpen]);

  const openSignup = () => {
    setAuthDropdownOpen("signup");
  };
  const openLogin = () => {
    setAuthDropdownOpen("login");
  };
  const closeAuthDropdown = () => {
    setAuthDropdownOpen(false);
  };
  const openMobileMenu = () => {
    setMobileMenuOpen(true);
  };
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  const openCreateFolder = () => {
    setCreateFolderModalOpen(true);
  };
  const closeCreateFolder = () => {
    setCreateFolderModalOpen(false);
  };

  return (
    <div
      className={`relative ${
        authDropdownOpen === false ? "" : "h-screen overflow-hidden"
      }`}
    >
      <Toaster position="top-center" />
      <Navbar
        openSignup={openSignup}
        openLogin={openLogin}
        openMobileMenu={openMobileMenu}
        openCreateFolder={openCreateFolder}
      />
      {children}
      {!session && (
        <AuthDropdown
          status={authDropdownOpen}
          openSignup={openSignup}
          openLogin={openLogin}
          close={closeAuthDropdown}
        />
      )}
      <MobileMenu status={mobileMenuOpen} close={closeMobileMenu} />
      <CreateFolder
        closeCreateFolder={closeCreateFolder}
        isOpen={createFolderModalOpen}
      />
    </div>
  );
};

export default Layout;
