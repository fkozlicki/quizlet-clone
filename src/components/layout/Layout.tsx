import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState, type PropsWithChildren } from "react";
import { useAuthDropdownContext } from "../../contexts/AuthDropdownContext";
import { api } from "../../utils/api";
import AuthDropdown from "./AuthDropdown";
import MobileMenu from "./MobileMenu";
import Navbar from "./Navbar";
import FolderModal from "./FolderModal";

const Layout = ({ children }: PropsWithChildren) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [state] = useAuthDropdownContext();
  const { pathname } = useRouter();
  const { data: session } = useSession();

  const createActivity = api.activity.create.useMutation();

  useEffect(() => {
    if (session) {
      createActivity.mutate();
    }
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

  const openMobileMenu = () => {
    setMobileMenuOpen(true);
  };
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div
      className={`relative ${
        state === "closed" ? "" : "h-screen overflow-hidden"
      }`}
    >
      <Navbar openMobileMenu={openMobileMenu} />
      {children}
      {!session && <AuthDropdown />}
      <MobileMenu status={mobileMenuOpen} close={closeMobileMenu} />
      {session && <FolderModal session={session} />}
    </div>
  );
};

export default Layout;
