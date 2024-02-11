"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, type PropsWithChildren } from "react";
import AuthDropdown from "./AuthDropdown";
import FolderModal from "./FolderModal";
import MobileMenu from "./MobileMenu";
import Navbar from "./Navbar";
import FlashcardModal from "./FlashcardModal";
import { theme } from "antd";
import { Inter } from "next/font/google";
import { api } from "@/trpc/react";

const inter = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const Layout = ({ children }: PropsWithChildren) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const { data: session } = useSession();
  const { mutate: createActivity } = api.activity.create.useMutation();
  const {
    token: { colorBgLayout },
  } = theme.useToken();

  // useEffect(() => {
  //   if (session) {
  //     createActivity();
  //   }
  // }, [session]);

  const openMobileMenu = () => {
    setMobileMenuOpen(true);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className={inter.className}>
      <Navbar openMobileMenu={openMobileMenu} />
      <main
        className="min-h-[calc(100vh-65px)]"
        style={{
          background: colorBgLayout,
        }}
      >
        <div className="m-auto max-w-6xl px-4 py-4 md:py-12">{children}</div>
      </main>
      <MobileMenu open={mobileMenuOpen} onClose={closeMobileMenu} />
      {!session && <AuthDropdown />}
      {session && (
        <>
          <FolderModal session={session} />
          <FlashcardModal />
        </>
      )}
    </div>
  );
};

export default Layout;
