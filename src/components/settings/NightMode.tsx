import { BgColorsOutlined } from "@ant-design/icons";
import { Card, Switch, Typography, theme } from "antd";
import { useThemeContext } from "../../contexts/ThemeProvider";

const NightMode = () => {
  const { darkMode, switchDarkMode } = useThemeContext();
  const {
    token: { colorText },
  } = theme.useToken();

  return (
    <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:gap-8">
      <div className="flex items-center gap-2 lg:basis-48 lg:flex-col lg:justify-center">
        <BgColorsOutlined
          className="text-6xl"
          style={{
            color: colorText,
          }}
        />
        <Typography.Text className="text-xl font-semibold">
          Night Mode
        </Typography.Text>
      </div>
      <Card className="flex-1">
        <Switch value={darkMode} onChange={switchDarkMode} />
      </Card>
    </div>
  );
};

export default NightMode;
