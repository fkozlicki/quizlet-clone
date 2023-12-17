import { DownOutlined } from "@ant-design/icons";
import { Bars3Icon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Button, Dropdown } from "antd";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthDropdownContext } from "../../contexts/AuthDropdownContext";
import ProfileImage from "../ProfileImage";

interface NavbarProps {
  openMobileMenu: () => void;
  openCreateFolder: () => void;
}

const Navbar = ({ openMobileMenu, openCreateFolder }: NavbarProps) => {
  const { data: session } = useSession();
  const [menuDropdownOpen, setMenuDropdownOpen] = useState<boolean>(false);
  const { push, pathname } = useRouter();
  const [, dispatch] = useAuthDropdownContext();

  useEffect(() => {
    setMenuDropdownOpen(false);
  }, [pathname]);

  const toggleMenuDropdown = () => {
    setMenuDropdownOpen((prev) => !prev);
  };

  const handleCreateFolder = () => {
    if (session) {
      openCreateFolder();
    } else {
      dispatch("openLogin");
    }
  };

  const handleCreateStudySet = async () => {
    if (session) {
      await push("/create-set");
    } else {
      dispatch("openLogin");
    }
  };

  return (
    <div className="sticky top-0 z-30 border-b bg-white">
      <div className="h-16 px-4 md:h-16">
        <div className="flex h-full justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="hidden h-full px-2 leading-[4rem] md:flex md:items-center"
            >
              <Image src="/logo.svg" alt="logo" width={110} height={24} />
            </Link>
            <div className="hidden h-full md:flex">
              <Link
                href="/"
                className="mx-3 hidden h-full text-lg font-medium leading-[4rem] lg:block"
              >
                Home
              </Link>
            </div>
            <Dropdown
              menu={{
                items: [
                  {
                    label: <div onClick={handleCreateStudySet}>Study Set</div>,
                    key: 0,
                  },
                  {
                    label: <div onClick={handleCreateFolder}>Folder</div>,
                    key: 1,
                  },
                ],
              }}
              trigger={["click"]}
            >
              <Button icon={<DownOutlined />}>Create</Button>
            </Dropdown>
            <button onClick={openMobileMenu} className="md:hidden">
              <Bars3Icon width={32} height={32} />
            </button>
          </div>
          <div className="flex items-center">
            <div className="flex h-full items-center px-2">
              <div className="hidden max-w-[15rem] items-center gap-2 rounded-md border border-gray-200 bg-slate-100 px-2 py-1 lg:flex">
                <MagnifyingGlassIcon className="h-5 w-5" />
                <input
                  type="text"
                  placeholder="Study sets, textbooks, questions"
                  className="hidden flex-1 text-ellipsis bg-transparent pr-9 outline-none placeholder:text-base placeholder:font-medium placeholder:tracking-wider placeholder:text-black md:block"
                />
              </div>
              <button className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-400 hover:border-slate-500 hover:text-slate-500 lg:hidden">
                <MagnifyingGlassIcon className="h-4 w-4" />
              </button>
            </div>
            {!session && (
              <div className="flex gap-4">
                <Button onClick={() => dispatch("openLogin")}>Log in</Button>
                <Button onClick={() => dispatch("openSignup")} type="primary">
                  Sign up
                </Button>
              </div>
            )}
            {session && session.user && (
              <div className="relative">
                <button
                  onClick={toggleMenuDropdown}
                  className="flex items-center"
                >
                  <ProfileImage
                    image={session.user.image}
                    userName={session.user.name}
                    size={32}
                    fontSize={16}
                  />
                </button>
                <div
                  className={`absolute top-[120%] right-0 z-20 min-w-[14rem] rounded-2xl border bg-white shadow-lg ${
                    menuDropdownOpen ? "block" : "hidden"
                  }`}
                >
                  <div className="border-b">
                    <div className="flex items-center gap-4 py-4 px-6">
                      <ProfileImage
                        image={session.user.image}
                        userName={session.user.name}
                        size={32}
                        fontSize={16}
                      />
                      <div className="text-start">
                        <p className="text-sm">{session.user.name}</p>
                        <p className="max-w-[7rem] overflow-hidden text-ellipsis text-sm">
                          {session.user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col border-b py-2">
                    <Link
                      href={`/${session.user.id}`}
                      className="py-2 px-6 text-start hover:bg-slate-100"
                    >
                      Profile
                    </Link>
                    <Link
                      href={`settings`}
                      className="py-2 px-6 text-start hover:bg-slate-100"
                    >
                      Settings
                    </Link>
                    <button className="py-2 px-6 text-start hover:bg-slate-100">
                      Dark mode
                      <span className="ml-2 rounded-md bg-blue-700 px-2 text-sm text-white">
                        soon
                      </span>
                    </button>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => signOut()}
                      className="w-full whitespace-nowrap py-2 px-6 text-start hover:bg-slate-100"
                    >
                      Log out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
