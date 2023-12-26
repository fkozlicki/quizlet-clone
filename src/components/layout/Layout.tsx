import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState, type PropsWithChildren } from "react";
import { api } from "../../utils/api";
import AuthDropdown from "./AuthDropdown";
import FolderModal from "./FolderModal";
import MobileMenu from "./MobileMenu";
import Navbar from "./Navbar";
import FlashcardModal from "../pages/study-set/FlashcardModal";

const Layout = ({ children }: PropsWithChildren) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const { pathname } = useRouter();
  const { data: session } = useSession();

  const { mutate: createActivity } = api.activity.create.useMutation();

  useEffect(() => {
    if (session) {
      createActivity();
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
    <>
      <Navbar openMobileMenu={openMobileMenu} />
      <main className="min-h-[calc(100vh-65px)] bg-slate-100">
        <div
          className={`${pathname === "/" ? "" : "m-auto max-w-6xl px-4 py-12"}`}
        >
          {children}
        </div>
      </main>
      {!session && <AuthDropdown />}
      <MobileMenu open={mobileMenuOpen} onClose={closeMobileMenu} />
      {session && <FolderModal session={session} />}
      {session && <FlashcardModal />}
    </>
  );
};

export default Layout;
