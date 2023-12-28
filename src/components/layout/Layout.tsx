import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState, type PropsWithChildren } from "react";
import { api } from "../../utils/api";
import AuthDropdown from "./AuthDropdown";
import FolderModal from "./FolderModal";
import MobileMenu from "./MobileMenu";
import Navbar from "./Navbar";
import FlashcardModal from "./FlashcardModal";

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
      <MobileMenu open={mobileMenuOpen} onClose={closeMobileMenu} />
      {!session && <AuthDropdown />}
      {session && (
        <>
          <FolderModal session={session} />
          <FlashcardModal />
        </>
      )}
    </>
  );
};

export default Layout;
