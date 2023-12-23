import { GithubOutlined, GoogleOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, message } from "antd";
import { signIn } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().min(1, "Enter email").email("Enter valid email"),
  password: z.string().min(1, "Enter password"),
});

type LoginInputs = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const {
    handleSubmit,
    formState: { errors, isValid },
    control,
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });
  const [messageApi, contextHolder] = message.useMessage();

  const handleLogin = async (data: LoginInputs) => {
    const res = await signIn("credentials", {
      ...data,
    });

    if (!res) return;

    if (res?.status === 200) {
      await messageApi.success("Successfuly logged in");
    } else {
      await messageApi.success("Couldn't log in");
    }
  };

  return (
    <div>
      {contextHolder}
      <div className="flex flex-col gap-4">
        <Button
          onClick={() => signIn("google", { redirect: false })}
          icon={<GoogleOutlined />}
          className="h-14"
        >
          Sign in with Google
        </Button>
        <Button icon={<GithubOutlined />} className="h-14">
          Sign in with Github
        </Button>
      </div>
      <div className="my-6 flex items-center">
        <div className="h-px flex-1 bg-slate-200"></div>
        <div className="px-4">OR</div>
        <div className="h-px flex-1 bg-slate-200"></div>
      </div>
      <form onSubmit={handleSubmit(handleLogin)}>
        <div className="flex flex-col gap-4">
          <Controller
            name="email"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input
                status={errors.email && "error"}
                placeholder="Type your email address or username"
                type="email"
                size="large"
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { value, onChange } }) => (
              <Input.Password
                status={errors.password && "error"}
                placeholder="Type your password"
                size="large"
                value={value}
                onChange={onChange}
              />
            )}
          />
        </div>
        <p className="mt-6 mb-6 text-center text-sm">
          By clicking Log in, you accept Flashit&apos;s Terms of Service and
          Privacy Policy
        </p>
        <Button
          disabled={!isValid}
          type="primary"
          className="h-16 w-full"
          htmlType="submit"
        >
          Log in
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
