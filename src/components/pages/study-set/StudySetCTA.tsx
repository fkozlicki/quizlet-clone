import {
  ArrowUpTrayIcon,
  EllipsisHorizontalIcon,
  PencilIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import React from "react";
import IconButton from "../../IconButton";
import { Button, Dropdown, Tooltip } from "antd";
import {
  ApiOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EllipsisOutlined,
  PlusOutlined,
  PrinterOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import Link from "next/link";

interface StudySetCTAProps {
  userId: string;
  setId: string;
}

const StudySetCTA = ({ userId, setId }: StudySetCTAProps) => {
  const { data: session } = useSession();

  return (
    <div className="flex gap-2">
      <Tooltip title="Add to folder">
        <Button shape="circle" icon={<PlusOutlined />} size="large" />
      </Tooltip>
      {session?.user.id === userId && (
        <Tooltip title="Edit">
          <Link href={`${setId}/edit`}>
            <Button shape="circle" icon={<EditOutlined />} size="large" />
          </Link>
        </Tooltip>
      )}
      <Tooltip title="Share">
        <Button shape="circle" icon={<ShareAltOutlined />} size="large" />
      </Tooltip>
      <Dropdown
        placement="bottomRight"
        menu={{
          items: [
            {
              key: 0,
              label: "Combine",
              icon: <ApiOutlined className="mr-4 text-lg" />,
            },
            {
              key: 1,
              label: "Print",
              icon: <PrinterOutlined className="mr-4 text-lg" />,
            },
            {
              key: 2,
              label: "Export",
              icon: <DownloadOutlined className="mr-4 text-lg" />,
            },
            {
              key: 3,
              label: "Delete",
              icon: <DeleteOutlined className="mr-4 text-lg" />,
            },
          ],
        }}
        trigger={["click"]}
      >
        <Tooltip title="More">
          <Button shape="circle" icon={<EllipsisOutlined />} size="large" />
        </Tooltip>
      </Dropdown>
    </div>
  );
};

export default StudySetCTA;
