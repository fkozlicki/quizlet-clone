import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { Bars3Icon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Avatar, Button, Dropdown, Tag } from "antd";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuthDropdownContext } from "../../contexts/AuthDropdownContext";
import { useFolderModalContext } from "../../contexts/FolderModalContext";

interface NavbarProps {
  openMobileMenu: () => void;
}

const Navbar = ({ openMobileMenu }: NavbarProps) => {
  const { data: session } = useSession();
  const { push } = useRouter();
  const [, dispatchAuthDropdown] = useAuthDropdownContext();
  const [, dispatchFolderModal] = useFolderModalContext();

  const handleCreateFolder = () => {
    if (session) {
      dispatchFolderModal({ type: "open" });
    } else {
      dispatchAuthDropdown("openLogin");
    }
  };

  const handleCreateStudySet = async () => {
    if (session) {
      await push("/create-set");
    } else {
      dispatchAuthDropdown("openLogin");
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
            <Link
              href="/"
              className="mx-3 hidden h-full text-lg font-medium leading-[4rem] lg:block"
            >
              Home
            </Link>
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
                <Button onClick={() => dispatchAuthDropdown("openLogin")}>
                  Log in
                </Button>
                <Button
                  onClick={() => dispatchAuthDropdown("openSignup")}
                  type="primary"
                >
                  Sign up
                </Button>
              </div>
            )}
            {session && session.user && (
              <Dropdown
                trigger={["click"]}
                menu={{
                  items: [
                    {
                      key: 0,
                      label: (
                        <div className="flex items-center gap-2">
                          <Avatar
                            className="relative cursor-pointer"
                            icon={<UserOutlined />}
                            src={
                              session.user.image && (
                                <Image
                                  src={session.user.image}
                                  alt="profile image"
                                  fill={true}
                                />
                              )
                            }
                          />
                          <div className="text-start">
                            <div className="text-sm">{session.user.name}</div>
                            <div className="max-w-[8rem] overflow-hidden text-ellipsis text-sm">
                              {session.user.email}
                            </div>
                          </div>
                        </div>
                      ),
                    },
                    {
                      label: <Link href={`/${session.user.id}`}>Profile</Link>,
                      key: 1,
                    },
                    {
                      label: <Link href={`settings`}>Settings</Link>,
                      key: 2,
                    },
                    {
                      label: (
                        <div>
                          Dark mode
                          <Tag color="processing" className="ml-2 leading-4">
                            soon
                          </Tag>
                        </div>
                      ),
                      key: 3,
                    },
                    {
                      label: <span onClick={() => signOut()}>Log out</span>,
                      key: 4,
                    },
                  ],
                }}
              >
                <Avatar
                  className="relative cursor-pointer"
                  icon={<UserOutlined />}
                  src={
                    session.user.image && (
                      <Image
                        src={session.user.image}
                        alt="profile image"
                        fill={true}
                      />
                    )
                  }
                />
              </Dropdown>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
