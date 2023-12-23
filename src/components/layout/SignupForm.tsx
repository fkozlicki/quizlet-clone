import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../../utils/api";
import { toast } from "react-hot-toast";
import { Button, Checkbox, DatePicker, Input } from "antd";
import { GithubOutlined, GoogleOutlined } from "@ant-design/icons";
import { signIn } from "next-auth/react";
import dayjs from "dayjs";
import { useAuthDropdownContext } from "../../contexts/AuthDropdownContext";

const credentialsSchema = z.object({
  birthday: z.string().min(1, "Enter your birthday"),
  email: z.string().min(1, "Enter your email").email("Enter a valid email"),
  name: z.string().min(1, "Enter your name"),
  password: z.string().min(1, "Enter your password"),
  accepted: z.literal(true),
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
    mode: "onChange",
    resolver: zodResolver(credentialsSchema),
  });
  const createUser = api.user.create.useMutation({
    onSuccess: () => {
      reset();
      toast("Created successfuly", {
        icon: "✅",
      });
    },
    onError: () => {
      toast("Couldn't create user", {
        icon: "❌",
      });
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
          Sign in with Google
        </Button>
        <Button icon={<GithubOutlined />} className="h-14">
          Sign in with Github
        </Button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
        <div className="flex flex-col gap-4">
          <Controller
            name="birthday"
            control={control}
            render={({ field: { value, onChange } }) => (
              <DatePicker
                status={errors.birthday && "error"}
                size="large"
                className="w-full"
                placeholder="Select your birthday"
                value={value ? dayjs(value) : null}
                onChange={(date) => onChange(date ? date.format() : null)}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input
                status={errors.email && "error"}
                size="large"
                type="email"
                placeholder="example@email.com"
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Controller
            name="name"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input
                status={errors.name && "error"}
                size="large"
                type="text"
                placeholder="John Doe"
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input.Password
                status={errors.password && "error"}
                size="large"
                placeholder="•••••"
                value={value}
                onChange={onChange}
              />
            )}
          />

          <div className="flex items-center gap-3">
            <Controller
              name="accepted"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Checkbox value={value} onChange={onChange} />
              )}
            />
            <div>
              I accept Quizlet&apos;s <span>Terms of Service</span> and{" "}
              <span>Privacy Policy</span>
            </div>
          </div>
          <Button disabled={!isValid} type="primary" className="h-10">
            Sign up
          </Button>
        </div>
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
      </form>
    </>
  );
};

export default SignupForm;
