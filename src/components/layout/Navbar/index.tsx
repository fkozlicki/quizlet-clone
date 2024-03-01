"use client";

import { DownOutlined, MenuOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Dropdown, theme } from "antd";
import Text from "antd/es/typography/Text";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthDropdownContext } from "../../../contexts/AuthDropdownContext";
import { useFolderModalContext } from "../../../contexts/FolderModalContext";
import { useThemeContext } from "../../../contexts/ThemeProvider";

interface NavbarProps {
  openMobileMenu: () => void;
}

const Navbar = ({ openMobileMenu }: NavbarProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [, dispatchAuthDropdown] = useAuthDropdownContext();
  const [, dispatchFolderModal] = useFolderModalContext();
  const { switchDarkMode } = useThemeContext();
  const {
    token: { colorBgContainer, colorBorder },
  } = theme.useToken();

  const handleCreateFolder = () => {
    if (session) {
      dispatchFolderModal({ type: "open" });
    } else {
      dispatchAuthDropdown("openLogin");
    }
  };

  const handleCreateStudySet = async () => {
    if (session) {
      router.push("/create-set");
    } else {
      dispatchAuthDropdown("openLogin");
    }
  };

  return (
    <div
      className="sticky top-0 z-30 border-b"
      style={{
        background: colorBgContainer,
        borderColor: colorBorder,
      }}
    >
      <div className="h-16 px-4 md:h-16">
        <div className="flex h-full justify-between">
          <div className="flex items-center">
            <Button
              onClick={openMobileMenu}
              icon={<MenuOutlined />}
              className="md:hidden"
            />
            <Link
              href="/"
              className="hidden h-full px-2 leading-[4rem] md:flex md:items-center"
            >
              <Image src="/logo.svg" alt="logo" width={110} height={24} />
            </Link>
            <Link
              href={session ? "/latest" : "/"}
              className="mx-3 hidden h-full text-sm font-medium leading-[4rem] md:block"
            >
              <Text className="">Home</Text>
            </Link>
            <Dropdown
              className="hidden md:block"
              menu={{
                items: [
                  {
                    label: <div onClick={handleCreateStudySet}>Study set</div>,
                    key: 0,
                  },
                  {
                    label: "Folder",
                    key: 1,
                    onClick: handleCreateFolder,
                  },
                ],
              }}
              trigger={["click"]}
            >
              <Button icon={<DownOutlined />} className="ml-2">
                Create
              </Button>
            </Dropdown>
          </div>
          <div className="flex items-center">
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
                      key: "0",
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
                      key: "1",
                    },
                    {
                      label: <Link href={`/settings`}>Settings</Link>,
                      key: "2",
                    },
                    {
                      label: "Dark mode",
                      key: "3",
                      onClick: switchDarkMode,
                    },
                    {
                      key: "4",
                      label: "Sign out",
                      onClick: () => void signOut(),
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
