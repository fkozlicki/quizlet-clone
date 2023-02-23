import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, {
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { toast, Toaster } from "react-hot-toast";
import { api } from "../../utils/api";
import AuthDropdown from "./AuthDropdown";
import FolderModal from "./FolderModal";
import MobileMenu from "./MobileMenu";
import Navbar from "./Navbar";

const Layout = ({ children }: PropsWithChildren) => {
  const resetForm = useRef<(() => void) | null>(null);
  const [authDropdownOpen, setAuthDropdownOpen] = useState<
    "signup" | "login" | false
  >(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [createFolderModalOpen, setCreateFolderModalOpen] =
    useState<boolean>(false);
  const { pathname, push } = useRouter();
  const { data: session } = useSession();
  const {
    mutate,
    error,
    reset: resetFolderMutation,
  } = api.folder.create.useMutation({
    onSuccess: async ({ slug }) => {
      const { current } = resetForm;
      current && current();
      session && (await push(`/${session.user.id}/folders/${slug}`));
      closeCreateFolder();
    },
    onError: () => {
      toast("Couldn't create folder");
    },
  });
  const { mutateAsync } = api.activity.create.useMutation();

  useEffect(() => {
    const createActivity = async () => {
      if (session) {
        await mutateAsync({
          userId: session.user.id,
        });
      }
    };
    createActivity().catch(console.error);
  }, [session]);

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
      {session && createFolderModalOpen && (
        <FolderModal
          closeCreateFolder={closeCreateFolder}
          variant="create"
          mutate={mutate}
          errorMessage={error?.message}
          resetForm={resetForm}
          resetFolderMutation={resetFolderMutation}
        />
      )}
    </div>
  );
};

export default Layout;
