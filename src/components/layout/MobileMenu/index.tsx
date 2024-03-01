import { UserOutlined } from "@ant-design/icons";
import { Avatar, Drawer, Menu, theme } from "antd";
import type { MenuProps } from "antd/es/menu";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import type { Key, ReactNode } from "react";
import { useAuthDropdownContext } from "../../../contexts/AuthDropdownContext";
import { useFolderModalContext } from "../../../contexts/FolderModalContext";
import { useThemeContext } from "../../../contexts/ThemeProvider";
import { useRouter } from "next/navigation";

type MenuItem = Required<MenuProps>["items"][number];

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const MobileMenu = ({ open, onClose }: MobileMenuProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [, dispatchAuthDropdown] = useAuthDropdownContext();
  const [, dispatchFolderModal] = useFolderModalContext();
  const { switchDarkMode } = useThemeContext();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleCreateFolder = () => {
    if (session) {
      dispatchFolderModal({ type: "open" });
    } else {
      dispatchAuthDropdown("openLogin");
    }
    onClose();
  };

  const handleCreateStudySet = async () => {
    if (session) {
      router.push("/create-set");
    } else {
      dispatchAuthDropdown("openLogin");
    }
    onClose();
  };

  function getItem(
    label: ReactNode,
    key?: Key | null,
    icon?: ReactNode,
    children?: MenuItem[],
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
    } as MenuItem;
  }

  return (
    <Drawer
      placement="left"
      width="100vw"
      open={open}
      onClose={onClose}
      className="md:hidden"
      classNames={{
        mask: "md:hidden",
      }}
      style={{
        background: colorBgContainer,
      }}
    >
      <Menu
        mode="inline"
        className="border-0"
        items={[
          getItem(<Link href="/latest">Home</Link>, "1"),
          getItem("Create", "2", undefined, [
            {
              key: "1",
              label: "Study set",
              onClick: () => void handleCreateStudySet(),
            },
            {
              key: "2",
              label: "Folder",
              onClick: handleCreateFolder,
            },
          ]),
        ].concat(
          session
            ? [
                { key: "3", type: "divider", className: "my-4" },
                getItem(
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
                      <div className="overflow-hidden text-ellipsis text-sm">
                        {session.user.email}
                      </div>
                    </div>
                  </div>,
                  "4",
                ),
                getItem(<Link href={`/${session.user.id}`}>Profile</Link>, "5"),
                getItem(<Link href="/settings">Settings</Link>, "6"),
                { key: "7", label: "Dark mode", onClick: switchDarkMode },
                {
                  label: "Logout",
                  key: "8",
                  onClick: () => void signOut(),
                },
              ]
            : [],
        )}
      />
    </Drawer>
  );
};

export default MobileMenu;
