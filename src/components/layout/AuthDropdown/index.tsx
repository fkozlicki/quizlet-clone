import { CloseOutlined } from "@ant-design/icons";
import { Button, Drawer, Tabs } from "antd";
import Image from "next/image";
import { useAuthDropdownContext } from "../../../contexts/AuthDropdownContext";
import LoginForm from "../LoginForm";
import SignupForm from "../SignupForm";

const AuthDropdown = () => {
  const [state, dispatch] = useAuthDropdownContext();

  const open = state === "closed" ? false : true;

  const closeDrawer = () => {
    dispatch("close");
  };

  return (
    <Drawer
      placement="top"
      open={open}
      onClose={closeDrawer}
      height="100vh"
      classNames={{ header: "hidden", body: "p-0 flex relative" }}
    >
      <Button
        type="text"
        onClick={closeDrawer}
        className="absolute right-4 top-4 z-10"
        icon={<CloseOutlined />}
      ></Button>
      <div className="relative hidden flex-1 border-r lg:block">
        <Image src="/login.svg" alt="login image" fill />
        <Image
          src="/logo.svg"
          alt="logo"
          width={220}
          height={48}
          className="absolute left-10 top-14"
        />
      </div>
      <div className="flex-1 ">
        <div className="p-4 xl:px-20 xl:py-12">
          <Tabs
            defaultActiveKey="login"
            activeKey={state}
            onChange={(key) =>
              dispatch(key === "login" ? "openLogin" : "openSignup")
            }
            size="large"
            items={[
              {
                key: "login",
                label: "Login",
                children: <LoginForm />,
              },
              {
                key: "signup",
                label: "Signup",
                children: <SignupForm />,
              },
            ]}
          />
        </div>
      </div>
    </Drawer>
  );
};

export default AuthDropdown;
