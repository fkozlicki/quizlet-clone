import { GithubOutlined, GoogleOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Checkbox,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
} from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { signIn } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";
import { z } from "zod";
import { useAuthDropdownContext } from "../../contexts/AuthDropdownContext";
import { api } from "../../utils/api";

dayjs.extend(customParseFormat);

const credentialsSchema = z.object({
  birthday: z.string().min(1, "Birthday is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  name: z.string().min(1, "Name is required"),
  password: z.string().min(1, "Password is required"),
  accepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept Terms and Conditions" }),
  }),
});

type CredentialsInputs = z.infer<typeof credentialsSchema>;

const SignupForm = () => {
  const [, dispatch] = useAuthDropdownContext();
  const {
    handleSubmit,
    control,
    reset,
    formState: { isValid, errors },
  } = useForm<CredentialsInputs>({
    resolver: zodResolver(credentialsSchema),
    mode: "onChange",
  });
  const createUser = api.user.create.useMutation({
    onSuccess: () => {
      reset();
      void message.success("Created successfully");
    },
    onError: () => {
      void message.error("Couldn't create user");
    },
  });

  const onSubmit = (data: CredentialsInputs) => {
    createUser.mutate(data);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <Button
          onClick={() => signIn("google", { redirect: false })}
          icon={<GoogleOutlined />}
          className="h-14"
        >
          Sign up with Google
        </Button>
        <Button icon={<GithubOutlined />} className="h-14">
          Sign up with Github
        </Button>
      </div>
      <Divider className="text-sm text-gray-400">OR</Divider>
      <Form
        onFinish={handleSubmit(onSubmit)}
        layout="vertical"
        fields={[
          {
            name: "birthday",
            errors: errors.birthday?.message
              ? [errors.birthday.message]
              : undefined,
          },
        ]}
      >
        <Form.Item label="Birthday">
          <Controller
            name="birthday"
            control={control}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <DatePicker
                size="large"
                className="w-full"
                placeholder="Select your birthday"
                value={value ? dayjs(value) : undefined}
                onChange={(date) => onChange(date ? date.format() : "")}
                status={error ? "error" : undefined}
              />
            )}
          />
        </Form.Item>
        <FormItem control={control} name="email" label="Email">
          <Input size="large" type="email" placeholder="example@email.com" />
        </FormItem>
        <FormItem control={control} name="name" label="Name">
          <Input size="large" type="text" placeholder="John Doe" />
        </FormItem>
        <FormItem control={control} name="password" label="Password">
          <Input.Password size="large" placeholder="•••••" />
        </FormItem>
        <FormItem control={control} name="accepted">
          <div className="flex items-center gap-3">
            <Checkbox />
            <div>
              I accept Quizlet&apos;s <span>Terms of Service</span> and{" "}
              <span>Privacy Policy</span>
            </div>
          </div>
        </FormItem>
        <Button
          disabled={!isValid}
          type="primary"
          className="mt-2 h-10 w-full"
          htmlType="submit"
        >
          Sign up
        </Button>
      </Form>
      <div className="mt-4 rounded border-2 border-slate-200 p-2">
        <div className="text-center font-medium text-slate-500">
          Already have an account?{" "}
          <span
            className="cursor-pointer text-cyan-400 hover:text-cyan-500"
            onClick={() => dispatch("openLogin")}
          >
            Log in
          </span>
        </div>
      </div>
    </>
  );
};

export default SignupForm;
