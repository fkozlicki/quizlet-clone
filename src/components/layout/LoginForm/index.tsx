import { GithubOutlined, GoogleOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Divider, Form, Input } from "antd";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().min(1, "Enter email").email("Enter valid email"),
  password: z.string().min(1, "Enter password"),
});

type LoginInputs = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const {
    handleSubmit,
    formState: { isValid },
    control,
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const handleLogin = (data: LoginInputs) => {
    void signIn("credentials", {
      ...data,
    });
  };

  return (
    <>
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
      <Divider className="text-sm text-gray-400">OR</Divider>
      <Form onFinish={handleSubmit(handleLogin)} layout="vertical">
        <FormItem control={control} name="email" label="Password">
          <Input
            placeholder="Type your email address or username"
            size="large"
            type="email"
          />
        </FormItem>
        <FormItem control={control} name="password" label="Password">
          <Input.Password placeholder="Type your password" size="large" />
        </FormItem>
        <p className="mb-6 mt-6 text-center text-sm">
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
      </Form>
    </>
  );
};

export default LoginForm;
