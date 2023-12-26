import { MoonIcon } from "@heroicons/react/24/solid";
import { Switch } from "antd";

const NightMode = () => {
  return (
    <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:gap-8">
      <div className="flex items-center gap-2 lg:basis-48 lg:flex-col lg:justify-center">
        <MoonIcon width={32} height={32} />
        <div className="text-xl font-semibold">Night Mode</div>
      </div>
      <div className="flex-1 rounded-lg bg-white p-4 shadow">
        <Switch unCheckedChildren="off" checkedChildren="on" />
      </div>
    </div>
  );
};

export default NightMode;
