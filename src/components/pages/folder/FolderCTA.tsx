import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Tooltip } from "antd";
import { useFolderModalContext } from "../../../contexts/FolderModalContext";
import type { EditFolderValues } from "../../../schemas/folder";

interface FolderCTAProps {
  defaultData: EditFolderValues;
  openAddSetModal: () => void;
}

const FolderCTA = ({ defaultData, openAddSetModal }: FolderCTAProps) => {
  const [, dispatch] = useFolderModalContext();

  const openFolderModal = () => {
    dispatch({ type: "setDefaultData", payload: defaultData });
    dispatch({ type: "open" });
  };

  return (
    <div className="flex gap-2">
      <Tooltip title="Add set">
        <Button
          icon={<PlusOutlined />}
          onClick={openAddSetModal}
          shape="circle"
          size="large"
        />
      </Tooltip>
      <Dropdown
        trigger={["click"]}
        placement="bottomRight"
        menu={{
          items: [
            {
              key: "1",
              label: "Edit",
              icon: <EditOutlined />,
              onClick: openFolderModal,
            },
            { key: "2", label: "Delete", icon: <DeleteOutlined /> },
          ],
        }}
      >
        <Button icon={<EllipsisOutlined />} shape="circle" size="large" />
      </Dropdown>
    </div>
  );
};

export default FolderCTA;
